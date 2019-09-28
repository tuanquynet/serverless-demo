/*
 * Runtime: Node.js 8.10
 * name: test-policy
 * environment:
 *  -
 */
import jwt from 'jsonwebtoken';
import exception from '../shared/exception';


const {
  SECRET_KEY = 'abc123xyz',
} = process.env;

// Policy helper function refer to https://dev.to/adnanrahic/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-22fa
const generatePolicy = ({principalId, effect, resource}) => {
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];

    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

exports.handler = async (event) => {
  console.log('authorizer');
  try {
    const {authorizationToken} = event;

    if (!authorizationToken) {
      throw exception.badRequestError('Missing authorization');
    }

    const token = authorizationToken.split(' ')[1];
    if (!token) {
      throw exception.badRequestError('Invalid token');
    }

    const decoded = jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    console.log('decoded');
    console.log(decoded);

    return generatePolicy({principalId: decoded.userId, effect: 'Allow', resource: event.methodArn});
  } catch (error) {
    console.log(error);
    throw exception.badRequestError('Can not authorize this token');
  }
};
