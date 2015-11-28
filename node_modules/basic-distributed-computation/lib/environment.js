"use strict"
var EE = require("events").EventEmitter;

class Environment extends EE{
  constructor(config, applicationList, workerList){
    super();
    this.config = config;
    this.id = config.id;
    this.environUris = config.environmentsUris;
    this.workers = [];
    this.applications = [];
    this.knownEnvironments = {};
    this._workerRoutes = [];
    this.globalStorage = config.globalStorage;
    this.sessionStorage = config.sessionStorage;

    for(var i in applicationList){
      var appCon = require(applicationList[i]);
      this.applications.push(new appCon(this));
    }

    for(var i in workerList){
      var workCon = require(workerList[i]);
      var worker = new workCon(this);
      this._workerRoutes.push({path:worker.path, pathRegExp:worker.pathRegExp, worker:worker});
      this.workers.push(worker);
    }

    this.on("received-advertisement", (message) => {
      this.receivedAdvertisement(message)
    });

    this.on("send-to-worker", (path, req) => {
      this.sendToWorker(path, req);
    });

    this.on("request-end", (req) => {
      this.requestEnd(req);
    });

    this.on("request-start", (req) => {
      this.requestStart(req);
    });

    this.on("send-to-application-manager", (origination, req) => {
      this.sendToApplicationManager(origination, req);
    })

    this._advertiseInterval = setInterval(() => {
      this.advertise();
    }, config.advertisementInterval || 15000);

  }

  saveToGlobalStore(data){
    throw new Error("Not Implemented");
  }

  getDataFromSessionStore(sessionKey, search){
    throw new Error("Not Implemented");
  }

  saveToSessionStore(sessionKey, meta, data){
    throw new Error("Not Implemented");
  }

  getDataFromGlobalStore(search){
    throw new Error("Not Implemented");
  }

  advertise(){
    throw new Error("Not Implemented");
  }

  receivedAdvertisement(){
    throw new Error("Not Implemented");
  }

  sendToWorker(){
    throw new Error("Not Implemented");
  }

  requestEnd(){
    throw new Error("Not Implemented");
  }

  requestStart(){
    throw new Error("Not Implemented");
  }

  sendToApplicationManager(){
    throw new Error("Not Implemented");
  }
}

module.exports = Environment;
