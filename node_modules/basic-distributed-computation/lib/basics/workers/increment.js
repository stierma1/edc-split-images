"use strict"

var Worker = require("../../worker");

class IncrementWorker extends Worker {
  constructor(parent){
    super("increment", parent);
  }

  work(req) {
    req.body = req.body + 1;
    req.next();
  }
}

module.exports = IncrementWorker;
