import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import "source-nap-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { middyfy } from '../../../libs/lambda';

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from "../../utils";


const app : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  

  return undefined

}

export  const main = middyfy(app)

