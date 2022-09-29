import * as AWS from "aws-sdk";
import * as AWSXRAY  from "aws-xray-sdk";

import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRAY.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic