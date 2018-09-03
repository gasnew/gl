game.Net = {
  reqQueue: [],

  addRequest: function(type, addr, content = {}) {
    return new Promise((resolve, reject) => {
      this.reqQueue.push(() => {
        this.sendRequest(type, addr, content)
          .then(response => {
            if (response.success) resolve(response.content);
            else reject(response.content);
          })
          .then(() => {
            this.reqQueue.shift();
            if (this.reqQueue.length > 0) {
              this.reqQueue[0]();
            }
          });
      });

      if (this.reqQueue.length === 1) {
        this.reqQueue[0]();
      }
    });
  },

  addRequestNoQueue: function(type, addr, content = {}) {
    return new Promise((resolve, reject) => {
      this.sendRequest(type, addr, content).then(response => {
        if (response.success) resolve(response.content);
        else reject(response.content);
      });
    });
  },

  sendRequest: function(type, addr, content) {
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = this.buildRequestResponse(resolve, reject);
      xhttp.open(type, window.location.href + addr, true);

      if (type == 'POST') {
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(content));
      } else {
        xhttp.send();
      }
    });
  },

  clearQueue: function() {
    this.reqQueue.length = 0;
  },

  post: function(addr, content, { noQueue = false }) {
    if (noQueue) return this.addRequestNoQueue('POST', addr, content);
    else return this.addRequest('POST', addr, content);
  },

  get: function(addr, noQueue = false) {
    if (noQueue) return this.addRequestNoQueue('GET', addr);
    else return this.addRequest('GET', addr);
  },

  buildRequestResponse: function(resolve, reject) {
    return function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = JSON.parse(this.responseText);
          resolve(response);
        } else if (this.status == 400) {
          var response_err = {
            error: 'BAD REQUESTS ALL OVER',
          };
          reject(response_err);
        }
      }
    };
  },

  postAction: function(actionRequest) {
    return this.post('turns/new-action', actionRequest);
  },

  subscribeActionUpdates: function(latestActionId) {
    return this.post(
      'turns/subscribe-action-updates',
      { latestActionId },
      { noQueue: true }
    );
  },
};
