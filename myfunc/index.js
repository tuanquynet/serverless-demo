/*
 * Runtime: Node.js 8.10
 * name: test-policy
 * environment:
 *  -
 * execution role:
 *  - existing role: test-policy
 * This lambda will be used to test permission/policy
 * - cloudwatch logs
 * - cloudwatch event
 * - aws rds
 * - aws s3
 * - aws sns
 * - aws lambda: invoke other lambda function
 */
const db = require('../shared/db');
const aws = require('../shared/aws');

async function fetchUsersFromDatabase() {
  try {
    await db.init();
    const sql = `
      SELECT
        id
      FROM
        users
      limit 1;
    `;
    await db.query(sql, []);

    console.info('fetchUsersFromDatabase succeed.');
  } catch (error) {
    console.error('fetchUsersFromDatabase failed');
    console.error(error);

    throw error;
  } finally {
    db.close();
  }
}

async function createAndDeleteFileOnS3() {
  try {
    const file = await aws.s3.upload({
      type: 'text/plain',
      filename: `test-policy-${new Date()}`,
      data: Buffer.from(new Date().toISOString(), 'utf8'),
    });

    const {id, ext: extension} = file;
    await aws.s3.delete({id, extension});
  } catch (error) {
    console.error('createFileOnS3 failed');
    console.error(error);

    throw error;
  }
}

async function invokeOtherLambdaFunction() {
  try {
    const result = await aws.lambda.invoke(process.env.LAMBDA_TEST_SERVER_TIME_ARN, {}, true);
    console.info('invokeOtherLambdaFunction succeed.');
    console.info(result);
  } catch (error) {
    console.error('invokeOtherLambdaFunction failed');
    console.error(error);

    throw error;
  }
}

exports.handler = async (event) => {
  console.log('event');
  console.log(event);

  await fetchUsersFromDatabase();

  await createAndDeleteFileOnS3();

  // trigger change to redeploy
  await invokeOtherLambdaFunction();

  return 'done';
};
