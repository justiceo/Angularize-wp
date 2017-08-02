#!/bin/sh

# copy git hooks to appropriate directory
cp -r .githooks/* .git/hooks/

# ignore tracking updates to app.templates.js
git update-index --assume-unchanged src/core/app.templates.js

# install dependencies
npm install