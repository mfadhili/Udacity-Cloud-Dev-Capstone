import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import "source-nap-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { middyfy } from '../../../libs/lambda';

//import { createLogger } from '../../utils/logger'
//import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../../requests/UpdateTodoRequest'
import { getUserId } from "../../utils";
import { TodoUpdate } from '../../../models/TodoUpdate'

//const logger = createLogger('UpdateTodoFunction')

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE

const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  console.log('Processing update event: ', event)

  const todoId = event.pathParameters.todoId
  const updatedTodo : UpdateTodoRequest = JSON.parse(event.body) // probable error here its already parsed
  const userId = todoId //getUserId(event)

  const todoUpdate = await updateTodoItem(updatedTodo,userId,todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todoUpdate
    })
  }

}

async function updateTodoItem(updateTodo:TodoUpdate, userId: string, todoId: string) {
  const params = {
    TableName: todosTable,
    Key: {
      todoId,
      userId
    },
    ExpressionAttributeNames: {
      '#nameAttr': 'name'
    },
    UpdateExpression: 'SET #nameAttr = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':name': updateTodo.name,
      ':dueDate': updateTodo.dueDate,
      ':done': updateTodo.done
    }

  }

  await docClient.update(
    params
  ).promise()

}
export  const main = middyfy(app)

