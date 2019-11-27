"use strict";

var keypress = require('keypress');
var maiden = false;
var bebop = require('node-bebop');

var drone = bebop.createClient();

drone.connect(function() {
    console.log('connected to eV!');
});

drone.on('battery', function(data){
    console.log('-----------------');
    console.log(`battery: ${data}`);
    console.log('-----------------');
});
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if(maiden){
        drone.stop();
    }
    else{
        maiden = true;
    }
    ///console.log('got "keypress"', key);
   /* if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
*/
    var name = key.name;
    switch(name){
        case 'p':
	    console.log('end the dpad key listening process');
	    drone.stop();
	    setTimeout(function(){
		drone.land();
		console.log('exit flight process.');
		console.log('landing bird...');
		process.stdin.pause();
	    }, 2000);
	case 'q':
            console.log('drone counter clockwise at 2');
            drone.counterClockwise(10);
            break;
        case 'e':
            console.log('drone clockwise at 2');
            drone.clockwise(10);
            break;
        case 'a':
            console.log('drone left at 2');
            drone.left(5);
            break;
        case 's':
            console.log('drone back at 2');
            drone.back(5);
            break;
        case 'w':
            console.log('drone forward at 2');
            drone.front(5);
            break;
        case 'd':
            console.log('drone right at 2');
            drone.right(5);
            break;
        case 't':
            console.log('take off');
            drone.takeoff();
            break;
        case 'l':
            console.log('land');
            drone.land();
            break;
        case 'space':
            console.log('stop moving.');
        default:
            console.log('no action; remaining still');
            drone.stop();
            break;
    }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
