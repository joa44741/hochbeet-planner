// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for StoreHochbeetFunction
 */
export interface StoreHochbeetFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/backend/hochbeete-functions/store-hochbeet.
 */
export class StoreHochbeetFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: StoreHochbeetFunctionProps) {
    super(scope, id, {
      description: 'src/backend/hochbeete-functions/store-hochbeet.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../assets/backend/hochbeete-functions/store-hochbeet.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}