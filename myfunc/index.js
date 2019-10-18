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
const aws = require('../shared/aws');

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

  // trigger change to redeploy
  await invokeOtherLambdaFunction();

  return 'done';
};
