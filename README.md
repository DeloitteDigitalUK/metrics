Setup guide

# Setup elasticsearch - https://hub.docker.com/_/elasticsearch/
docker run -d --name e1 -p 9200:9200 elasticsearch

# Setup Kibana - https://hub.docker.com/_/kibana/
docker run --link e1:elasticsearch -d -p 8080:5601 kibana

# Run to strat metrics processing app.
TBC
# 