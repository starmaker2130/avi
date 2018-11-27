"use strict";

var bebop = require("node-bebop");
var fs = require("fs");

var output = fs.createWriteStream("./video.h264");
var drone = bebop.createClient();
var video = drone.getVideoStream();

video.pipe(output);

drone.connect(function() {
    console.log('connected!')
    drone.MediaStreaming.videoEnable(1);
});