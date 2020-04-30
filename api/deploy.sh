#!/bin/sh

set -e

NODE_ENV=production
DIST_PATH=./
DEPLOY_SSH=aws
DEPLOY_PATH=/app/express-template/api/

TITLE_COLOR="\e[92m"
NC="\e[0m"

echotitle () {
	echo
	echo "${TITLE_COLOR}$1"
	echo "-----------------------------------------------------------${NC}"
}

echotitle "Uploading from '${DIST_PATH}' to '${DEPLOY_SSH}:${DEPLOY_PATH}'..."
rsync -zr --no-perms \
	--exclude "node_modules*" \
	--exclude ".eslint*" \
	--exclude "*.http" \
	--exclude "deploy.sh" \
	--exclude "package-lock.json" \
	${DIST_PATH} \
	${DEPLOY_SSH}:${DEPLOY_PATH}

echotitle "Restarting node process..."
ssh ${DEPLOY_SSH} << HERE
cd ${DEPLOY_PATH}
pm2 startOrReload pm2.config.js
HERE

echotitle "API successfully deployed!"
