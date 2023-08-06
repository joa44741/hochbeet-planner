/* eslint-disable @typescript-eslint/indent */
import { Stack, StackProps, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class BackendStackStateful extends Stack {
    readonly plantsTable: dynamodb.Table;
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.plantsTable = new dynamodb.Table(this, 'plantsTable', {
            partitionKey: {
                name: 'userId',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'plantName', // Id is better than name, because some plants have multiple names: Stangensellerie, Staudensellerie
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: 'HochbeetPlanner-Plants',
        });

    }


}