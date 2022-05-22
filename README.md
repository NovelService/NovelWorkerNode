# Novel Worker Node
Microservice extracting content from webpages and creating ebooks from it.

## Run locally
### Localstack
[Localstack](https://github.com/localstack/localstack) is a fully functional local AWS cloud stack, which we will use while developing.
Start Localstack with
```
docker compose up -d
```
And then initialize the services with the `create-localstack-resources.sh` script

You can try it out by sending a message to sqs and then fetching the result from dynamodb.
That result will contain an url from which you can download the ebook.
Or simply look at the integration tests
```
awslocal sqs send-message --queue-url http://localhost:4566/00000000000/queue --message-body "{\"id\":\"703c1dfd-bdb3-4c47-82b6-c554f0e6e848\",\"urls\":[\"https://novelservice.github.io/\"],\"options\": {}}"
awslocal dynamodb scan --table table
```

## Config
See `local.env` for a configuration for your local environment with localstack.

### Permissions
- "s3:PutObject"
- "s3:GetObject"
- "dynamodb:UpdateItem"
- AWSLambdaSQSQueueExecutionRole  (to be reduced)
## Documentation
See [here](https://github.com/NovelService/.github#architecture) for an overall architecture overview
### Links
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
- https://docs.localstack.cloud/localstack/configuration/
