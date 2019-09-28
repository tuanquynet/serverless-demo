import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

import { rekognition, s3 } from '../shared/aws';

// const avatarFiles = ['The_smurf_01.png', 'The_smurf_02.png', 'The_smurf_03.png'];

const {
  INPUT_IMAGE_BUCKET = 'serverless-practice.files.rnd.upload',
  OUTPUT_IMAGE_BUCKET = 'serverless-practice.files.rnd.publish',
  // AVATAR_IMAGE_FILE = 'avatar.jpg',
} = process.env;

const rootPath = '/tuanquynet/research/node-framework/serverless-practice';
const avatarCached = {};

function loadMockFaceDetail() {
  const content = fs.readFileSync(path.join(rootPath, '.temp/mock/face-detail.json'));

  return JSON.parse(content).FaceDetails;
}

async function detectFaces(bucketImageFile) {
  if (!bucketImageFile) {
    return loadMockFaceDetail();
  }

  const params = {
    Image: {},
  };

  if ('string' === typeof bucketImageFile) {
    params.Image.S3Object = {
      Bucket: INPUT_IMAGE_BUCKET,
      Name: bucketImageFile,
    };
  } else {
    params.Image.Bytes = bucketImageFile;
  }

  const faceData = await rekognition.detectFaces(params);

  console.log('loaded faceData');
  console.log(JSON.stringify(faceData));

  return faceData.FaceDetails;
}

async function getImageFromS3(imageName) {
  const image = await s3.download(imageName, INPUT_IMAGE_BUCKET);

  console.log(image.length);

  return image;
}

function loadImageFromFile(file) {
  return fs.readFileSync(file);
}

function extractImage(image, {
  top = 0, left = 0, width, height,
}) {
  return sharp(image).extract({
    top,
    left,
    width,
    height,
  });
}

async function extractFace(image, options, output) {
  const {
    top = 0, left = 0, width, height,
  } = options;

  const sharpData = extractImage(image, {
    top,
    left,
    width,
    height,
  });

  if (output) {
    await sharpData.toFile(output);
  }

  return sharpData.toBuffer();
}

async function getAvatar() {
  const fileName = 'avatar.png'; //avatarFiles[avatarFiles.length - 1];

  if (avatarCached[fileName]) {
    return avatarCached[fileName];
  }
  avatarCached[fileName] = await getImageFromS3(fileName, INPUT_IMAGE_BUCKET);

  return avatarCached[fileName];
}

function calculateBoundingBox({ width: imageWidth, height: imageHeight }, boundingBox) {
  const {
    width, height, top, left,
  } = boundingBox;

  const box = {
    width: Math.round(width * imageWidth),
    height: Math.round(height * imageHeight),
    top: Math.round(top * imageHeight),
    left: Math.round(left * imageWidth),
  };

  return box;
}

function extendBoundingBox(box, extend = 30) {
  box = {...box};
  extend /= 100;

  const extendedWidth = box.width * extend;
  const extendedHeight = box.height * extend;

  if (extend) {
    box.width = Math.round(box.width + extendedWidth);
    box.height = Math.round(box.height + extendedHeight);
    box.top = Math.round(box.top - extendedHeight * (3 / 4));
    box.left = Math.round(box.left - extendedWidth * (1 / 2));
  }

  return box;
}
/**
 * @return <Sharp>
 */
function mergeAvatarIntoImage(avatarImage, targetImage, { top, left, blend = 'over' }) {
  return sharp(targetImage).composite([
    {
      input: avatarImage,
      top,
      left,
      blend,
    },
  ]);
}

exports.handler = async (event) => {
  console.log('event');
  console.log(JSON.stringify(event));
  console.log('INPUT_IMAGE_BUCKET ', INPUT_IMAGE_BUCKET);
  console.log('OUTPUT_IMAGE_BUCKET ', OUTPUT_IMAGE_BUCKET);

  // only get first element of Records
  const [{ s3: s3EventData } = {}] = event.Records;
  const imageFileName = (s3EventData && s3EventData.object.key);

  // let processingImage = loadImageFromFile(path.join(rootPath, '.temp/images/source/fram1.jpg'));
  let processingImage = await getImageFromS3(imageFileName);

  const imageMetadata = await sharp(processingImage).metadata();

  const faceDetails = await detectFaces(imageFileName);

  if (!faceDetails || !faceDetails.length) {
    return true;
  }

  console.log('faceDetails');
  const avatarData = await getAvatar();

  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < faceDetails.length; index++) {
    const { BoundingBox: boundingBox } = faceDetails[index];

    const box = calculateBoundingBox(
      { width: imageMetadata.width, height: imageMetadata.height },
      {
        width: boundingBox.Width,
        height: boundingBox.Height,
        left: boundingBox.Left,
        top: boundingBox.Top,
      },
    );

    const extendedBox = extendBoundingBox(box, 50);
    const addingAvatar = await sharp(avatarData)
      .resize(parseInt(extendedBox.width, 10), parseInt(extendedBox.height, 10), {fit: 'fill'})
      .toBuffer();

    const extractedData = await extractFace(
      processingImage,
      {
        ...box,
      },
    );

    console.log('upload to s3');
    await s3.upload({
      filename: `${imageFileName.split('.')[0]}-face-${index}.${imageMetadata.format}`,
      data: extractedData,
      type: `image/${imageMetadata.format}`,
    }, OUTPUT_IMAGE_BUCKET);

    console.log('mergeAvatarIntoImage');
    processingImage = await mergeAvatarIntoImage(addingAvatar, processingImage, {
      top: extendedBox.top,
      left: extendedBox.left,
    }).toBuffer();
  }

  const outputFileName = imageFileName
    ? imageFileName.split('.').join('-proceeded.')
    : `${Date.now()}.${imageMetadata.format}`;

  // await sharp(processingImage).toFile(path.join(rootPath, '.temp/images/final.jpg'));
  await s3.upload(
    {
      filename: outputFileName,
      data: processingImage,
      type: `image/${imageMetadata.format}`,
    },
    OUTPUT_IMAGE_BUCKET,
  );

  return true;
};
