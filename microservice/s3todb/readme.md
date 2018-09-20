This microservice is parsing the content from the file that uploaded to the AWS S3 and inserting the transformed metadata into the DynamoDB. When a file upload to the S3 bucket, it will trigger this lambda function and insert new or modified records into the DynamoDB. Detail IAM roles, Lambda function, and lambda configurations are described as below. Note: This is for demonstration purpose. You should use less privileged access control based on your needs.

# IAM
* Managed policy: AWSLambdaBasicExectionRole
* DynamoDb access policy: [dynamodb_access.json](IAM/dynamodb_access.json)
* S3 access policy: [s3_access.json](IAM/s3_access.json)

# Lambda
* Function code: [index.js](index.js)
* Runtime: Node.js 8.10
* Execution role: a IAM role associated with roles in the IAM section
* Timeout: 5 mins
* Triggers: S3
	* Event type: ObjectCreated
	* Bucket: Your S3 bucket
