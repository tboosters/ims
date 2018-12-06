let slowFunction = require('../utilities/slow-function');

/**
 * Find the nearest node of the input node in the map graph,
 * and then returns the nodeID of that nearest node.
 * 
 * @param {number} longitude 
 * @param {number}  latitude
 * @returns {number} nodeID
 */
function find(longitude, latitude) {
    let p = new Promise(function(resolve, reject){
        setTimeout(
            () => resolve(0),
            300
        );
    });

    return p;
}

function slowFind(longitude, latitude) {
    slowFunction(4.4);
    return 0;
}

module.exports.find = find;
module.exports.slowFind = slowFind;