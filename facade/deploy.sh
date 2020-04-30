#!/bin/sh

set -e

NODE_ENV=production
DIST_PATH=./dist/
BACKUP_PATH=/app/bak/
DEPLOY_SSH=aws
DEPLOY_PATH=/app/express-template/facade/

TITLE_COLOR="\e[92m"
NC="\e[0m"

echotitle () {
	echo
	echo "${TITLE_COLOR}$1"
	echo "-----------------------------------------------------------${NC}"
}

GIT_COMMIT="$(git log -1 --pretty=%h)"

echotitle "Building..."
npm run build

echotitle "Deploying locally into '${DIST_PATH}'..."
npm run deploy -- --dest=${DIST_PATH} --commit=${GIT_COMMIT}

echotitle "Uploading from '${DIST_PATH}' to '${DEPLOY_SSH}:${DEPLOY_PATH}'..."
rsync -zr --no-perms ${DIST_PATH} ${DEPLOY_SSH}:${DEPLOY_PATH}

echotitle "Removing '${DIST_PATH}'..."
rm -r ${DIST_PATH}

echotitle "Restarting node process..."
ssh ${DEPLOY_SSH} << HERE
cd ${DEPLOY_PATH}
pm2 startOrReload pm2.config.js
HERE

echotitle "Facade successfully deployed!"
