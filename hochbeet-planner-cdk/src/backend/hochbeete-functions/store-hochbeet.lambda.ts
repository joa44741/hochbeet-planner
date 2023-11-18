import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Hochbeet } from '../types';

const logger = new Logger({ serviceName: 'hochbeet-functions' });

const dynamodbClient = new DynamoDBClient({});
const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);


const putHochbeet = async (hochbeet: Hochbeet) => {
  logger.info('putHochbeet', { hochbeet });
  const putCommand = new PutCommand(
    {
      TableName: process.env.HOCHBEETE_TABLE,
      Item: hochbeet,
    },
  );
  return dynamodbDocClient.send(putCommand);
};

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('event', { event });
  const currentUserId = event.requestContext.authorizer!.claims.email;
  const hochbeetBody: Record<string, any> = JSON.parse(event.body!);
  const hochbeet: Hochbeet = { ...hochbeetBody, userId: currentUserId } as Hochbeet;
  await putHochbeet(hochbeet);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(hochbeet),
  };

};


