import { aws_dynamodb as dynamodb, aws_lambda as lambda } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface HochbeeteFunctionsProps {
  hochbeeteTable: dynamodb.ITable;
}
export class HochbeeteFunctions extends Construct {

  readonly getHochbeete: lambda.Alias;
  readonly storeHochbeet: lambda.Alias;

  constructor(scope: Construct, props: HochbeeteFunctionsProps) {
    super(scope, 'hochbeete-functions');

    const getHochbeeteFunction = new NodejsFunction(this, 'getHochbeete', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'HochbeetPlanner-GetHochbeete',
      entry: __dirname + '/get-hochbeete.lambda.ts',
      memorySize: 1024,
      environment: {
        HOCHBEETE_TABLE: props.hochbeeteTable.tableName,
      },
    });
    const storeHochbeetFunction = new NodejsFunction(this, 'storeHochbeet', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'HochbeetPlanner-StoreHochbeet',
      entry: __dirname + '/store-hochbeet.lambda.ts',
      memorySize: 1024,
      environment: {
        HOCHBEETE_TABLE: props.hochbeeteTable.tableName,
      },
    });

    props.hochbeeteTable.grantReadData(getHochbeeteFunction);
    props.hochbeeteTable.grantReadWriteData(storeHochbeetFunction);
    this.getHochbeete = getHochbeeteFunction.addAlias('Live');
    this.storeHochbeet = storeHochbeetFunction.addAlias('Live');

  }
}