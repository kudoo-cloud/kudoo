#!/bin/bash
echo Stopping PM2 Processes
pm2 reset all
pm2 stop all
echo Stopping all existing Docker containers
docker kill $(docker ps -aq)
cd ..
cd docker
echo Are you using Linux  l or a Non-Linux OS n
read os
if [ $os = "l" ] 
then
  echo Good choice!
  docker-compose -f dev.yml -f overide.devlinux.yml up -d 
elif [ $os = "n" ]
then
  echo Mac or Windows users may experience small bugs
  docker-compose -f dev.yml -f overide.nonlinux.yml up -d 
else
  echo You have entered an incorrect command. Docker is not running...
fi
echo Would you like to run Ontoserver y or no
read os
if [ $os = "y" ] 
then
  echo Good choice!
  ../docker/docker-compose -f onto.yml up -d 
else
  echo You have entered an incorrect command. Docker is not running...
fi
echo Would you like to run tests? y or n
read os
if [ $os = "y" ] 
then
  echo Running tests!
  npm run test
  cd ..
elif [ $os = "n" ]
then
  echo Fair enough Cowboy 
else
  echo You have entered an incorrect command. Nothing is happening...
fi

echo Would you like to seed Data?
read os
if [ $os = "y" ] 
then
  echo Seeding Now!
  prisma seed
elif [ $os = "n" ]
then
  echo Awesome, no need for a fresh data load
else
  echo You have entered an incorrect command. Nothings gonna happen...
fi
npm install
echo Are there any schema changes?
read os
if [ $os = "y" ] 
then
  echo Seeding Now!
  npm run prisma-deploy:dev
elif [ $os = "n" ]
then
  echo Awesome, no need for a fresh schema load
else
  echo You have entered an incorrect command. Nothings gonna happen...
fi
pm2 start skelm-pm2.json