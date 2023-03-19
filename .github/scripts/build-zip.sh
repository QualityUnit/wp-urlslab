#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Missing PACKAGE_VERSION env var"
	exit 1
fi

PLUGIN_ZIP_FILENAME="urlslab-${PACKAGE_VERSION}.zip"
rm -rf *.zip .git .github docker yarn.lock webpack.config.js postcss.config.js phpcs.xml package.json Makefile composer.lock composer.json commitlint.config.js .stylelintrc .gitignore .eslintrc .eslintignore admin/.eslintignore admin/.eslintrc admin/.stylelintrc admin/index.html admin/package.json admin/vite.config.js admin/yarn.lock
zip -r $PLUGIN_ZIP_FILENAME . -x "*.zip"
echo "PLUGIN_ZIP_FILENAME=${PLUGIN_ZIP_FILENAME}" >> $GITHUB_ENV
echo "PLUGIN_ZIP_PATH=./**/*" >> $GITHUB_ENV
