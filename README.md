# Novel Worker Node
Microservice extracting content from webpages and creating ebooks from it.

## Run locally
### Localstack
[Localstack](https://github.com/localstack/localstack) is a fully functional local AWS cloud stack, which we will use while developing.
Follow its [Installation guideline](https://github.com/localstack/localstack#installing) and then run:
```
localstack start -d
awslocal sqs create-queue --queue-name queue
awslocal s3api create-bucket --bucket bucket
```

## Config
Create a `.env` file in the project root with following values set.
Provided values are configured to localstack default values.

```
ACCESS_KEY_ID=what
SECRET_ACCESS_KEY=ever
REGION=us-east-1
QUEUE_URL=http://172.17.0.2:4566/000000000000/queue
ENDPOINT=http://172.17.0.2:4566/
BUCKET=bucket
```

## Documentation
### Links
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
