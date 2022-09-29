import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { middyfy } from '../../../libs/lambda';



const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE


const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  console.log('Processing update event: ', event)
  const todoId = event.pathParameters.todoId

  const updateItems = event.body
  const userId = todoId //getUserId(event)

  const todoUpdate = await updateTodoItem(updateItems,userId,todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todoUpdate
    })
  }

}


async function updateTodoItem(updateTodo:any, userId: string, todoId: string) {
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