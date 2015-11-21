"use strict"
var Environment = require("../../environment");

class IsolatedEnvironments extends Environment{
  constructor(config){
    super(config, config.applicationList, config.workerList)
    clearInterval(this._advertiseInterval)
  }

  advertise(){

  }

  receivedAdvertisement(){

  }

  sendToWorker(path, req){
    for(var i = 0; i < this._workerRoutes.length; i++){
      var route = this._workerRoutes[i];
      if(route.pathRegExp.test(path)){
        req.parent = route.worker;
        req.next();
        break;
      }
    }
  }

  requestEnd(req){
    console.log(req.body);
  }

  requestStart(req){
    req.choreIdx--;
    req.parent = this.applications[0];
    req.next();
  }

  sendToApplicationManager(origination, req){
    req.parent = this.applications[0];
    req.next();
  }
}

module.exports = IsolatedEnvironments;
