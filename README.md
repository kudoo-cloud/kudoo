[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![kudoo-cloud](https://circleci.com/gh/kudoo-cloud>/kudoo.svg?style=svg)]()

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

**Please note** We will always use the long term release supported version of Node. Currently this is 14.

You'll need to have the following global packages installed
`npm install -g pm2`

**Please note** We use [Arweave](https://www.arweave.org/) to store files.
 
## Credentials
You will now need to setup your environmental variables.


Copy the `env.sample` file to two new files:
* .env
* .env.development

And then configure the variables.

Here's an example config
```.env
# FRONTEND
NODE_ENV=development
GRAPHQL_API_URL=http://localhost:3000/api/
SKELM_BASE_URL=http://localhost:3000
```

## Running a local dev environment
### Non Windows based OS
If you are on Linux or MacOS you can simply run the following command
`bash ./run.sh`

### Windows
We are currently working on getting a Powershell script working.