#!/usr/bin/env node
/*
 * Notice everything in this file uses console.error
 * except for the desired output
 *
 */
const parseOrders = require('./orders');
const program = require('./cli')(process.argv);

console.error("### READ ORDER FILE")
console.error("    ")

// Stage has following format
// $HQ_$SHIP_OrdersSha_ServiceSha_

// last item - service sha
// second to last item - orders sha
const [ordersSha, serviceSha] = program.container_name.split('-').splice(-2);

//   - setup template
const data = {
    stage: "dev",
    bucket: `starphleet-lambda-deploys${process.env.AWS_ACCOUNT === 'glgdev' ? '' : '-glgapp'}`,
    region: "us-east-1",
    runtime: program.runtime,
    environment: parseOrders(program.orders_file),
    service_name: `${program.service}-${ordersSha}-${serviceSha}`,
    aws_account: program.account
};

// just for debug purposes
console.error(data);

// actual script output
console.log(JSON.stringify(data));
