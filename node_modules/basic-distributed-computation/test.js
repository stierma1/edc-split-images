
var Isolated = require("./lib/basics/environments/isolated");

var iso = new Isolated({
  id: "isolated",
  applicationList:[__dirname + "/lib/basics/application-managers/basic-manager"],
  workerList:[__dirname + "/lib/basics/workers/increment", __dirname + "/lib/basics/workers/wrap-in-array"]
});

var icrSP = require("./lib/basics/starting-points/increment");
for(var i = 0; i < 10000; i++){
  var req = icrSP.createRequest(i);
  iso.emit("request-start", req);
}
