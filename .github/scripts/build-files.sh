#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

echo "Remove Old Dist"
rm -rf ./admin/dist
rm -rf ./public/build

echo "Composer Installing in dev mode"
composer install

# setting up prefixed vendor
echo "Setting up prefixed vendor"
composer run-script prefix-dependencies

echo "Composer Installing"
composer install --no-dev

# Removing redundant libs
echo "Remove Redundant libs"
cd vendor/aws/aws-sdk-php/src

# removing redundant aws libs
find . -mindepth 1 -maxdepth 1 -type d ! -name 'Configuration' ! -name 'CloudFront' ! -name 'S3' ! -name 'Exception' ! -name 'data' ! -name 'Credentials' ! -name 'Api' ! -name 'Signature' ! -name 'DefaultsMode'  ! -name 'Endpoint' ! -name 'EndpointDiscovery' ! -name 'EndpointV2' ! -name 'Token' ! -name 'Retry' ! -name 'ClientSideMonitoring' ! -name 'Handler' ! -name 'Arn' ! -name 'Multipart' -exec rm -r {} \;
cd ./data
find . -mindepth 1 -maxdepth 1 -type d ! -name 'configuration' ! -name 'cloudfront' ! -name 's3' ! -name 's3control' ! -name 's3outposts' -exec rm -r {} \;
cd ../../../../

# removing */docs/*
find . -type d -name 'docs' -exec rm -r {} \; || true

# removing codesniffer
rm -rf squizlabs automattic bin dealerdirect fidry humbug nikic sirbrillig webmozart wp-coding-standards
cd composer
rm -rf installers autoload_classmap.php autoload_files.php autoload_namespaces.php autoload_psr4.php installed.json installed.php InstalledVersions.php
cd ../../

echo "Composer Installing Prefixed Vendor"
cd vendor_prefixed
composer install --no-dev

echo "Yarn Install"
yarn

echo "Build"
yarn build

echo "Build AI Content Assistant"
cd ../admin/apps/ai-content-assistant
yarn
yarn build
