/**
 * Receives incident coordinates and delegates graph update to the fast implementation
 * of incident analysis module.
 * 
 * @param {number} longitude 
 * @param {number} latitude 
 * @returns {Promise} Promise of the delegated job.
 */
function injectIncident(longitude, latitude) {
    let p = new Promise(function(resolve, reject){
        setTimeout(
            () => resolve(),
            300
        );
    });
    return p;
}

module.exports.injectIncident = injectIncident;