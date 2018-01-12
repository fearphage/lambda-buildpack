#!/usr/bin/env node
const execSync = require('child_process').execSync;
const Mustache = require('mustache')
var fs = require('fs');
var program = require('commander');

// Establish command api
var appDirValue
program
    .version('0.1.0')
    .option('-a, --path <absolute_path>', 'Absolute path to directory of app to deploy')
    .option('-r, --runtime <runtime>', 'AWS platform runtime: node6.10 or node4.3' );

// Parse the arguments passed to the cli
program.parse(process.argv);

// Require user to specify directory to deploy
if (typeof program.path == 'undefined'){
    console.error('You must specify the directory where the applicaiton to deploy is located');
    process.exit(1)
}

if (typeof program.runtime == 'undefined'){
    console.log('You must specify the runtime platform to deploy to.  Currently support nodejs6.10 and nodejs4.3')
    process.exit(1)
}

if (program.runtime != 'nodejs6.10' && program.runtime != 'nodejs4.3'){
    console.log('Supported runtimes values are nodejs6.10 and nodejs4.3. You entered \'' + program.runtime + '\'')
    process.exit(1)
}

const tmpDir = "tmp_app"
console.log( "Copying app directory '"+ program.path +"' to new temporary deploy directory ")
// 1 - Copy build App directory to temp working directory
var cmd = "cp -a " + program.path + " ./" + tmpDir;
stdout = execSync(cmd);

// 2 - Create Serverless Framework config file in app root
console.log('Writing  Serverless config to root app directory')
yaml = fs.readFileSync("templates/aws-node-serverless.yml.mst", 'utf-8')

//   - setup template
var data = {
    stage: "dev", 
    bucket: "starphleet-lambda-deploys", 
    region: "us-east-1",
    runtime: program.runtime  
}
yaml = Mustache.render(yaml, data )

//  - Write the config file  
fs.writeFileSync(tmpDir + '/serverless.yml',yaml);

// 3 - Add lambda handler (index.hanlder) file to the app root
// Note: expects express app to be available in app.js file in the apps root directory
console.log("Copying lambda handler file to app root")
stdout = execSync("cp -a ./templates/aws-node-handler.js ./" + tmpDir + "/index.js", {stdio:[0,1,2]});

// 4 - Install serverless-http package needed to use express app in lambda
console.log("Installing serverless-http node package", {stdio:[0,1,2]})
stdout = execSync("npm i serverless-http", { cwd: tmpDir, stdio:[0,1,2]});

// 5 - Call serverless deploy on the temp app directory
console.log("Deploying app to Lambda")
stdout = execSync("serverless deploy", { cwd: tmpDir, stdio:[0,1,2] });

// 6 - Remove the temp app directory
// stdout = execSync("rm -rf ./" + tmpDir, { stdio:[0,1,2] })
console.log('Done   ')

