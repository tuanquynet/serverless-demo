/*
 * Runtime: Node.js 8.10
 * name: test-policy
 * environment:
 *  -
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import exception from '../shared/exception';
import db from '../shared/db';

const {
  SECRET_KEY = 'abc123xyz',
} = process.env;

const getUserByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = '${email}'
  `;

  return db.query(sql, [], {
    nestTables: false,
  }).then(([res]) => res);
};

const getInvalidEmailOrPasswordResponse = (message) => {
  const anException = exception.badRequestError(message || 'Invalid email or password');
  return {
    statusCode: anException.errorCode,
    headers: {
      'content-type': 'text/plain',
    },
    body: anException.message,
  };
};

exports.handler = async (event) => {
  try {
    await db.init();

    const body = JSON.parse(event.body);
    const {email, password} = body;

    const user = await getUserByEmail(email);

    if (!user) {
      return getInvalidEmailOrPasswordResponse();
    } else {
      console.log(JSON.stringify(user));
      console.log('password', password);
      console.log('user.password', user.password);

      const matchPassword = bcrypt.compareSync(password, user.password);

      if (!matchPassword) {
        return getInvalidEmailOrPasswordResponse();
      }
    }

    const accessToken = jwt.sign({
      scope: 'users:*',
      userId: user.id,
    }, SECRET_KEY, {
      expiresIn: '1d',
      algorithm: 'HS256',
    });

    return {
      statusCode: 200,
      headers: {
        // 'content-type': 'application/json',
      },
      body: JSON.stringify({
        token: accessToken,
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.close();
  }
};
