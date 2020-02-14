cd ../../
cd client/common
npm install
cd ..
echo Which web application do you want to run?
read webapp
cd $webapp
npm install
npm run start