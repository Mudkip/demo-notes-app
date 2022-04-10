import Stripe from "stripe";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
import { calculateCost } from "./util/cost";

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  const params = {
    TableName: process.env.ALLOWENCES_TABLE_NAME,
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
    UpdateExpression: "ADD notesAllowed :amountPurchased",
    ExpressionAttributeValues: {
      ":amountPurchased": storage,
    },
  };

  await dynamoDb.update(params);

  return { status: true };
});