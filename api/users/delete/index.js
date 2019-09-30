/*
 * Runtime: Node.js 8.10
 * Description: return list of users
 * environment:
 *  -
 */
import exception from '../../../shared/exception';
import db from '../../../shared/db';

const deleteUserById = async (userId) => {
  if (!userId) {
    return exception.apiGateWayException('Missing userId');
  }
  try {
    const sql = `
    DELETE FROM users
    WHERE id = '${userId}'
  `;

    await db.query(sql, [], {
      nestTables: false,
    });
  } catch (error) {
    console.error(error);

    return false;
  }

  return true;
};

exports.handler = async (event) => {
  console.log('delete user detail');
  try {
    await db.init();
    const {authorizer} = event.requestContext;
    const {userId} = event.pathParameters;
    const principalId = (authorizer.principalId || '').toString().toLowerCase();

    if (!authorizer || principalId.toString().toLowerCase() !== userId.toString().toLowerCase()) {
      console.log('not match principalId');
      console.log(principalId.toString().toLowerCase());
      console.log(userId);

      return exception.transformToApiGateWayException(exception.badRequestError(`You don't have permission to delete user ${userId}.`));
    }

    const result = await deleteUserById(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result,
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.close();
  }
};
