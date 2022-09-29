import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import "source-nap-support/register";
import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Event } from "aws-sdk/clients/s3";
import * as uuid from "uuid";
import { middyfy } from '../../../libs/lambda';

//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from "../../utils";

// TODO: Getting all TODO items for a current user

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE


const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  console.log('Processing get a todo event ', event)

  const todoId = event.pathParameters.todoId

  const result = await docClient.query({
    TableName: todosTable
  }).promise()

  const todos = result.Items
  
  return {
    statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            todos
        })
  }

}

export  const main = middyfy(app)

