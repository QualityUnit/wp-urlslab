#!/bin/bash
set -eo pipefail

echo "Set GIT User"
git config user.name ${MAINTAIN_USERNAME}
git config user.email ${MAINTAIN_EMAIL}