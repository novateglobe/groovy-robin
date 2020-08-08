#!/usr/bin/env bash

set -e
set -o pipefail
set -v

curl -s -X POST https://api.stackbit.com/project/5f2ebc2a40a5d7001c92e00a/webhook/build/ssgbuild > /dev/null

next build && next export

curl -s -X POST https://api.stackbit.com/project/5f2ebc2a40a5d7001c92e00a/webhook/build/publish > /dev/null