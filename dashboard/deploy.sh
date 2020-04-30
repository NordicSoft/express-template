#!/bin/sh

set -e

NODE_ENV=production
DIST_PATH=./dist/
DEPLOY_SSH=aws
DEPLOY_PATH=/app/express-template/dashboard/

TITLE_COLOR="\e[92m"
NC="\e[0m"

echotitle () {
	echo
	echo "${TITLE_COLOR}$1"
	echo "-----------------------------------------------------------${NC}"
}

echotitle "Building..."
npm run build

echotitle "Uploading from '${DIST_PATH}' to '${DEPLOY_SSH}:${DEPLOY_PATH}'..."
rsync -zr --no-perms ${DIST_PATH} ${DEPLOY_SSH}:${DEPLOY_PATH}

echotitle "Removing '${DIST_PATH}'..."
rm -r ${DIST_PATH}

echotitle "Dashboard successfully deployed!"
