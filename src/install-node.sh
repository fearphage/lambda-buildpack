#!/usr/bin/env bash
# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

# source bashrc to make nvm accessible at command line
. $HOME/.bashrc

# install node v6.5.0 required by serverless
nvm install 6.5.0

# Use this version of node
nvm use 6.5.0

# make version 6.5.0 the default version
nvm alias default node
