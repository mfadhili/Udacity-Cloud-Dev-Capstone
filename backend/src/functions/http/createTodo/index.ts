import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'todos',
        cors: true,
        
      }
    }
  ],
  iam: {
    role: {
      statements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:PutItem',
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
}