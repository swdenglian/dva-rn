#!/bin/bash

# Release branch
master="master"
prefix="v"
release="patch"

git pull origin $master
echo "Current pull origin $master."

# Auto generate version number and tag
standard-version -r $release --tag-prefix $prefix

git push --follow-tags origin $master

npm publish --registry https://registry.npmjs.org/

echo "Git push origin $master"
echo "Release finished."