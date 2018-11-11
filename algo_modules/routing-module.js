let slowFunction = require('../utilities/slow-function');

const longlat = [
    [-122.400129, 37.788975],
    [-122.399362, 37.788361],
    [-122.418702, 37.773081],
    [-122.41993, 37.770194],
    [-122.426132, 37.76965],
    [-122.434868, 37.762785],
    [-122.439417, 37.76139],
    [-122.438936, 37.756525],
    [-122.441021, 37.756218],
    [-122.444549, 37.747129],
    [-122.451624, 37.745658],
    [-122.454437, 37.743925],
    [-122.456246, 37.74176],
    [-122.458209, 37.740771],
    [-122.464528, 37.739935],
    [-122.466244, 37.739249],
    [-122.468337, 37.740036],
    [-122.469999, 37.739565],
    [-122.505448, 37.738003],
    [-122.50541, 37.737463]
];

/**
 * Delegates O.D. request to the fast implementation of routing module.
 * EATS LOTS OF CPU CYCLES
 * 
 * @param {number} origin 
 * @param {number} destination 
 * @returns {Promise} Promise of the delegated job.
 */
function slowRoute(origin, destination){
    let p = new Promise((resolve, reject) => {
        slowFunction(5);
        resolve(longlat);
    });
    return p;
}

/**
 * Delegates O.D. request to the fast implementation of routing module.
 * DOESN'T EAT CPU CYCLES
 * 
 * @param {number} origin 
 * @param {number} destination 
 * @returns {Promise} Promise of the delegated job.
 */
function route(origin, destination) {
    let p = new Promise((resolve, reject) => {
        setTimeout(
            () => resolve(longlat),
            800
        );
    });
    return p;
}

module.exports.slowRoute = slowRoute;
module.exports.route = route;