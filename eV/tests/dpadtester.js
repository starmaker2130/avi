"use strict";

var keypress = require('keypress');
var maiden = false;
var bebop = require('node-bebop');
var droneMovingSpeed = 5;
var droneTurningSpeed = 10;
var droneIsFlying = false;
var commandQueueIsEmpty = true;

/*var drone = bebop.createClient();

drone.connect(function() {
    console.log('connected to eV!');
});

drone.on('battery', function(data){
    console.log('-----------------');
    console.log(`battery: ${data}`);
    console.log('-----------------');
});
*/

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    
    
    ///console.log('got "keypress"', key);
   /* if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
*/
    
    var name = key.name;
    switch(name){
        case 'p':
            console.log('end the dpad key listening process');
            //drone.stop();
            setTimeout(function(){
                //drone.land();
                console.log('exit flight process.');
                console.log('landing bird...');
                process.stdin.pause();
            }, 2000);
        case 'q':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone counter clockwise at ${droneTurningSpeed}`);
                //drone.counterClockwise(10);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 'e':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone clockwise at ${droneTurningSpeed}`);
                //drone.clockwise(10);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 'a':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone left at ${droneMovingSpeed}`);
                //drone.left(5);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 's':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone back at ${droneMovingSpeed}`);
                //drone.back(5);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 'w':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone forward at ${droneMovingSpeed}`);
                //drone.front(5);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 'd':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log(`drone right at ${droneMovingSpeed}`);
                //drone.right(5);
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
            break;
        case 't':
            if(!maiden){
                maiden = true;
            }
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log('already in the air! \n takeoff sequence aborted. \n continuing flight...');
            }
            else {
                console.log('take off sequence initated. \n commencing flight...');
                //drone.takeoff();
                droneIsFlying = true;
            }
            break;
        case 'l':
            if(droneIsFlying&&commandQueueIsEmpty){
                console.log('landing sequence initiated. \n ending flight...');
                //drone.land();
                droneIsFlying = false;
            }
            else{
                console.log('not in the air! \n landing sequence aborted.');
            }
            break;
        case 'space':
            if(droneIsFlying){
                console.log('stop moving.');
            }
            else{
                console.log('bird is on the ground! \n please take off to initate movements.');
            }
        default:
            console.log('no action; remaining still');
            //drone.stop();
            break;
    }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
