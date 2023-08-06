import { aws_dynamodb as dynamodb, aws_lambda as lambda } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface PlantsFunctionsProps {
  plantsTable: dynamodb.ITable;
}
export class PlantsFunctions extends Construct {

  readonly getPlants: lambda.Alias;

  constructor(scope: Construct, props: PlantsFunctionsProps) {
    super(scope, 'plants-functions');

    const getPlantsFunction = new NodejsFunction(this, 'getPlants', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'HochbeetPlanner-GetPlants',
      environment: {
        PLANTS_TABLE: props.plantsTable.tableName,
      },
    });

    props.plantsTable.grantReadWriteData(getPlantsFunction);
    this.getPlants = getPlantsFunction.addAlias('Live');
  }
}