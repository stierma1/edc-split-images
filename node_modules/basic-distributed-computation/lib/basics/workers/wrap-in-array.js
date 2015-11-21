"use strict"

var Worker = require("../../worker");

class WrapInArrayWorker extends Worker {
  constructor(parent){
    super("wrap-in-array", parent);
  }

  work(req) {
    req.body = [req.body];
    req.next();
  }
}

module.exports = WrapInArrayWorker;
