let createError = require('http-errors');

let express = require('express');
let router = express.Router();

let nearestNodeFinder = require('../algo_modules/nearest-node-finder');
let routingModule = require('../algo_modules/routing-module');

/**
 * POST request for firing O.D. requests to algorithm module after finding
 * nearest origin and destination nodes on graph.
 * Update weight of graph based on usage and arrival signals.
 * 
 * Required JSON request body:
 * {
 *   "coordinates":
 *   [
 *     [longitude, latitude],    //origin
 *     [longitude, latitude]     //destination
 *   ]
 * }
 * 
 * On success (200) returns JSON body:
 * {
 *   "msg": "OK",
 *   "data":  // path
 *     [
 *        [longitude, latitude],
 *        [longitude, latitude],
 *        ....
 *     ]
 * }
*/
router.post('/', function(req, res, next) {
    let resBuilder = req.resBuilder;

    // Retrieve O.D. coordinates and find nearest nodes on graph
    let requestOriginLat, requestOriginLong;
    let requestDestinationLat, requestDestinationLong;

    try {
        let parseResult = parseODRequest(req.body.coordinates);
        requestOriginLat = parseResult.ori.lat;
        requestOriginLong = parseResult.ori.lat;
        requestDestinationLat = parseResult.dest.lat;
        requestDestinationLong = parseResult.dest.long;
    }catch(error) {
        return next(error);
    }

    let graphOriginPromise =
        nearestNodeFinder.find(requestOriginLong, requestOriginLat);
    let graphDestinationPromise = 
        nearestNodeFinder.find(requestDestinationLong, requestDestinationLat);
    
    Promise.all([graphOriginPromise, graphDestinationPromise])
    .then((graphNodes) => {
        // Fire O.D. request to path-finding module with new coordinates
        let graphOrigin = graphNodes[0];
        let graphDestination = graphNodes[1];
        // let pathPromise = crowdControlodule.route(graphOrigin, graphDestination)
        let pathPromise = routingModule.route(graphOrigin, graphDestination);
        return pathPromise;
    })
    .then((path) => {
        // Format path and return
        let result = resBuilder.build("OK", path);
        res.json(result);
    })
    .catch((error) => {
        // Server error arose from nearest-node-finder or routing-module
        next(createError(error));
    });
});

/**
 * Slow Routing for Experiment.
 */
router.post('/slow', function(req, res, next) {
    let resBuilder = req.resBuilder;

    // Retrieve O.D. coordinates and find nearest nodes on graph
    let requestOriginLat, requestOriginLong;
    let requestDestinationLat, requestDestinationLong;

    try {
        let parseResult = parseODRequest(req.body.coordinates);
        requestOriginLat = parseResult.ori.lat;
        requestOriginLong = parseResult.ori.lat;
        requestDestinationLat = parseResult.dest.lat;
        requestDestinationLong = parseResult.dest.long;
    }catch(error) {
        return next(error);
    }

    let graphOriginPromise =
        nearestNodeFinder.find(requestOriginLong, requestOriginLat);
    let graphDestinationPromise = 
        nearestNodeFinder.find(requestDestinationLong, requestDestinationLat);
    
    Promise.all([graphOriginPromise, graphDestinationPromise])
    .then((graphNodes) => {
        // Fire O.D. request to path-finding module with new coordinates
        let graphOrigin = graphNodes[0];
        let graphDestination = graphNodes[1];
        // let pathPromise = crowdControlodule.route(graphOrigin, graphDestination)
        let pathPromise = routingModule.slowRoute(graphOrigin, graphDestination);
        return pathPromise;
    })
    .then((path) => {
        // Format path and return
        let result = resBuilder.build("OK", path);
        res.json(result);
    })
    .catch((error) => {
        // Server error arose from nearest-node-finder or routing-module
        next(createError(error));
    });
});

/**
 * Utility function for extracting cooridinates from a parsed JSON object.
 * @param {ParsedJSON} requestCoordinates 
 */
function parseODRequest(requestCoordinates) {
    let result = {
        "ori": {
            "long": null,
            "lat": null,
        },
        "dest": {
            "long": null,
            "lat": null,
        }
    };

    if(requestCoordinates == null) {
        throw(createError(400, {"message": "Missing coordinates"}));
    }

    let requestOrigin = requestCoordinates[0];
    let requestDestination = requestCoordinates[1];
    if(requestCoordinates == null 
        || requestOrigin == null
        || requestDestination == null) {
        throw(createError(400, {"message": "Missing origin / destination"}));
    }

    if(requestOrigin[0] == null
        || requestOrigin[1] == null
        || requestDestination[0] == null
        || requestDestination[1] == null) {
        throw(createError(400, {"message": "Missing longitude / latitude"}));
    }

    result["ori"]["long"] = requestOrigin[0];
    result["ori"]["lat"] = requestOrigin[1];
    result["dest"]["long"] = requestDestination[0];
    result["ori"]["lat"] = requestDestination[1];

    return result
}

module.exports = router;
