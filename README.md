
    ██╗  ██╗██╗   ██╗██████╗  ██████╗  ██████╗     
    ██║ ██╔╝██║   ██║██╔══██╗██╔═══██╗██╔═══██╗    
    █████╔╝ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██╔═██╗ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██║  ██╗╚██████╔╝██████╔╝╚██████╔╝╚██████╔╝    
    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝     

  - [Prerequisites](#prerequisites)

# Prerequisites
You'll need to have the following running on your local machine
* [Node](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [Docker compose](https://docs.docker.com/compose/)

You will now need to setup your environmental variables.

Under the frontend folder copy the `env.sample` file to two new files:
* .env
* .env.development

To get a local running environment we need to ensure that the following are running:

* [Prisma](https://www.prisma.io/)
* Skelm

Once those are up we can then run our static front end.