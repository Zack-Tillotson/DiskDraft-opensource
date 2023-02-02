export default function(period = 1000) {

  let lastPromise = Promise.resolve();

  function enqueue() {
    const thisPromise = lastPromise
      .then(enqueueTime => {
        return new Promise(function(resolve, reject) {
          const nowTime = Date.now();
          const timeToWait = Math.max(enqueueTime + period - nowTime, 0);
          setTimeout(function() {resolve(nowTime)}, timeToWait);
        });
    });
    lastPromise = thisPromise;
    return thisPromise;
  }

  return {enqueue}
}