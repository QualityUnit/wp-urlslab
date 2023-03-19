#!/bin/bash
set -eo pipefail


echo "Composer Install"
composer install
echo "Yarn Install"
yarn
echo "Build"
yarn build