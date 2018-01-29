# lambda-buildpack
Will deploy applicaiton to lambda. Must be used as part of multi-buildpack build.

## Usage
To deploy to lambda do the following:

## Step 1 - Create Compatible Node Service
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

### Step 3 - Add .buildpack file s
Add a `.bulidpack` file to the root directory of your app. This file should specify the buildpacks to use.  For example:

```
https://github.com/igroff/heroku-buildpack-nodejs.git#starphleet
https://github.com/glg/lambda-buildpack.git#master
```

