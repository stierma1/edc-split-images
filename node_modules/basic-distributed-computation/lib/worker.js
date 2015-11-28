"use strict"
var EE = require("events").EventEmitter;
var inOutRegex = new RegExp("(/_input/([a-zA-Z0-9\-\_]*))?(/_output/([a-zA-Z0-9\-\_]*))?$");
class Worker extends EE{
  constructor(path, parent){
    super();
    this.path = path + "(/_input/([a-zA-Z0-9\-\_]*))?(/_output/([a-zA-Z0-9\-\_]*))?";
    this.pathRegExp = new RegExp("^" + this.path);
    this.parent = parent;
    this.on("work", (req) => {
      this._work(req);
    });
    this.on("post-work", (req) => {
      this.postWork(req);
    });
    this.on("return-to-application-manager", (req) => {
      this.returnToApplication(req);
    });
    this.on("get-path", (handler) => {
      handler(this.path);
    })
  }

  _work(req){
    try{
      var curPath = req.paths[req.currentIdx];
      var match = inOutRegex.exec(curPath);
      var inp = match[2];
      var out = match[4];

      this.work(req, inp, out);
    } catch(err){
      req.status(err).next();
    }
  }

  work(){
    throw new Error("Not Implemented");
  }

  postWork(req){
    req.next();
  }

  saveToSession(req, data){
    return this.parent.saveToSessionStore(req.sessionKey,{$time:Date.now(), requestUuid:req.uuid, predecessorUuid: req.predecessorUuid, correlationId: req.correlationId, origination: req.origination}, data);
  }

  saveToGlobal(data){
    return this.parent.saveToGlobalStore(data);
  }

  getSessionData(req, search){
    return this.parent.getDataFromSessionStore(req.sessionKey, search);
  }

  getGlobalData(search){
    return this.parent.getDataFromGlobalStore(search);
  }

  returnToApplication(req){
    req.currentIdx++;
    this.parent.emit("send-to-application-manager",req.origination, req);
  }

}

module.exports = Worker;
