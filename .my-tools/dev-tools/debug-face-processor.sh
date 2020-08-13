export AWS_LAMBDA_ROLE=arn:aws:iam::615663043961:role/test-lambda

export AWS_PROFILE=tuanquynet
export AWS_REGION=ap-southeast-1

node --inspect --require babel-core/register .my-tools/dev-tools/loader.js
