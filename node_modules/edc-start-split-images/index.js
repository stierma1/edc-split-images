"use strict"

var StartingPoint = require("basic-distributed-computation").StartingPoint;
var Request = require("basic-distributed-computation").Request;
var uuid = require("uuid");

class SplitImage extends StartingPoint {
  constructor(){
    super("split-image");
    this.add(0, "bufferize-image");
    this.add(1, "split-images");
  }

  createRequest(payload){
    var req = super.createRequest(payload, Request);
    req.correlationId = uuid.v4();
    return req;
  }

  branchRequest(oldReq, payload){
    var req = super.branchRequest(oldReq, payload, Request);
    req.correlationId = uuid.v4();
    return req;
  }
}

module.exports = new SplitImage();
