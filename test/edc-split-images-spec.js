"use strict"
var SplitImages = require("../index");
var fs = require("fs");
var path = require("path");
var image = new Buffer(fs.readFileSync(path.join(__dirname, "JPEG-example.jpg")));

describe("edc-split-images", function(){
  it("should create image", function(done){
    var si = new SplitImages({});
    si.parent = {
      saveToSessionStore: () =>{
        return Promise.resolve();
      }
    }
    var fail = null;
    var req = {
      next: function(){
        if(fail){
          done(fail);
          return;
        }
        fs.writeFileSync(path.join(__dirname, "test.jpg"),req.body[0].image);
        done();
      },
      status: function(err){
        fail = err;
        return req;
      },
      body: {
        image:image,
        frames:[
          {
            minX:64,
            minY:64,
            xOffset:0,
            yOffset:0,
            height:200,
            width:200,
            maxX:300,
            maxY:300,
            resize:false
          }
        ]
      }
    }

    si.work(req);
  });

  it("should create resized image", function(done){
    var si = new SplitImages({});
    si.parent = {
      saveToSessionStore: () =>{
        return Promise.resolve();
      }
    }
    var fail = null;
    var req = {
      next: function(){
        if(fail){
          done(fail);
          return;
        }
        fs.writeFileSync(path.join(__dirname, "test1.jpg"),req.body[0].image);
        done();
      },
      status: function(err){
        fail = err;
        return req;
      },
      body: {
        image:image,
        frames:[
          {
            minX:64,
            minY:64,
            xOffset:100,
            yOffset:100,
            height:200,
            width:200,
            maxX:300,
            maxY:300,
            resize:true
          }
        ]
      }
    }

    si.work(req);
  });

  it("should handle multiple create resized image", function(done){
    var si = new SplitImages({});
    si.parent = {
      saveToSessionStore: () =>{
        return Promise.resolve();
      }
    }
    var fail = null;
    var req = {
      next: function(){
        if(fail){
          done(fail);
          return;
        }
        fs.writeFileSync(path.join(__dirname, "test1.jpg"),req.body[0].image);
        done();
      },
      status: function(err){
        fail = err;
        return req;
      },
      body: {
        image:image,
        frames:[
          {
            minX:64,
            minY:64,
            xOffset:100,
            yOffset:100,
            height:200,
            width:200,
            maxX:300,
            maxY:300,
            resize:true
          },
          {
            minX:64,
            minY:64,
            xOffset:100,
            yOffset:100,
            height:200,
            width:200,
            maxX:300,
            maxY:300,
            resize:true
          },
          {
            "maxX":1280,
            "maxY":720,
            "xOffset":0,
            "yOffset":600,
            "width":32,
            "height":32,
            "minX":32,
            "minY":32,
            "resize":false}
        ]
      }
    }

    si.work(req);
  });

})
