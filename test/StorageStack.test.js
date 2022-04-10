import { Template, Match } from "aws-cdk-lib/assertions";
import * as sst from "@serverless-stack/resources";
import StorageStack from "../stacks/StorageStack";

test("Test StorageStack", () => {
  const app = new sst.App();
  const stack = new StorageStack(app, "test-stack");
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
    TableName: Match.stringLikeRegexp('-Notes'),
  });

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
    TableName: Match.stringLikeRegexp('-Allowences'),
  });
});