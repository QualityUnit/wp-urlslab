#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Missing PACKAGE_VERSION env var"
	exit 1
fi

rm -rf *.zip .git .github node_modules docker yarn.lock webpack.config.js postcss.config.js phpcs.xml package.json Makefile composer.lock composer.json commitlint.config.js .stylelintrc .gitignore .eslintrc .eslintignore
rm -rf admin/node_modules admin/.eslintignore admin/.eslintrc admin/.stylelintrc admin/index.html admin/package.json admin/vite.config.js admin/yarn.lock admin/apps/ai-content-assistant/node_modules admin/apps/ai-content-assistant/.eslintignore admin/apps/ai-content-assistant/.eslintrc admin/apps/ai-content-assistant/.gitignore admin/apps/ai-content-assistant/.stylelintrc admin/apps/ai-content-assistant/index.html admin/apps/ai-content-assistant/package.json admin/apps/ai-content-assistant/tsconfig.json admin/apps/ai-content-assistant/tsconfig.node.json admin/apps/ai-content-assistant/vite.config.ts admin/apps/ai-content-assistant/yarn.lock
rm -rf blocks/node_modules

PLUGIN_ZIP_FILENAME="urlslab-${PACKAGE_VERSION}.zip"
dir_name="urlslab"
mkdir "$dir_name"
for file in *; do
    if [ "$file" != "$dir_name" ]; then
        mv "$file" "$dir_name"
    fi
done

if test -f "./urlslab/temp-changelog-from-readme.txt"; then
    mv ./urlslab/temp-changelog-from-readme.txt ./temp-changelog-from-readme.txt
fi

zip -r $PLUGIN_ZIP_FILENAME ./urlslab/ -x "*.zip"
echo "PLUGIN_ZIP_FILENAME=${PLUGIN_ZIP_FILENAME}" >> $GITHUB_ENV
echo "PLUGIN_ZIP_PATH=./**/*" >> $GITHUB_ENV
