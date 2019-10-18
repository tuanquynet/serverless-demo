# Serverless Practice
Use serverless to build web server application

## Lab1: Prepare development environment
- Duration: 15 minutes
- Checkout lab1: `git checkout feature/lab1`
- Install NodeJS
  - Install NVM: follow the installation instruction on https://github.com/nvm-sh/nvm
  - Install NodeJS 8.x via nvm: `nvm install 8`

- Install MySQL
  - on macos:
    - run in terminal: `brew install mysql`
    - run mysql as daemon: `brew services start mysql`
  - on ubuntu: refer to https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04

- Config aws environment.
  - go to 'My Security Credential' page on aws: https://console.aws.amazon.com/iam/home?region=ap-southeast-1#security_credential
  - create 'serverless-practice' IAM user
  - generate access key
  - add aws configuration to `~/.aws/config` file. see sample files `./workshop/.aws/config`
  - add aws account to `~/.aws/credential` file. see sample file `./workshop/.aws/credential`

## Lab2: Create simple function
- Duration: 20 minutes
- Checkout lab2: `git checkout feature/lab2`
- Requirement:
  - grab the core concept: https://serverless.com/framework/docs/providers/aws/guide/intro/
  - setup basic serverless app:
    - read docs https://serverless.com/framework/docs/providers/aws/guide/quick-start/
    - reference docs: https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/serverless.yml.md
  - write a simple function which return hello world
  - integration serverless-webpack
    - read docs: https://serverless.com/plugins/serverless-webpack/
  - integrate serverless-offline
    - read docs: https://github.com/dherault/serverless-offline

## Lab3: Invoke other lambda function
- Duration: 15 minutes
- Checkout lab3: `git checkout feature/lab3`
- Requirement:
  - Create a new lambda function named 'server-info' return current server date time
  - Create another function named 'my-func'
  - Add logic to my-func so that invoke server-info:
    - install aws-sdk: `npm install --save aws-sdk`
    - read docs:
      - https://docs.aws.amazon.com/en_pv/lambda/latest/dg/lambda-invocation.html
      - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property
    - log the result of lambda invocation

## Take a break
- Duration: 10 minutes

## Lab4: Create CRUD users endpoints
- Duration: 30 minutes
- Checkout lab4: `git checkout feature/lab4`
- Prepare database
  - init account: read file .my-tools/devops/init-database.sh
  - create database schema: run `sh .my-tools/devops/restore-database.sh`
- create `login` endpoint.
- create `get` user endpoint.
- create `create` user endpoint
- create `listing` user endpoint
- create `update` user endpoint
- create `delete` user endpoint

## Lab5: Integrate aws-rekognition service
- Duration: 30 minutes
- Checkout lab5: `git checkout feature/lab5`

## Lab6: Put all together

## Workshop Cleanup
