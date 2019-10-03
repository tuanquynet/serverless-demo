# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are configured in ~/.aws/credentials
export PATH=$PATH:`pwd`/node_modules/.bin

# test-lambda with set of limit permission
export AWS_LAMBDA_ROLE=arn:aws:iam::615663043961:role/test-lambda

export AWS_PROFILE=tuanquynet
# defined in ~/.aws/config
export AWS_REGION=ap-southeast-1

export DB_HOST=mysql.tuanquynet.click
export DB_DATABASE=serverless-practice
export DB_USER=demo
# export DB_PASSWORD=xxxxx


serverless deploy  --stage staging
