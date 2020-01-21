# AWS_ACCESS_KEY_ID=xxxxxCXW, AWS_SECRET_ACCESS_KEY are configured in ~/.aws/credentials
export PATH=`pwd`/node_modules/.bin:$PATH

# test-lambda with set of limit permission
export AWS_LAMBDA_ROLE=arn:aws:iam::615663043961:role/test-lambda

export AWS_PROFILE=tuanquynet
export AWS_REGION=ap-southeast-1

export DB_HOST=localhost
export DB_USER=demo
export DB_PASSWORD=share123!
export DB_DATABASE=serverless-practice

serverless offline --stage staging
