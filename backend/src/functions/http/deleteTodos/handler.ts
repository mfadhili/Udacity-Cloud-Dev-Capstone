import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import "source-nap-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { middyfy } from '../../../libs/lambda';

//import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from "../../utils";

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE

const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  console.log('Deleteing Todo ', event)

  const todoId = event.pathParameters.todoId  
  const userId = todoId //getUserId(event)

  const deletedItem = await deleteToDo( todoId, userId )

  return {
    statusCode: 201,
    body: JSON.stringify({
      deletedItem
    })
  }


 
}


export  const main = middyfy(app)

async function deleteToDo(todoId: string, userId: string): Promise<string> {
  
  const params = {
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }
  
  const result = await docClient.delete(
    params
  ).promise()
  
  console.log(result)
  return ' '
}

