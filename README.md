# CrispyBot

* Claudiajs to manage AWS Lambda Function
* spoonacular for researching recipe
* claudia-bot-builder to integrate with facebook messenger
* run on facebook messager "Recipe_bot" page @mayrecipe

# How to build
* if you are new to claudia
  * Install claudia
    * $npm install claudia -g
    * $claudia --version      => should return the version of claudia
  * Configuring access credentials
    * Create an AWS profile with IAM full access, Lambda full access and API Gateway Administrator privileges.
    * Add the keys to your .aws/credentials file

      [claudia]
      aws_access_key_id = YOUR_ACCESS_KEY
      aws_secret_access_key = YOUR_ACCESS_SECRET

  * assign the following roles to the user:
    * AWSLambdaFullAccess is required for all Claudia deployments
    * IAMFullAccess is required if you want Claudia to automatically create
      execution roles for your Lambda function
    * AmazonAPIGatewayAdministrator  because this project use Claudia Bot Builder
  * need help? https://claudiajs.com/tutorials/installing.html

* this will create claudia.json()
  $claudia create --region us-east-1 --api-module bot

  where bot is the name of module it can be noobbot (index should be noobbot.js),
        us-east-1 is the region you want the bot to deploy on Lambda.

# How to Install
* install all dependencies in package.json()

  $npm install

# How to Deploy
* to deploy on facebook Example: https://vimeo.com/170647056

  $claudia update --configure-fb-bot

* other platform
  https://claudiajs.com/tutorials/hello-world-chatbot.html

# How to update code

* $claudia update
