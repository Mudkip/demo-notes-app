import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { notesTable, allowencesTable } = props;

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: {
          NOTES_TABLE_NAME: notesTable.tableName,
          ALLOWENCES_TABLE_NAME: allowencesTable.tableName,
          FREE_NOTES:process.env.FREE_NOTES,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
      routes: {
        "POST   /notes":      "src/create.main",
        "GET    /notes":      "src/list.main",
        "GET    /notes/{id}": "src/get.main",
        "PUT    /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
        "POST   /billing":    "src/billing.main",
      },
    });

    this.api.attachPermissions([notesTable, allowencesTable]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}