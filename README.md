
    ██╗  ██╗██╗   ██╗██████╗  ██████╗  ██████╗     
    ██║ ██╔╝██║   ██║██╔══██╗██╔═══██╗██╔═══██╗    
    █████╔╝ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██╔═██╗ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██║  ██╗╚██████╔╝██████╔╝╚██████╔╝╚██████╔╝    
    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝     

  - [Prerequisites](#prerequisites)
  - [Running a local dev environment](#running-a-local-dev-environment)

# Prerequisites
You'll need to have the following running on your local machine
* [Node](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [Docker compose](https://docs.docker.com/compose/)

You will now need to setup your environmental variables.

Under the frontend folder copy the `env.sample` file to two new files:
* .env
* .env.development

## NPM packages
You'll need to have the following global packages installed
`npm install -g pm2`

# Running a local dev environment
If you are on Linux or MacOS you can simply run the following command
`bash ./run.sh`

If you're on Windows, you'll have to wait awhile until we get a Powershell script working.