PATH="$PATH:$HOME/sonar/bin"
cd ../../client/kudoo
sonar-scanner -Dsonar.projectKey=kudoo -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.testExecutionReportPaths=/home/justin/Source/vizier/client/kudoo/test/sonar.xml
