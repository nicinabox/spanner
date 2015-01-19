#!/bin/bash

# Checkout deploy branch
# Precompile
# Add dist
# Push heroku
# Return to previous branch

DEPLOY_BRANCH='deploy'
CURRENT_BRANCH=`git branch | awk '/^\*/{print $2}'`

echo "=> Checking out $DEPLOY_BRANCH"
git checkout $DEPLOY_BRANCH

echo "=> Precompiling"
gulp precompile

echo "=> Committing dist"
git add . && git ci -m "Dist"

echo "=> Pushing to Heroku"
git push heroku deploy:master

echo "=> Returning to $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

echo "=> Done"
