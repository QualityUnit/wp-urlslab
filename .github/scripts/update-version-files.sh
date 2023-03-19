#!/bin/bash
set -eo pipefail

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Missing PACKAGE_VERSION env var"
	exit 1
fi

sed -i -E "s/Version: .*/Version: ${PACKAGE_VERSION}/g" urlslab.php
sed -i -E "s/URLSLAB_VERSION', '.*'/URLSLAB_VERSION', '${PACKAGE_VERSION}'/g" urlslab.php