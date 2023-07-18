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
composer install

echo "Composer Installing Prefixed Vendor"
cd vendor_prefixed
composer install

echo "Yarn Install"
yarn

echo "Build"
yarn build

echo "Build AI Content Assistant"
cd ../admin/apps/ai-content-assistant
yarn
yarn build
