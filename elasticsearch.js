var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: '192.168.99.100:9200',
    log: 'info'
});

var indexName = "metrics";

/**
* Delete an existing index
*/
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                project: { type: "string" },
                component: { type: "string" },
                job: { 
                    name: "string",
                    build: "number",
                    runTime: "time",
                    runDate: "time"
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
                project: document.project,
                component: document.component,
                job: { 
                    name: document.name,
                    build: document.build,
                    runTime: document.runTime,
                    runDate: document.runDate
                }
        }
    });
}
exports.addDocument = addDocument;