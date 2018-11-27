"use strict";

var bebop = require("node-bebop"),
    cv = require("opencv4nodejs");

var drone = bebop.createClient();
var mjpg = mjpg = drone.getMjpegStream();
var buf = null;

var mat = null;

drone.connect(function() {
    console.log('connected');
    drone.MediaStreaming.videoEnable(1);
//    mjpg.resume();
    console.log(mjpg);
    mjpg.on("data", function(data) {
        console.log('...');
        buf = data;
    });

    setInterval(function() {
        console.log(buf);
        
      if (buf == null) {
        return;
      }

        mat = cv.imread(buf);
        cv.imshow('video', mat);
        cv.waitKey(0);
    }, 500);

});