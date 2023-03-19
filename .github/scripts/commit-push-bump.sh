#!/bin/bash
set -eo pipefail

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Missing PACKAGE_VERSION env var"
	exit 1
fi

bash "${GITHUB_WORKSPACE}/.github/scripts/set-git-user.sh"

echo "Commit and Push Bump Version ${PACKAGE_VERSION}"
git commit -am "chore: bump version to ${PACKAGE_VERSION}"
git push