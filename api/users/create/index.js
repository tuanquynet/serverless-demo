/*
 * Runtime: Node.js 8.10
 * Description: create user
 * environment:
 *  -
 */
import bcrypt from 'bcrypt';
import db from '../../../shared/db';
import * as tools from '../../../shared/tools';


const createUser = async ({
  email, password, firstName = null, lastName = null,
}) => {
  const id = tools.b16('hex');
  password = bcrypt.hashSync(password, 10);
  const sql = `
    INSERT INTO users (id, email, password, firstName, lastName)
    VALUES ('${id}', '${email}', '${password}', '${firstName}', '${lastName}')
  `;

  await db.query(sql, [], {
    nestTables: false,
  });

  return {
    id, email, firstName, lastName,
  };
};

exports.handler = async (event) => {
  console.log('create user');

  try {
    await db.init();
    const body = JSON.parse(event.body);

    const createdUser = await createUser(body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {user: createdUser},
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.close();
  }
};
