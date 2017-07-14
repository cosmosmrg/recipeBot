# CrispyBot

**Cautions**
you need only 3 file which are api.js,bot.js and package.json
other file will be generate from install and build

* Claudiajs to manage AWS Lambda Function
* spoonacular for researching recipe https://market.mashape.com/spoonacular/recipe-food-nutrition#
* claudia-bot-builder to integrate with facebook messenger
* run on facebook messager "Crispy the bot" page
https://www.facebook.com/Crispy-the-bot-691783887674641/

# How to Install
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
* install all dependencies in package.json()

  $npm install => this will create package-lock.json()

# How to build
* this will create claudia.json()
  $claudia create --region us-east-1 --api-module bot

  where bot is the name of module it can be noobbot (index should be noobbot.js),
        us-east-1 is the region you want the bot to deploy on Lambda.
  if the role is already exists go to package.json() change name to anything else then install again
  Cautions: this take quite long time


# How to Deploy
* to deploy on facebook Example: https://vimeo.com/170647056

  * you need a pages that currently running on facebook
  * go to this link https://developers.facebook.com/ to create an app

  * add Product messager
  * go to Token Generation chose the page you want to    
    create bot (require permission) then you will get the Page Access Token

  $ claudia update --configure-fb-bot

  => this will gave the Callback URL and Verify Token
  => need Page Access Token from last step to put in
  => secret can be find in developer.facebook
      => app =>settings

  * in the page we use to gen page access Token, under it is Webhooks
    * setup Webhooks use Callback URL and Verify Token
    * Subscription Fields we need are
      * messages
      * message_deliveries
      * messaging_postbacks
      * messaging_optins
      * messaging_account_linking
    * in the same area there is a dropdown to choose the page to subscribe this select the page you want to deploy bot

* other platform
  https://claudiajs.com/tutorials/hello-world-chatbot.html

# How to update code

* $claudia update
