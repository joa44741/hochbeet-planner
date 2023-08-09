import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Hochbeet } from '../types';

const logger = new Logger({ serviceName: 'hochbeete-functions' });

const dynamodbClient = new DynamoDBClient({});
const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);


const queryHochbeete = async (currentUserId: string): Promise<Hochbeet[]> => {
  const queryCommand = new QueryCommand(
    {
      TableName: process.env.HOCHBEETE_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': currentUserId,
      },
    },
  );
  // const hochbeetList: Hochbeet[] = [
  //   {
  //     beetNumber: 1,
  //     name: 'Beet 1 (links)',
  //     width: 185,
  //     height: 85,
  //     plantsInBeet: [
  //       { plant: brokkoli, plantNumber: 1, position: { x: 0, y: 0 } },
  //       { plant: basilikum, plantNumber: 1, position: { x: 100, y: 10 } }
  //     ]
  //   }
  // ];
  const response = await dynamodbDocClient.send(queryCommand);
  const hochbeete = response.Items as Hochbeet[];

  return hochbeete;

};

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('event', { event });
  const currentUserId = event.requestContext.authorizer!.claims.email;
  const hochbeete = await queryHochbeete(currentUserId);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(hochbeete),
  };

};


