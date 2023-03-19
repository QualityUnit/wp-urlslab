#!/bin/bash
# Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor
set -eo pipefail

echo "Set GIT User"
git config user.name ${MAINTAIN_USERNAME}
git config user.email ${MAINTAIN_EMAIL}
