const { parentPort, workerData, threadId } = require('worker_threads');

let nearestNodeFinder = require('./nearest-node-finder');
let routingModule = require('./routing-module');

console.log(threadId);

let graphOrigin =
        nearestNodeFinder.slowFind(workerData.requestOrigin[0], workerData.requestOrigin[1]);
let graphDestination = 0;
        // nearestNodeFinder.slowFind(workerData.requestDestination[0], workerData.requestDestination[1]);

let path = routingModule.slowRoute(graphOrigin, graphDestination);

parentPort.postMessage(path);