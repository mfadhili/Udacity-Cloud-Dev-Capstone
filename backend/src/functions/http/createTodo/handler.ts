import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import "source-nap-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { middyfy } from '../../../libs/lambda';
import { decode } from "jsonwebtoken";

import { JwtPayload } from '../../../auth/JwtToken'

//import { CreateTodoRequest } from '../../../requests/CreateTodoRequest'
//import { getUserId } from "../../utils";

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODO_TABLE

const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  //const newTodo : CreateTodoRequest = JSON.parse(event.body) // check***
  
  // TODO: Implementing creating a new TODO item

  console.log( 'Processing event: ', event)

  const itemId = uuid.v4()

  console.log(getUserId(event))

  const parsedBody = event
  const testToken= getUserId(event)

  const newItem = {
    userId: testToken,
    todoId: itemId,
    ...parsedBody, 
    testToken
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise() //never forget the promise 

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }

}

function parseUserId(jwtToken:string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload

  return decodedJwt.sub
}

function getUserId(event:APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export  const main = middyfy(app)

