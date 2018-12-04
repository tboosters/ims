/**
 * Slow function to simulate CPU Bound task
 * @param {number} baseNumber 
 */

function slowFunction(baseNumber) {
	var result = 0;	
	for (var i = Math.pow(baseNumber, 10); i >= 0; i--) {		
		result += Math.atan(i) * Math.tan(i);
	};
	return result;
}

module.exports = slowFunction;