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
                    duration: "time",
                    runDate: "time"
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addConfiguration(conf) {

    return elasticClient.index({
        index: 'sys_conf' ,
        type: 'sys_conf',
        body: {
            project: conf.project,
            component: conf.component,
            jobUrl: conf.jobUrl,
            processed_build: conf.processed_build
        }
    });
}

/*  This allows me to add metrics to the database */

function addMetrics(metrics) {
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();

    return elasticClient.index({
        index: `${indexName}-${year}.${month}.${day}`,
        type: "metrics",
        body: {
                project: metrics.project,
                component: metrics.component, 
                name: metrics.name,
                build: metrics.build,
                duration: metrics.duration,
                timestamp: metrics.timestamp
                
        }
    });
}

function checkMetrics(metrics, callback) {

    return elasticClient.searchexists({
        index: '_all',
        type: 'metrics',
        body: {
            query: {
                "must": [
                    { "match": { "project": metrics.project }}, 
                    { "match": { "component": metrics.component }},
                    { "match": { "build": metrics.build }}, 
                    { "match": { "duration": metrics.duration, }}, 
                    { "match": { "timestamp": metrics.timestamp }}
                ],
            }
        }
        }, function (error, exists) {
    if (exists === true) {
        callback(true);
    } else {
        callback(false);
    }
    });

}

/*  search for stuff in elasticsearch */

function getConfig(callback) {
    elasticClient.search({
        index: 'sys_conf',
        type: 'sys_conf',
        body: {
            query: {
                "match_all": {}
            }
        }
    }, callback);
} 


exports.addMetrics = addMetrics;
exports.getConfig = getConfig;
exports.addConfiguration = addConfiguration;