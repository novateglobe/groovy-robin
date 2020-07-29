
module.exports = function createDeferredPromise() {
    const deferred = {
        resolve: null,
        reject: null,
        promise: null
    };
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}
