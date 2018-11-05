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
        let requestCoordinates = req.body.coordinates;
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

        requestOriginLong = requestOrigin[0];
        requestOriginLat = requestOrigin[1];
        requestDestinationLong = requestDestination[0];
        requestDestinationLat = requestDestination[1];
        if(requestOriginLong == null
            || requestOriginLat == null
            || requestDestinationLong == null
            || requestDestinationLat == null) {
            throw(createError(400, {"message": "Missing longitude / latitude"}));
        }

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

module.exports = router;
