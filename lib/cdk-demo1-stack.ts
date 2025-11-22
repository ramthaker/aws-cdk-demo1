import * as cdk from 'aws-cdk-lib/core';
import * as path from 'path';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkDemo1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // DynamoDB Table
     const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambdaPath = path.join(__dirname, '..', 'lambda'); // <- robust path

    // Lambda Function
    const handler = new lambda.Function(this, 'ItemsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(lambdaPath),
      handler: 'items.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

// Lambda Function
    const handler1 = new lambda.Function(this, 'ItemsHandler1', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(lambdaPath),
      handler: 'items.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant Lambda permissions.
    table.grantReadWriteData(handler1);

    // Grant Lambda permissions.
    table.grantReadWriteData(handler);

    // API Gateway.
    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
    });

    const items = api.root.addResource('items');
    items.addMethod('GET', new apigateway.LambdaIntegration(handler));
    items.addMethod('POST', new apigateway.LambdaIntegration(handler));

     // API Gateway.
    const api1 = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
    });

    const items1 = api.root.addResource('items');
    items.addMethod('GET', new apigateway.LambdaIntegration(handler1));
    items.addMethod('POST', new apigateway.LambdaIntegration(handler1));
  }
}
