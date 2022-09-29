import { CustomAuthorizerResult, CustomAuthorizerEvent, CustomAuthorizerHandler, APIGatewayAuthorizerHandler, APIGatewayAuthorizerEvent } from "aws-lambda";
import { verify } from "jsonwebtoken";

import { JwtPayload } from '../../../auth/JwtToken'
import { middyfy } from '../../../libs/lambda';


const cert  = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJBDF73d/HkyteMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1jbGd4czQ2by51cy5hdXRoMC5jb20wHhcNMjIwOTIxMTgzMTM5WhcN
MzYwNTMwMTgzMTM5WjAkMSIwIAYDVQQDExlkZXYtY2xneHM0Nm8udXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsvJXKAm4bXqwqeJw
iHCtcGlYPHECCP91A7AaQm5mjDEJX7Q+4o2ft5atJ+MXkRA7+i3D/U+qOaRdiRSS
BH9Qut5wW2oT93Dri7hYCEXxNigJLktWs5cfdoRPD2oVTz4PjLgX+ej4lhq8BvoD
/HcCn/MjME39/vBRmWUBuOMPLqIuhruD+KzsAURfaaPiX5BOKEDemzGHcYwUkjMj
DuHy5IHXwHyafvv2dPFzdOTG7uCxawhCsBh9w/1fGFEpIiE+gCZS6hgZKUQerRzl
dQcqPQ4LB38e/uo+uByN5C/3dxljCuPdGYclnco6HDZIRY/mH7sksEEkOUYTFwSV
Tm0oBwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTf6DalU/Hy
oqFbqkDqHPA1SW3OezAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AIk2BDyLjYIPNWA7am7Gw9agqkQ5jZiAX9W58rHRFEGIkXmFXzP2zhfoOOM47RFs
7wW8Rajrhssqk7p9cqSZ/cazD53Q6aB4V0qxtDfuG9bBvnDJlqVudF8aQdFeMWDv
EFToBAEoDRA6RQzvURw3gKl82w4kTApH9rLQavna/wJgrnAFK4bJBGFToAvIuRN4
jZYnom153jssOcDbtfwsNU7qhPRpUw7GHzGFjxP8TmSH6qiZy7isREBW3AFc6O3H
N9WZdRx8wPRdO89fOkzOh0727IJicsqV52wAxgTNxg9+DWat0qlUGUT3JKVTCeoQ
nO7S+vmX6ovqrgeZ21TJXRQ=
-----END CERTIFICATE-----`

const app2: CustomAuthorizerHandler = async (event:CustomAuthorizerEvent):Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }


  } catch (error) {
    console.log('User authorized', error.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authorizationToken: string | undefined): JwtPayload {
  if (!authorizationToken) {
    throw new Error("No Authentication Header");
    
  }
  
  if (!authorizationToken.toLowerCase().startsWith('bearer ')) {
    throw new Error("Invalid authentication header");
  }

  const split = authorizationToken.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256']}) as JwtPayload
}






export  const main = middyfy(app2)

