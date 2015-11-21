"use strict"

class StartingPoint {
  constructor(id, config){
    this._config = config;
    this.id = id;
    this.rules = [];
  }

  get(funcId){
    if(funcId){
      return this.rules[funcId];
    }
    return this.rules;
  }

  add(idx, rule){
    this.rules.splice(idx, 0, rule)
    return this;
  }

  addBefore(ruleId, rule, addAtEnd){
    for(var idx in this.rules){
      if(this.rules[idx].id === ruleId){
        break;
      }
    }
    if(!!this.rules[idx] || addAtEnd){
      this.add(idx, rule);
    } else {
      throw new Error("Rule " + ruleId + " was not found and add to end of array was not set");
    }

    return this;
  }

  addAfter(ruleId, rule, addAtEnd){
    for(var idx in this.rules){
      if(this.rules[idx].id === ruleId){
        break;
      }
    }
    if(!!this.rules[idx]){
      this.add(idx + 1, rule);
    } else if(addAtEnd){
      this.add(idx, rule)
    } else {
      throw new Error("Rule " + ruleId + " was not found and add to end of array was not set");
    }

    return this;
  }

  createRequest(body, requestCon){
    return new requestCon(JSON.stringify({origination: this.id, paths:this.rules, body:body}));
  }

  branchRequest(parentRequest, body, requestCon){
    var newReq = this.createRequest(body, requestCon);
    newReq.depth = parentRequest.depth;
    newReq.predecessorUuid = parentRequest.uuid;
    return newReq;
  }
}

module.exports = StartingPoint;
