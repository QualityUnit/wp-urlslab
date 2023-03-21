#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

echo "Composer Install"
composer install
echo "Yarn Install"
yarn
echo "Build"
yarn build
