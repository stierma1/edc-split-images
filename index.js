"use strict"

var Worker = require("basic-distributed-computation").Worker;
var VirtualFrame = require("virtual-frames-edc");
var SplitImagesSP = require("edc-start-split-images");

class SplitImages extends Worker {
  constructor(parent){
    super("create-image-frames", parent);
  }

  work(req, inputKey, outputKey){

    var inputVal = req.body;
    if(inputKey){
        inputVal = req.body[inputKey];
    }
    //Conquer
    if(inputVal.frames.length <= 16){
      Jimp.read(inputVal.image)
        .then((image) => {
          return Promise.all(inputVal.frames.map((frame) => {
            return (new VirtualFrame(frame.width, frame.height, frame.xOffset, frame.yOffset, frame.minX, frame.minY, frame.resize)).makeConcrete(image);
          }));
        })
        .then((images) => {
          if(outputKey){
            req.body[outputKey] = images;
          } else {
            req.body = images;
          }
          req.next();
        })
        .catch((err) => {
          req.status(err).next();
        })
    } else {
      //Divide
      var half = Math.floor(inputVal.frames.length/2);
      var split2 = [];
      for(var i = 0; i < half; i++){
        split2.push(inputVal.frames.pop());
      }
      split2 = split2.reverse();
      var split1 = inputVal.frames;

      var proms = [split1,split2].map((frames) => {
        var newReq = SplitImagesSP.branchRequest(req, {
          image:inputVal.image,
          frames:frames
        });
        return new Promise((resolve, reject) => {
          this.parent.emit("request-start", newReq, (err, reqArr) => {
            if(err){
              reject(err);
              return;
            }
            resolve(reqArr[1]);
          });
        });
      });

      //Wait for divide and conquer to finish
      Promise.all(proms)
        .then((frames) => {
          return frames[0].concat(frames[1]); //merge results
        })
        .then((frames) => {
          if(outputKey){
            req.body[outputKey] = frames;
          } else {
            req.body = frames;
          }

          req.next();
        })
        .catch((err) => {
          req.status(err).next();
        });
    }

  }
}

module.exports = CreateFrames;
