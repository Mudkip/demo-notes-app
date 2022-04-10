import * as uuid from "uuid";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  const currentNotesQuery = {
    TableName: process.env.NOTES_TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };
  const currentNotesResult = await dynamoDb.query(currentNotesQuery);

  const allowenceQuery = {
    TableName: process.env.ALLOWENCES_TABLE_NAME,
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };
  const allowenceResult = await dynamoDb.get(allowenceQuery);

  let allowedNotes = process.env.FREE_NOTES;
  if (allowenceResult.Item) {
    allowedNotes += allowenceResult.Item.notesAllowed;
  }
  if ((allowedNotes - currentNotesResult.Count) <= 0) {
    throw new Error("You have used up all of your available notes.");
  }

  const noteParams = {
    TableName: process.env.NOTES_TABLE_NAME,
    Item: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: uuid.v1(),  
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };
  await dynamoDb.put(noteParams);

  return noteParams.Item;
});