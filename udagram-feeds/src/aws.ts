import AWS = require('aws-sdk');
import {config} from './config/config';


// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
AWS.config.credentials = credentials;
console.log(AWS.config.credentials);

if(AWS.config.credentials.accessKeyId === undefined){
  AWS.config.credentials.accessKeyId = process.env.ACCESS_KEY_ID;
  console.log(AWS.config.credentials);
}


export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket},
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): Promise<string> {
  const signedUrlExpireSeconds = 60 * 5;

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', {
      Bucket: config.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    }, (error, url) => {
      if (error) {
          reject(error);
      } else {
          resolve(url);
      }
    });
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): Promise<string> {
  const signedUrlExpireSeconds = 60 * 5;

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', {
      Bucket: config.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    }, (error, url) => {
      if (error) {
          reject(error);
      } else {
          resolve(url);
      }
    });
  });
}
