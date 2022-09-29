import type { AWS } from '@serverless/typescript';

import  createTodo  from "@functions/http/createTodo";
import getAllTodos from "@functions/http/getAllTodos";
import deleteTodos from "@functions/http/deleteTodos";
import updateTodos from '@functions/http/updateTodos';


const serverlessConfiguration: AWS = {
  service: 'TodoApp',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "dev"}',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TODO_TABLE: 'Todos-table-${self:provider.stage}',
      TODO_ID_INDEX: 'TodoIdIndex'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem'
            ],
            Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODO_TABLE}'
          },
          {
            Effect: 'Allow',
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords'
            ],
            Resource: '*'
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { createTodo, getAllTodos, deleteTodos, updateTodos },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      TodoDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties:{
          StreamSpecification: {
            StreamViewType: "NEW_IMAGE"
          },
          AttributeDefinitions:[
            {AttributeName: "todoId", AttributeType: "S"},
            {AttributeName: "userId", AttributeType: "S"}
          ],
          KeySchema: [
            {AttributeName: "userId", KeyType: "HASH"},
            {AttributeName: "todoId", KeyType: "RANGE"}            
          ],
          BillingMode: "PAY_PER_REQUEST",
          TableName: '${self:provider.environment.TODO_TABLE}',
          GlobalSecondaryIndexes: [
            {
              IndexName: '${self:provider.environment.TODO_ID_INDEX}',
              KeySchema: [
                {AttributeName: 'userId', KeyType: 'HASH'}
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ]
        }
      }
    }
  }

};

module.exports = serverlessConfiguration;
