#!/bin/sh
set -eux

export AWS_DEFAULT_REGION=us-east-1
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name queue
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket bucket
aws --endpoint-url=http://localhost:4566 dynamodb create-table --table-name \
  table --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
