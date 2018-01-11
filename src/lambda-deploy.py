#!/usr/bin/env python

import "boto3"
import "shutil"

#Zip the app and create archive
shutil.make_archive("app.zip","zip","/var/ubuntu","/var/ubuntu/app")
