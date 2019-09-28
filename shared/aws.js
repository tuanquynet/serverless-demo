import AWS from 'aws-sdk';
// import * as tools from './helpers/tools';
import config from './config';
import logger from './logger';
import tools from './tools';

// AWS_REGION will gain from env variable.
AWS.config.update({region: config.AWS_REGION});
const {
  DEBUG,
} = process.env;

AWS.config.logger = DEBUG ? console : null;

class Lambda {
  constructor() {
    /**
     * We don't need to pass AWS_LAMBDA_KEY,AWS_LAMBDA_SECRET because we use the grant of lambda role.
     */
    this.lambda = new AWS.Lambda({/*
      accessKeyId: config.AWS_LAMBDA_KEY,
      secretAccessKey: config.AWS_LAMBDA_SECRET,
     */});
  }

  /**
   * Invokes a lambda function
   *
   * @param functionName
   * @param payload
   * @param isAsync
   * @return {Promise<*>}
   */
  async invoke(functionName, payload, isAsync = false) {
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(payload),
    };

    if (isAsync) {
      params.InvocationType = 'Event';
      params.LogType = 'None'; // in case we change the default to 'Tail', this NEEDS to remain on None for async
    }

    return this.lambda
      .invoke(params)
      .promise()
      .then((response) => {
        // depending on the InvocationType, the success will have different codes
        const successCode = isAsync ? 202 : 200; //DryRun is 204

        if (successCode !== response.StatusCode) {
          logger.error(`Error from invoking lambda: ${functionName}, FunctionError=${response.FunctionError}`);
          throw new Error('Something wrong with server');
        }

        if (isAsync) return true; // we're done here, got our 202, let's move on

        const result = JSON.parse(response.Payload);
        if (result.errorMessage) {
          throw new Error(`Something wrong with server: ${result.errorMessage}`);
        }

        return result;
      });
  }
}


const {
  MEDIA_BUCKET = 'files.rnd',
} = process.env;


const getExtByType = function name(type) {
  switch (type) {
    case 'image/png':
      return '.png';
    case 'image/jpeg':
      return '.jpg';
    default:
      return '.txt';
  }
};

class S3 {
  constructor() {
    this.s3 = new AWS.S3({
      // accessKeyId: 'xxxx',
      // secretAccessKey: 'xxxxx',
    });
  }

  async upload(file, bucket = MEDIA_BUCKET) {
    let {ext, filename} = file;
    const {
      type, mimetype, data: fileData,
    } = file;

    ext = ext || getExtByType(type);
    filename = filename || (tools.b16('hex') + ext);

    if (filename) {
      const params = {
        Bucket: bucket,
        Key: filename,
        Body: fileData,
        ContentType: type,
        ACL: 'public-read-write',
      };

      return this.s3.putObject(params)
        .promise()
        .then(() => ({
          filename,
        }));
    } else {
      throw (new Error(`Incorrect mime type (${mimetype}).`));
    }
  }

  async delete(files, bucket = MEDIA_BUCKET) {
    files = Array.isArray(files) ? files : [files];
    if (!files.length) {
      return true;
    }

    const params = {
      Bucket: bucket,
      Delete: {
        Objects: files.map(({id, extension}) => ({Key: (id + extension)})),
        Quiet: false,
      },
    };

    await this.s3.deleteObjects(params).promise();

    return true;
  }

  async download(fileName, bucket = MEDIA_BUCKET) {
    console.log('bucket ', bucket);
    console.log('fileName ', fileName);

    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    return this.s3.getObject(params)
      .promise()
      .then((res) => {
        const {DeleteMarker} = res;

        if (DeleteMarker) {
          throw new Error('Object is marked for deletion.');
        }

        return res.Body;
      });
  }
}

class Rekognition {
  constructor() {
    this.rekognition = new AWS.Rekognition({
      // accessKeyId: 'xxxx',
      // secretAccessKey: 'xxxxx',
    });
  }

  async detectFaces(params) {
    return this.rekognition
      .detectFaces(params)
      .promise();
  }
}

export const lambda = new Lambda();
export const s3 = new S3();
export const rekognition = new Rekognition();
