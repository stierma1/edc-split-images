"use strict"
var EE = require("events").EventEmitter;

class Application extends EE{
  constructor(config, parent){
    super();
    this.parent = parent;
    this.on("check-status", (req) => {
      this.checkStatus(req);
    });
    this.on("go-to-worker", (req) => {
      this.goToWorker(req);
    });
  }

  checkStatus(){
    throw new Error("Not Implemented");
  }

  goToWorker(req){
    req.depth++;
    this.parent.emit("send-to-worker", req.paths[req.currentIdx], req);
  }
}

module.exports = Application;
