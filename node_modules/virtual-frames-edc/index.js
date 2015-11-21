"use strict"
var Jimp = require("jimp");

class VirtualFrame {
  constructor(maxX, maxY, xOffset, yOffset, width, height, minX, minY, resize){
    this.maxX = maxX;
    this.maxY = maxY;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.width = width;
    this.height = height;
    this.minX = minX;
    this.minY = minY;
    this.resize = resize;
  }

  shiftX(shiftDistance){
    if(this.maxX > this.xOffset + this.width + shiftDistance){
      return new VirtualFrame(this.maxX, this.maxY, this.xOffset + shiftDistance, this.yOffset, this.width, this.height, this.minX, this.minY, this.resize);
    } else {
      return null;
    }
  }

  shiftY(shiftDistance){
    if(this.maxY > this.yOffset + this.height + shiftDistance){
      return new VirtualFrame(this.maxX, this.maxY, this.xOffset, this.yOffset + shiftDistance, this.width, this.height, this.minX, this.minY, this.resize);
    } else {
      return null;
    }
  }

  scale(factor){
    if(this.maxY > this.yOffset + this.height*factor && this.maxX > this.xOffset + this.width*factor){
      return new VirtualFrame(this.maxX, this.maxY, this.xOffset, this.yOffset, Math.floor(this.width * factor), Math.floor(this.height * factor), this.minX, this.minY, this.resize);
    } else {
      return null;
    }
  }

  makeConcrete(image){
    return new Promise( (resolve, reject) => {
      var img = image.crop(this.xOffset, this.yOffset, this.width, this.height)
      if(this.resize){
        img = img.resize(this.minX, this.minY)
      }
        img.quality(75)
        .getBuffer(Jimp.MIME_JPEG, (err, buff) => {
          resolve({
            image:buff,
            frameData: this
          });
        });
    });
  }
}

module.exports = VirtualFrame;
