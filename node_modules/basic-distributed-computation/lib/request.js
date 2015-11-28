"use strict"
var uuid = require("uuid");

class Request{
  constructor(serialized, parent){
    var req = JSON.parse(serialized);
    this.uuid = uuid.v4();
    this.sessionKey = req.sessionKey || uuid.v4();
    this.predecessorUuid = req.predecessorUuid;
    this.origination = req.origination;
    this.correlationId = req.correlationId;
    this.depth = req.depth || 0;
    this.paths = req.paths;
    this.currentIdx = req.currentIdx || 0;
    this.headers = req.headers;
    this.body = req.body;
    this.parent =  parent;
    this.statusCode = req.statusCode || 0;
    this.chores = ["check-status", "go-to-worker", "work", "post-work", "return-to-application-manager"];
    this.choreIdx = req.choreIdx === undefined ? 0 : req.choreIdx;
  }

  status(statusCode){
    this.statusCode = statusCode;
    return this;
  }

  getCurrentPath(){
    return this.paths[this.currentIdx];
  }

  next(){
    this.choreIdx = (this.choreIdx + 1) % this.chores.length;
    this.parent.emit([this.chores[this.choreIdx]], this);
  }

  serialize(){
    var out = {};
    out.sessionKey = this.sessionKey;
    out.uuid = this.uuid;
    out.predecessorUuid = this.predecessorUuid;
    out.depth = this.depth;
    out.correlationId = this.correlationId;
    out.paths = this.paths;
    out.currentIdx = this.currentIdx || 0;
    out.headers = this.headers;
    out.body = this.body;
    out.parent =  null;
    out.statusCode = this.statusCode || 0;
    out.chores = this.chores;
    out.choreIdx = this.choreIdx;
    out.origination = this.origination;
    return JSON.stringify(out, null, 2);
  }
}

module.exports = Request;
