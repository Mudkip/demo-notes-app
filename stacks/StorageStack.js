import * as sst from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
  bucket;
  notesTable;
  allowencesTable;

  constructor (scope, id, props) {
    super (scope, id, props);

    this.bucket = new sst.Bucket(this, "Uploads");

    this.notesTable = new sst.Table(this, "Notes", {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: "userId", sortKey: "noteId"
      },
    });

    this.allowencesTable = new sst.Table(this, "Allowences", {
      fields: {
        userId: sst.TableFieldType.STRING,
        notesAllowed: sst.TableFieldType.NUMBER,
      },
      primaryIndex: {
        partitionKey: "userId",
      },
    });
  }
}