#!/bin/bash
echo Stopping PM2 Processes
pm2 reset all
pm2 stop all
echo Stopping all existing Docker containers
docker kill $(docker ps -aq)
docker-compose -f linux.yml up -d 
cd backend/skelm
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
echo Now to start the frontend
cd ../frontend
npm install && npm run start