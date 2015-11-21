"use strict"
var ApplicationManager = require("../../application-manager");

class BasicManager extends ApplicationManager{
  constructor(parent){
    super({}, parent);
  }

  checkStatus(req){
    if(req.currentIdx >= req.paths.length){
      this.parent.emit("request-end", req);
    } else {
      req.next();
    }
  }
}

module.exports = BasicManager;
