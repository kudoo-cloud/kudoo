[![Build Status](https://travis-ci.com/kudoo-cloud/kudoo.svg?branch=master)](https://travis-ci.com/kudoo-cloud/kudoo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# [Kudoo](https://kudoo.io)

  - [Prerequisites](#prerequisites)
  - [Credentials](#credentials)
  - [Running a local dev environment](#running-a-local-dev-environment)

## Prerequisites
You'll need to have the following running on your local machine
* [Node](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [Docker compose](https://docs.docker.com/compose/)
* [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/)

For Node we'd suggest install [NVM](https://github.com/nvm-sh/nvm). If you're using Windows then please use [NVM-Windows](https://github.com/coreybutler/nvm-windows)

**Please note** We will always use the long term release supported version of Node. Currently this is 12.

You'll need to have the following global packages installed
`npm install -g pm2`

**Please note** We use [Amazon S3](https://aws.amazon.com/s3/) to store files. To enable this functionality you must setup AWS S3.
 
## Credentials
You will now need to setup your environmental variables.

Firstly you'll need to adjust the `linux.yml` file and add your database username and password.

Copy the `env.sample` file to two new files:
* .env
* .env.development

And then configure the variables.

Here's an example config
```.env
# FRONTEND
NODE_ENV=development
GRAPHQL_API_URL=http://localhost:3000/api/
STRIPE_API_KEY=testing
SKELM_BASE_URL=http://localhost:3000
```

## Running a local dev environment
### Non Windows based OS
If you are on Linux or MacOS you can simply run the following command
`bash ./run.sh`

### Windows
We are currently working on getting a Powershell script working.