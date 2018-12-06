const { Worker } = require('worker_threads');

function startWorker(path, data, callback) {
	let w = new Worker(path, {workerData: data});
	w.on('message', (msg) => {
		callback(null, msg);
	})
	w.on('error', callback);
	w.on('exit', (code) => {
		if(code != 0){
            error = new Error(`Worker stopped with exit code ${code}`);
            console.error(error);
        }
    });
	return w;
}

module.exports = startWorker;