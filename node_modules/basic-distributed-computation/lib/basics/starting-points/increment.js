"use strict"

var StartingPoint = require("../../starting-point");
var Request = require("../../request");

class IncrementStartingPoint extends StartingPoint {
  constructor(){
    super("increment");
    this.add(0, "increment/_input/hello/_output/goodbye");
    this.add(1, "increment/_output/goodbye");
    this.add(2, "wrap-in-array");
  }

  createRequest(payload){
    return super.createRequest(payload, Request);
  }
}

module.exports = new IncrementStartingPoint();
