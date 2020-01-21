# Serverless Practice
Use serverless to build web server application

## Lab1: Prepare development environment
- Duration: 15 minutes
- Checkout lab1: `git checkout feature/lab1`
- Install NodeJS
  - For *nix OS:
    - Install NVM: follow the installation instruction on https://github.com/nvm-sh/nvm
    - Install NodeJS 8.x via nvm:
      - open terminal
      - run `nvm install 8`
  - For window:
    - https://github.com/coreybutler/nvm-windows
    - Install NodeJS 8.x or higher via nvm: `nvm install 8`

- Install MySQL
  - on macos:
    - run in terminal: `brew install mysql`
    - run mysql as daemon: `brew services start mysql`
  - on ubuntu: refer to https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04
  - on window:
    - download installer from https://dev.mysql.com/downloads/installer/
    - follow the installation wizard.

- Config aws environment.
  - go to 'My Security Credential' page on aws: https://console.aws.amazon.com/iam/home?region=ap-southeast-1#security_credential
  - create 'serverless-practice' IAM user
  - generate access key
  - to know the detail of setup configuration and credential aws account please refer to https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
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
  - test on local:
    - refer to scripts section in package.json
    - run: `npm run start-offline`
    - open postman (similar tool), make a GET request to `http://localhost:3000/api/hello-world`
  - deploy onto aws
    - make sure your have configured aws credential and configuration
    - edit `.my-tools/devops/deploy-staging.sh` change value of `AWS_PROFILE` at line 'export AWS_PROFILE=tuanquynet' to your profile.
    - run: `sh .my-tools/devops/deploy-staging.sh`
  - test deployment:
    - Go to API gateway page of aws console, grab the endpoint url.
    - Make GET request to hello-world endpoint.

## Lab3: Invoke other lambda function
- Duration: 15 minutes
- Checkout lab3: `git checkout feature/lab3`
- Requirement:
  - Create a new lambda function named 'server-info' returning current server date time
  - Create another function named 'my-func'
  - Write code for my-func to invoke server-info lambda:
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
- create `authorizer` function
  - this function is used to authenticate user. All protected endpoint should specify authorizer when configuring in serverless.yml
  - refer to https://serverless.com/framework/docs/providers/aws/events/apigateway/
  - refer to http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
  - refer to https://dev.to/adnanrahic/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-22fa
- create `get` user endpoint.
- create `create` user endpoint
- create `listing` user endpoint
- create `update` user endpoint
- create `delete` user endpoint

Notes: If you are using bcrypt on MacOS or Window it will not be working on linux when deploying on aws lambda because bcrypt is a binary module. To fix this issue we have to configure lambda layer, and the node modules in that layer should be generated on linux.

- Configure lambda layer.
  - refer to https://serverless.com/framework/docs/providers/aws/guide/layers/

## Lab5: Integrate aws-rekognition service
- Duration: 30 minutes
- Checkout lab5: `git checkout feature/lab5`
- Requirement:
  - Write a lambda function to extract faces from images which are uploaded onto s3.
  - We use AWS Rekognition to detect faces and base on the analysed results we know the bounding boxes and use sharp lib to copy the appropriate area on the image.
  - Save detected faces into image and upload onto another bucket of s3.
- Read docs:
  - Developer Guide: https://docs.aws.amazon.com/rekognition/latest/dg/API_DetectFaces.html
  - AWS JS SDK: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#detectFaces-property
  - Sharp Lib: https://sharp.pixelplumbing.com/en/stable/api-resize/#extract

Notes: After deployed lambdas onto aws, you need to upload `avatar.png` file located in `workshop/assets` folder onto the `serverless-practice.files.rnd.upload` s3 bucket.

## Lab6: Put all together

## Workshop Cleanup
