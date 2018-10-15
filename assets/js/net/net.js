game.Net = {
  reqQueue: [],

  addRequest: function({ type, addr, createPayload }) {
    return new Promise((resolve, reject) => {
      this.reqQueue.push(() => {
        this.sendRequest(type, addr, createPayload)
          .then(response => {
            if (response.success) resolve(response.content);
            else {
              this.clearQueue();
              reject(response.content);
            }
          })
          .then(() => {
            this.reqQueue.shift();
            if (this.reqQueue.length > 0) {
              this.reqQueue[0]();
            }
          })
          .catch(() => error => reject(error));
      });

      if (this.reqQueue.length === 1) {
        this.reqQueue[0]();
      }
    });
  },

  addRequestNoQueue: function({ type, addr, createPayload }) {
    return new Promise((resolve, reject) => {
      this.sendRequest(type, addr, createPayload)
        .then(response => {
          if (response.success) resolve(response.content);
          else reject(response.content);
        })
        .catch(error => reject(error));
    });
  },

  sendRequest: function(type, addr, createPayload) {
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = this.buildRequestResponse(resolve, reject);
      xhttp.open(type, window.location.href + addr, true);

      if (type == 'POST') {
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(createPayload()));
      } else {
        xhttp.send();
      }
    });
  },

  clearQueue: function() {
    this.reqQueue.length = 0;
  },

  post: function({ addr, createPayload, noQueue = false }) {
    if (noQueue)
      return this.addRequestNoQueue({
        type: 'POST',
        addr,
        createPayload,
      });
    else return this.addRequest({ type: 'POST', addr, createPayload });
  },

  get: function(addr, noQueue = false) {
    if (noQueue) return this.addRequestNoQueue({ type: 'GET', addr });
    else return this.addRequest({ type: 'GET', addr });
  },

  buildRequestResponse: function(resolve, reject) {
    return function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = JSON.parse(this.responseText);
          resolve(response);
        } else {
          reject('Request completed unexpectedly!');
        }
      }
    };
  },

  postAction: function(action) {
    return this.post({
      addr: 'phases/new-action',
      createPayload: () => action.createPayload(),
    });
  },

  subscribeActionUpdates: function(latestActionId) {
    return this.post({
      addr: 'phases/subscribe-action-updates',
      createPayload: () => ({ latestActionId }),
      noQueue: true,
    });
  },
};
