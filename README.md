# Novel Worker Node
Microservice extracting content from webpages and creating ebooks from it.

## Run locally

https://github.com/localstack/localstack
`awslocal sqs create-queue --queue-name sample-queue`

## Config
Create a `.env` file in the project root with following values set.
Provided values are configured to localstack default values.
Region need to be us-east-1 even though localstack claims to be region agnostic.

```
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
REGION=us-east-1
QUEUE_URL=http://172.17.0.2:4566/000000000000/local
BUCKET=
```