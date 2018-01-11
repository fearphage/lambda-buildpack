# lambda-buildpack
Will deploy applicaiton to lambda. Must be used as part of multi-buildpack build.

## Usage
To deploy to lambda do the following:

### Step 1
Create an orders file that uses the multi buildpack.  For example:

```
export BUILDPACK_URL='https://github.com/wballard/nginx-buildpack.git'
```

### Step 2
Add a `.bulidpack` file to the root directory of your app. This file should specify the buildpacks to use.  For example:

```
https://github.com/igroff/heroku-buildpack-nodejs.git#starphleet
https://github.com/glg/lambda-buildpack.git
```
