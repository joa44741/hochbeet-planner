/* eslint-disable @typescript-eslint/indent */
import { Stack, StackProps, aws_apigateway as apigw, aws_cognito as cognito, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HochbeeteFunctions } from './backend/hochbeete-functions/hochbeete-functions.construct';
import { PlantsFunctions } from './backend/plants-functions/plants-functions.construct';


interface BackendStackStatelessProps extends StackProps {
    plantsTable: dynamodb.ITable;
    hochbeeteTable: dynamodb.ITable;

}
export class BackendStackStateless extends Stack {
    constructor(scope: Construct, id: string, props: BackendStackStatelessProps) {
        super(scope, id, props);

        const api = this.createApiGateway();
        this.createApiEndpoints(api, props.plantsTable, props.hochbeeteTable);
    }

    private createApiEndpoints(api: apigw.RestApi, plantsTable: dynamodb.ITable, hochbeeteTable: dynamodb.ITable) {
        const plantsFunctions = new PlantsFunctions(this, { plantsTable });
        const hochbeeteFunctions = new HochbeeteFunctions(this, { hochbeeteTable });

        const plants = api.root.addResource('plants');
        plants.addMethod('GET', new apigw.LambdaIntegration(plantsFunctions.getPlants));

        const hochbeete = api.root.addResource('hochbeete');
        hochbeete.addMethod('GET', new apigw.LambdaIntegration(hochbeeteFunctions.getHochbeete));
        const singleHochbeet = hochbeete.addResource('{nr}');
        singleHochbeet.addMethod('PUT', new apigw.LambdaIntegration(hochbeeteFunctions.storeHochbeet));
    }

    private createApiGateway() {
        const api = new apigw.RestApi(this, 'api', {
            restApiName: 'HochbeetPlanner-Api',
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
            },
            defaultMethodOptions: {
                authorizer: new apigw.CognitoUserPoolsAuthorizer(this, 'authorizer', {
                    cognitoUserPools: [cognito.UserPool.fromUserPoolId(this, 'userPool', 'eu-central-1_3gJwyl0MP')],
                    authorizerName: 'HochbeetPlanner-Api-Authorizer',
                }),
            },
        });

        return api;
    }
}