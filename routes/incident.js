let createError = require('http-errors');

let express = require('express');
let router = express.Router();

let incidentAnalysisModule = require('../algo_modules/incident-analysis-module');

/**
 * POST request for receiving incident reports.
 * Push incident location into the incident analysis module for
 * graph manipulation.
 * 
 * Required JSON request body:
 * {
 *   "coordinates": [longitude, latitude]
 * }
 * 
 * On success (200) returns JSON body:
 * {
 *   "msg": "OK"
 * }
 */
router.post('/', function(req, res, next) {
    let resBuilder = req.resBuilder;
    // Get incident coordinates from request body
    let incidentLat, incidentLong;
    
    try {
        let incidentCoordinates = req.body.coordinates;
        if(incidentCoordinates == null) {
            throw(createError(400, {"message":"Missing coordinates"}));
        }

        incidentLong = incidentCoordinates[0];
        incidentLat = incidentCoordinates[1];
        if(incidentLong == null || incidentLat == null) {
            throw(createError(400, {"message":"Missing longitude / latitude"}));
        }
    } catch(error) {
        return next(error);
    }

    // Push location to graph through Incident Analysis Module
    incidentAnalysisModule.injectIncident(incidentLong, incidentLat)
    .then(() => {
        // Incident injected without error
        let result = resBuilder.build("OK");
        res.json(result);
    })
    .catch((error) => {
        // Incident injection failed
        next(createError(error));
    });
});

module.exports = router;