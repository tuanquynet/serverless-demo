/*
 * Runtime: Node.js 8.10
 *
 * environment:
 *  -
 * Description: return user detail
 */
// import exception from '../../../shared/exception';
import db from '../../../shared/db';

const getUserById = async (id) => {
  const sql = `
    SELECT *
    FROM users
    WHERE id = '${id}'
  `;

  return db.query(sql, [], {
    nestTables: false,
  }).then(([res]) => res);
};

exports.handler = async (event) => {
  console.log('get user detail');
  try {
    await db.init();
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

    const user = await getUserById(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {user},
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.init();
  }
};
