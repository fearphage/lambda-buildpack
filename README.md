# lambda-buildpack
Will deploy applicaiton to lambda. Must be used as part of multi-buildpack build.

## Warnings
#### Does not support `starphleet-retry-deploy`
Running `starphleet-retry-deploy` on the ship will cause your lambda service to be deleted.  `starphleet-retry-deploy` creates a new container using new SHA's that do not come from the GIT versions.  As a result, the lamda reaper process may conclude that your lambda service is not in use by any ship.  It will then delete the lambda service.

TL;DR: Do not use `starphleet-retry-deploy` on any service deployed to lambda

## Usage
To deploy to lambda do the following:

### Step 1 - Create Compatible Node Service
 - MUST Work with node version 6.10
 - MUST be implemented in Express framework
 - MUST include app.js file in service root
    - app.js MUST export express app with all routes defined
	- app.js MUST NOT call listen method on the express app

### Step 2 - Create Orders File
Create an orders file that uses the multi buildpack.  For example:

```
export BUILDPACK_URL=https://github.com/glg/heroku-buildpack-multi.git
```
Optionally, you can specify the nodejs runtime to use in lambda.  Lambda supports nodejs4.3, nodejs6.10, and nodejs8.10.  Version 8.10 will be used if a valid lambda runtime is not specified.

```
export BUILDPACK_URL=https://github.com/glg/heroku-buildpack-multi.git
export LAMBDA_RUNTIME=nodejs6.10
```

NOTE: `export AWS_SECURITY_MODE="public"` in the orders file adds *public* access at the AWS API Gateway. The default value is private.


### Step 3 - Add .buildpack files
Add a `.buildpacks` file to the root directory of your app. This file should specify the buildpacks to use.  For example:

```
https://github.com/igroff/heroku-buildpack-nodejs.git#starphleet
https://github.com/glg/lambda-buildpack.git#master
```

### Step 4 - Add listContainers forkulator command to DevShip
Every commit to your orders file or service repo will create a new AWS api.  Just like starphleet must clean up obsolete containers, lambda deploy must clean up obsolete AWS api's.

This is done via a scheduled job that asks each ship what service versions it is currently proxying to AWS API Gateway.  Any service version that is in API Gateway but not listed by a Dev Ship will be removed.

Therefore, if your ship does not include the `listContainers` forkulator command, the reaper will not know what services your ship is using, and they will be deleted.

##### Add forkulator to headquarters
1. If it does not already exist, add the `forkulator` directory to your headquarters
2. Add `orders` file with the following contents:

```
export FORKULATOR_TEMP=/tmp
export COMMAND_PATH=/var/data/forkulator-commands
export PATH=${COMMAND_PATH}/bin:$PATH
export HEALTHCHECK=/diagnostic
export MAX_CONCURRENCY=250
autodeploy https://github.com/igroff/forkulator.git#master
export SECURITY_MODE=htpasswd
```

##### Add forkulator-commands to headquarters
1. If it does not already exist, Add the `forkulator-commands` directory to your headquarers
2. Create a file named `remote` in this directory
3. Contents of `remote` should be

```
autodeploy git@github.com:glg/forkulator-commands.git#serverless
```

#### Ensure your DevShip has proper tag
As stated above the AWS API reaper queries each DevShip to learn what service versions are active. The reaper finds your ship by looking for instances tagged with Type=devship.

Tag your Devship with `Type=devship` in the AWS console.


