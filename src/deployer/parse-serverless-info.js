#!/usr/bin/env node
/*
 Parses information for a serverless service and returns it.
 Information is provided in the following format:

Service Information
service: aws-nodejs
stage: dev
region: us-east-1
stack: aws-nodejs-dev
api keys:
  None
endpoints:
  ANY - https://pxm9o1v966.execute-api.us-east-1.amazonaws.com/dev
  ANY - https://pxm9o1v966.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  api: aws-nodejs-dev-api

*/
const fs = require('fs');
const yaml = require('js-yaml')

const data = yaml.safeLoad(fs.readFileSync('/dev/stdin', 'utf8')
  .split('\n')
  .slice(1)
  .join('\n')
  .replace(/ANY/g, '- ANY')
);
const endpoints = data.endpoints.map(line => {
  const [method, url] = line.split(' - ');

  return {
    method,
    url,
  };
});

const apiGatewayID = endpoints[0].url.match(/https:\/\/([^.]+)\./)[1];
const host = `${apiGatewayID}.execute-api.${data.region}.amazonaws.com`;

console.error('### serverless info');
console.log(Object.assign(data, {
  apiGatewayID,
  endpoints,
  host,
  url: `https://${host}`,
}));
