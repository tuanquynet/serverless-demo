/*
 * Runtime: Node.js 8.10
 *
 * environment:
 *  -
 *
 * Description: return list of users
 */
// import exception from '../../../shared/exception';
import db from '../../../shared/db';

const fetchUsers = async ({limit} = {}) => {
  limit = limit || 100;
  const sql = `
    SELECT *
    FROM users
    LIMIT ${limit}
  `;

  return db.query(sql, [], {
    nestTables: false,
  });
};

exports.handler = async (/* event */) => {
  console.log('get user list');
  try {
    await db.init();

    const users = await fetchUsers();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {users},
      }),
    };
  } catch (error) {
    throw error;
  } finally {
    await db.close();
  }
};
