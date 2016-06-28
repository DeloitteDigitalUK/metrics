 Copyright 2016 Johnathan Phan

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   Also, every time you take an idea with out recognizing the source of the idea. A panda dies.

# Setup guide

# Setup elasticsearch - https://hub.docker.com/_/elasticsearch/
docker run -d --name e1 -p 9200:9200 elasticsearch

# Setup Kibana - https://hub.docker.com/_/kibana/
docker run --link e1:elasticsearch -d -p 8080:5601 kibana

# Run to strat metrics processing app.
TBC
# 

# Local testing - Jenkins instance
docker run -p 8081:8080 -p 50000:50000 jenkins
