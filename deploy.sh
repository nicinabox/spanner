#!/bin/bash

# Checkout deploy branch
# Precompile
# Add dist
# Push heroku
# Return to previous branch

REMOTE='dokku'
DEPLOY_BRANCH='deploy'
CURRENT_BRANCH=`git branch | awk '/^\*/{print $2}'`

echo "=> Checking out $DEPLOY_BRANCH"
git checkout $DEPLOY_BRANCH

if [[ $? > 0 ]]; then
  exit
fi

echo "=> Precompiling"
git merge $CURRENT_BRANCH --no-edit
gulp precompile

echo "=> Committing dist"
git add . && git ci -m "Dist"

echo "=> Pushing to remote"
git push $REMOTE $DEPLOY_BRANCH:master $1

echo "=> Returning to $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

echo "=> Done"
