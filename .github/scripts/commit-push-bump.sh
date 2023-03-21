#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Missing PACKAGE_VERSION env var"
	exit 1
fi

bash "${GITHUB_WORKSPACE}/.github/scripts/set-git-user.sh"

echo "Commit and Push Bump Version ${PACKAGE_VERSION}"
git add .
git commit -m "chore: bump version to ${PACKAGE_VERSION}"
git push
