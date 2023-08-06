import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Plant } from './types';
const dynamodbClient = new DynamoDBClient({});
const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);

const USER_ID_ALL = 'ALL';


const queryPlants = async (currentUserId: string): Promise<Plant[]> => {
  const queryCommands = [USER_ID_ALL, currentUserId].map((userId) =>
    new QueryCommand(
      {
        TableName: process.env.PLANTS_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      },
    ),
  );

  const result = await Promise.all(queryCommands.map((queryCommand) =>
    dynamodbDocClient.send(queryCommand),
  ));

  const combinedPlants = result.map((queryResult) => queryResult.Items as Plant[]).flat();

  return combinedPlants;

};

export const handler: APIGatewayProxyHandler = async (event) => {
  const currentUserId = event.requestContext.authorizer?.claims.sub;
  const plants = await queryPlants(currentUserId);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(plants),
  };

};


