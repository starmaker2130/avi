"use strict";

var keypress = require('keypress');
var maiden = false;
var bebop = require('node-bebop');
var droneMovingSpeed = 5;
var droneTurningSpeed = 10;
var droneIsFlying = false;
var commandQueueIsEmpty = true;
var commandQueue = [];
var commandHistory = [];
var menuFocus = 0;
var name = '';

console.log(`booting up your ARrow...\n\n\n--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--      HOUSE OF VENUS BENEFIT CORPORATION      --`);
console.log(`--------------------------------------------------`);
console.log(`--      AR RECEIVER ORGANIZES WORLDSTREAMS      --`);
console.log(`--                   V. 0.2.0                   --`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);

/*setTimeout(function(){
    console.log(`--      PUBLIC AUGMENTED REALITY KINECTOME      --`);
    console.log(`--                   V. 0.7.0                   --`);
console.log(`--------------------------------------------------`);
}, 1000);*/

console.log(`--                 COMMAND MENU                 --`);
console.log(`--------------------------------------------------`);
console.log(`-- [PRESS Y] test keyboard                      --`);
console.log(`-- [PRESS U] connect to Old Row Maryland        --`);
console.log(`-- [PRESS I] etc.                               --`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);
console.log(`--------------------------------------------------`);

var drone;

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
    var settable = true;
    
    try{
        name = key.name;
    }
    catch(error){
        console.log(error);
        name = "NaK"
    }
    
    switch(name){
        case 'p':
            console.log('end the dpad key listening process...');
            //drone.stop();
            let laster = commandQueue.pop();
            if(laster!='exit'){
                commandQueue.push('exit');
            
                setTimeout(function(){
                    if(droneIsFlying){
                        //drone.land();
                        console.log('landing bird...');
                    }
                    console.log('exiting flight process...\ncomplete!\nexit std i/o listener.');
                    console.log(commandHistory);
                    process.stdin.pause();
                }, 2000);
            }
            else{
                commandQueue.push(laster);
            }
            break;
        case 'y':
            if(menuFocus==0){
                console.log('test keyboard  option selected.');
                menuFocus = 1;
                break;
            }
        case 'u':
            if(menuFocus==0){
                console.log('connecting to old row mary.land');
                menuFocus = 2;
                drone = bebop.createClient();

                drone.connect(function() {
                    console.log('connected to eV!');
                });

                drone.on('battery', function(data){
                    console.log('-----------------');
                    console.log(`battery: ${data}`);
                    console.log('-----------------');
                });
                break;
            }
        case 'i':
            if(menuFocus==0){
                console.log('etc. option selected.');
                menuFocus = 3;
                break;
            }
        case 'z':
            if(menuFocus==1||menuFocus==2){
                if(droneMovingSpeed>0){
                    droneMovingSpeed -= 5;
                    console.log(`drone moving speed decreased by 5 to ${droneMovingSpeed} % of max speed`);
                }
                else{
                    console.log(`drone moving speed already a minimum speed | ${droneMovingSpeed} %`);
                }
                break;
            }
        case 'c':
            if(menuFocus==1||menuFocus==2){
                if(droneMovingSpeed<100){
                    droneMovingSpeed += 5;
                    console.log(`drone moving speed increased by 5 to ${droneMovingSpeed} % of max speed`);
                }
                else{
                    console.log(`drone moving speed already a maximum speed | ${droneMovingSpeed} %`);
                }
                break;
            }
        case 'n':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone up at ${droneMovingSpeed}`);
                    //drone.counterClockwise(10);
                    commandQueue.push("up");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.up(droneMovingSpeed);
                    }
                   /* setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 'm':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone down at ${droneMovingSpeed}`);
                    //drone.counterClockwise(10);
                    commandQueue.push("down");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.down(droneMovingSpeed);
                    }
                   /* setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 'q':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone counter clockwise at ${droneTurningSpeed}`);
                    //drone.counterClockwise(10);
                    commandQueue.push("counterclockwise");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.counterClockwise(droneTurningSpeed);
                    }
                   /* setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 'e':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone clockwise at ${droneTurningSpeed}`);
                    //drone.clockwise(10);
                    commandQueue.push("clockwise");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.clockwise(droneTurningSpeed);
                    }
                    /*setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }   
                break;
            }
        case 'a':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone left at ${droneMovingSpeed}`);
                    //drone.left(5);
                    commandQueue.push("left");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.left(droneMovingSpeed);
                    }
                    /*setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 's':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone back at ${droneMovingSpeed}`);
                    //drone.back(5);
                    commandQueue.push("back");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.back(droneMovingSpeed);
                    }
                    /*setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 'w':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone forward at ${droneMovingSpeed}`);
                    //drone.front(5);
                    commandQueue.push("front");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.front(droneMovingSpeed);
                    }
                    /*setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 'd':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log(`drone right at ${droneMovingSpeed}`);
                    //drone.right(5);
                    commandQueue.push("right");
                    commandQueueIsEmpty = false;
                    
                    if(menuFocus==2){
                        drone.right(droneMovingSpeed);
                    }
                   /* setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                    }, 500);*/
                }
                else{
                    if(droneIsFlying){
                        let last = commandQueue.length-1;
                        let current = commandQueue[last];
                        console.log(` ${current} move in progress...`);
                    }
                    else{
                        console.log('bird is on the ground! \n please take off to initate movements.');
                    }
                }
                break;
            }
        case 't':
            if(menuFocus==1||menuFocus==2){
                if(!maiden){
                    maiden = true;
                }
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log('already in the air! \n takeoff sequence aborted. \n continuing flight...');
                }
                else {
                    console.log('take off sequence initated. \n commencing flight...');
                    
                    if(menuFocus==2){
                        drone.takeoff();
                    }
                    //drone.takeoff();
                    commandQueue.push("takeoff");
                    commandQueueIsEmpty = false;
                    setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);
                        droneIsFlying = true;
                        commandQueueIsEmpty = true;
                    }, 500);
                }
                break;
            }
        case 'l':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying&&commandQueueIsEmpty){
                    console.log('landing sequence initiated. \n ending flight...');
                    //drone.land();
                    commandQueue.push("land");
                    commandQueueIsEmpty = false;
                    setTimeout(function(){
                        let lastMove = commandQueue.pop();
                        console.log(`${lastMove} command complete.`);   
                        droneIsFlying = false;
                        commandQueueIsEmpty = true;
                    }, 500);
                }
                else{
                    console.log('not in the air! \n landing sequence aborted.');
                }
                break;
            }
        case 'space':
            if(menuFocus==1||menuFocus==2){
                if(droneIsFlying){
                    commandQueue.push("stop");
                    console.log('stop initiated...');
                    //drone.stop();
                    commandQueueIsEmpty = false;
                    setTimeout(function(){
                        let stopMove = commandQueue.pop();
                        let lastMove = commandQueue.pop();

                        commandQueueIsEmpty = true;
                        commandHistory.push(lastMove);
                        console.log(`${stopMove}ped moving. \n${lastMove} command complete.`);
                    }, 500);
                }
                else{
                    console.log('bird is on the ground! \n please take off to initate movements.');
                }
                break;
            }
        default:
            //drone.stop();
            if(menuFocus==0){
                console.log('refer to command menu for available options | press P to exit');
            }
            else if(menuFocus==1){
                console.log('acion not regisered to a flight command | refer to keyboard controls map');
            }
            else if(menuFocus==2){
                console.log('acion not regisered to a flight command | refer to keyboard controls map');
            }
            else if(menuFocus==3){
                console.log('etc...');
            }
            else{
                console.log('no action associated with this default');
            }
            break;
    }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
