/*
 * Runtime: Node.js 8.10
 * Description: create user
 * environment:
 *  -
 */
import _ from 'lodash';
import bcrypt from 'bcrypt';
import db from '../../../shared/db';
import exception from '../../../shared/exception';


const createExceptionResponse = (message = 'Server Error') => {
  const anException = exception.badRequestError(message);
  return {
    statusCode: anException.errorCode,
    headers: {
      'content-type': 'text/plain',
    },
    body: anException.message,
  };
};

const updateUserById = async (userId, data) => {
  if (!userId) {
    return createExceptionResponse('Missing userId');
  }

  if (data.password) {
    data.password = bcrypt.hashSync(data.password, 10);
  }

  const sqlValues = Object.keys(data).map(key => `${key}='${data[key]}'`).join(',');

  const sql = `
    UPDATE users
    SET ${sqlValues}
    WHERE id = '${userId}'
  `;

  await db.query(sql, [], {
    nestTables: false,
  });

  return data;
};

exports.handler = async (event) => {
  console.log('update user');
  try {
    await db.init();
    const {userId} = event.pathParameters;
    const allowedFields = [
      'password', 'firstName', 'lastName',
    ];
    const {authorizer} = event.requestContext;
    const principalId = (authorizer.principalId || '').toString().toLowerCase();

    // Only allow owner to be able to update user info.
    if (!authorizer || principalId.toString().toLowerCase() !== userId.toString().toLowerCase()) {
      console.log('not match principalId');
      console.log(principalId.toString().toLowerCase());
      console.log(userId);

      return {
        statusCode: 403,
        headers: {
          'content-type': 'text/plain',
        },
        body: 'unauthorized',
      };
    }

    const body = _.pick(JSON.parse(event.body), allowedFields);

    const createdUser = await updateUserById(userId, body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {user: createdUser},
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.init();
  }
};
