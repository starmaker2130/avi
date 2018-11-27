"use strict";

var bebop = require('node-bebop');

var drone = bebop.createClient();

drone.connect(function() {
    console.log('connected to eV!');
});

drone.on('battery', function(data){
    console.log(`battery: ${data}`);
});