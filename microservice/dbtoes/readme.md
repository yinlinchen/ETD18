This microservice is syncing the data from DynamoDB to ElasticSearch. Any changes made in the DynamoDB table will trigger this lambda function and index new or modified records into the ElasticSearch. Detail IAM roles, DynamoDB configuration, Lambda function, and lambda configurations are described as below. Note: This is for demonstration purpose. You should use less privileged access control based on your needs.

# DynamoDB
* Stream enabled 
* View type: new image

# IAM
* Managed policy: AWSLambdaBasicExectionRole
* DynamoDb access policy: [dynamodb_access.json](IAM/dynamodb_access.json)
* DynamoDb stream access policy: [dynamodb_stream_access.json](IAM/dynamodb_stream_access.json)
* ElasticSearch access policy: [elasticsearch_access.json](IAM/elasticsearch_access.json)

# Lambda
* Function code: [lambda_function.py](lambda_function.py)
* Runtime: Python 2.7
* Execution role: a IAM role associated with roles in the IAM section
* Timeout: 5 mins
* Triggers: DynamoDB
	* DynamoDB table: Your DynamoDB table
	* Starting postion: Trim horizon
