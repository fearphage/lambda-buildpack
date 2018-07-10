#!/usr/bin/env node
/*
 * Notice everything in this file uses console.error
 * except for the desired output
 *
 */
const program = require('./cli')(process.argv);
const parsedOrders = require('./orders')(program.orders_file);

const AWS_ROLE_ORDER_NAME = 'AWS_ROLE';

console.error('### READ ORDER FILE');
console.error('    ');

// Stage has following format
// $HQ_$SHIP_OrdersSha_ServiceSha_

// last item - service sha
// second to last item - orders sha
const [ordersSha, serviceSha] = program.container_name.split('-').splice(-2);

const roleIndex = parsedOrders.findIndex(({ name }) => name === AWS_ROLE_ORDER_NAME);

//   - setup template
const data = {
  stage: 'dev',
  bucket: `starphleet-lambda-deploys${process.env.AWS_ACCOUNT === 'glgdev' ? '' : '-glgapp'}`,
  region: 'us-east-1',
  runtime: program.runtime,
  environment: parsedOrders,
  service_name: `${program.service}-${ordersSha}-${serviceSha}`,
  aws_account: program.account,
  aws_role: roleIndex > -1 ? parsedOrders[roleIndex].value : 'lambda-deploy-function-role',
};

// just for debug purposes
console.error(data);

// actual script output
console.log(JSON.stringify(data));
