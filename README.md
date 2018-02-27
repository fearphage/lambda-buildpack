# lambda-buildpack
Will deploy applicaiton to lambda. Must be used as part of multi-buildpack build.

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
export BUILDPACK_URL='https://github.com/wballard/nginx-buildpack.git'
```

### Step 3 - Add .buildpack files
Add a `.bulidpack` file to the root directory of your app. This file should specify the buildpacks to use.  For example:

```
https://github.com/igroff/heroku-buildpack-nodejs.git#starphleet
https://github.com/glg/lambda-buildpack.git#master
```

### Step 4 - Add listContainers forkulator command to DevShip
Every commit to your orders file or service repo will create a new AWS api.  Just like starphleet must clean up obsolete containers, lambda deploy must clean up obsolete AWS api's.  

This is done via a scheduled job that asks each ship what service versions it is currently proxying to AWS API Gateway.  Any service version that is in API Gateway but not listed by a Dev Ship will be removed.  

Therefore, if your ship does not include the `listContainers` forkulator command, the reaper will not know what services your ship is using, and they will be deleted.

##### Add PUBLIC-forkulator to headquarters
1. If it does not already exist, add the `PUBLIC-forkulator` directory to your headquarters 
2. Add `orders` file with the following contents:

```
export FORKULATOR_TEMP=/tmp
export COMMAND_PATH=/var/data/PUBLIC-forkulator-commands
export PATH=${COMMAND_PATH}/bin:$PATH
export HEALTHCHECK=/diagnostic
export MAX_CONCURRENCY=250
autodeploy https://github.com/igroff/forkulator.git#master
```

##### Add PUBLIC-forkulator-commands to headquarters
1. If it does not already exist, Add the `PUBLIC-forkulator-commands` directory to your headquarers
2. Create a file named `remote` in this directory
3. Contents of `remote` should be

```
autodeploy git@github.com:glg/PUBLIC-forkulator-commands.git#lambda-deploy
```