# Novel Worker Node
Microservice extracting content from webpages and creating ebooks from it.

## Run locally
### Localstack
[Localstack](https://github.com/localstack/localstack) is a fully functional local AWS cloud stack, which we will use while developing.
Run following commands to start it and create the necessary aws services:
```
docker compose up -d
awslocal sqs create-queue --queue-name queue
awslocal s3api create-bucket --bucket bucket
awslocal dynamodb create-table --table-name table --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```
```
awslocal sqs send-message --queue-url http://localhost:4566/00000000000/queue --message-body "{\"id\":\"703c1dfd-bdb3-4c47-82b6-c554f0e6e848\",\"urls\":[\"https://novelservice.github.io/\"],\"options\": {}}"
```

## Config
Create a `.env` file in the project root with following values set.
Provided values are configured to localstack default values.

```
ACCESS_KEY_ID=what
SECRET_ACCESS_KEY=ever
REGION=us-east-1
QUEUE_URL=http://localhost:4566/000000000000/queue
ENDPOINT=http://localhost:4566
HOST=localhost:4566
BUCKET=bucket
POLL_INTERVAL=5000
TABLE=table
```

### Permissions
- "s3:PutObject"
- "s3:GetObject"
- "dynamodb:UpdateItem"
- AWSLambdaSQSQueueExecutionRole  (to be reduced)
## Documentation
### Links
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
- https://docs.localstack.cloud/localstack/configuration/
