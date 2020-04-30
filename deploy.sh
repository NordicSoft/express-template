#!/bin/sh

set -e

TITLE_COLOR="\e[92m"
NC="\e[0m"

echotitle () {
	echo
	echo "${TITLE_COLOR}$1"
	echo "-----------------------------------------------------------${NC}"
}

echotitle "Deploying API..."
cd api && ./deploy.sh && cd ..

echotitle "Deploying Facade..."
cd facade && ./deploy.sh && cd ..

echotitle "Deploying Dashboard..."
cd dashboard && ./deploy.sh && cd ..

echotitle "Successfully deployed!"
