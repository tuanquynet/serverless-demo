/*
 * Runtime: Node.js 8.10
 * Description: return list of users
 * environment:
 *  -
 */
// import exception from '../../../shared/exception';

exports.handler = async (event) => {
  console.log('delete user detail');

  const {authorizer} = event.requestContext;
  const {userId} = event.pathParameters;
  const principalId = (authorizer.principalId || '').toString().toLowerCase();

  if (!authorizer || principalId.toString().toLowerCase() !== userId.toString().toLowerCase()) {
    console.log('not match principalId');

    return {
      statusCode: 403,
      headers: {
        'content-type': 'text/plain',
      },
      body: 'not match principalId',
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: true,
    }),
  };
};
