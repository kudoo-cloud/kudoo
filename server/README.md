
    ██╗  ██╗██╗   ██╗██████╗  ██████╗  ██████╗     
    ██║ ██╔╝██║   ██║██╔══██╗██╔═══██╗██╔═══██╗    
    █████╔╝ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██╔═██╗ ██║   ██║██║  ██║██║   ██║██║   ██║    
    ██║  ██╗╚██████╔╝██████╔╝╚██████╔╝╚██████╔╝    
    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝     

# Running a development server
Run the Docker compose

`.scripts/docker/docker-compose -f dev.yml up -d`

Then make sure you use Node 10. 12 is not working for some reason.

`pm2 start skelm-pm2.json`
# Running production