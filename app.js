// author(s):  Patrice-Morgan Ongoly
// version: 0.2.2
// last modified: Monday, July 2, 2018 12:32 EST
// description: 

// required modules
var bodyParser = require('body-parser');
var express = require('express');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var WhichBrowser = require('which-browser');
// main application instance

var app = express();

// main application settings

var config = {
    PORT: process.env.PORT || 8008,
    DIRECTORY: [
        './',  //0
        './css',  //1
        './js', //2
        './media/texture', //3
        './media/gifs', //4
        './media/pattern', //5
        './media/img', //6 
        './media/sounds', //7
        './media/model', //8
        './media/content/films', //9
        './media/icons', //10
        './uploads', //11
        './drafts/docs', //12
        './media/upload', //13
        './media/room', //14
        './media/img/bg', //15
        './media/room/media/model' //16
    ]
};

var scenes = [];
var guests = [];

var systemLogic = {
    remoteConnected: false,
    remoteList: [],
    mainScreenConnected: false,
    mainScreen: null,
    remoteActionVisibleOnMainScreen: false,
    pos: {
        x: 0,
        y: 0
    }
};

var remotePageMatrix = [
    [null, null, null, null], 
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

var dir = config.DIRECTORY;

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('/'));

var deviceType = 'unknown';

function checkInitialDeviceConnectionType(headers, ip){
    var result = new WhichBrowser(headers);
    console.log(result.toString());

    if(result.isType('desktop')){
        console.log('This is a desktop computer. \n User is most likely streaming firectly from eV quARk.');
        deviceType = 'desktop';
        
        console.log(`remote connected? ${systemLogic.remoteConnected}`);
        console.log(systemLogic.remoteList);
    }
    else{
        console.log('This is a mobile device. \n User is most likely connecting her remote.');
        deviceType = 'mobile';
        console.log(remotePageMatrix);
    }
}
app.get('/', function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var headers = req.headers;
    checkInitialDeviceConnectionType(headers, ip);
    
    res.render('snackshack.html',{root: dir[0]});
});

app.get('/remote', function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var headers = req.headers;
    checkInitialDeviceConnectionType(headers, ip);
    
    res.render('remote.html',{root: dir[0]});
});

app.get('/css/house_remote.css', function(req, res){
    res.sendFile('house_remote.css', {root: dir[1]});
});

app.get('/css/pARk.css', function(req, res){
    res.sendFile('pARk.css', {root: dir[1]});
});

app.get('/js/:script_id', function(req, res){
    var script_id = req.params.script_id;
    res.sendFile(script_id, {root: dir[2]});
});

app.get('/media/texture/:texture_id', function(req, res){
    var texture_id = req.params.texture_id;
    res.sendFile(texture_id, {root: dir[3]});
});

app.get('/media/gifs/:gif_id', function(req, res){
    var gif_id = req.params.gif_id;
    res.sendFile(gif_id, {root: dir[4]});
});

app.get('/media/pattern/:pattern_id', function(req, res){
    var pattern_id = req.params.pattern_id;
    res.sendFile(pattern_id+'.patt', {root: dir[5]});
});

app.get('/media/img/:img_id', function(req, res){
    var img_id = req.params.img_id;
    res.sendFile(img_id, {root: dir[6]});
});

app.get('/media/sounds/:sound_id', function(req, res){
    var sound_id = req.params.sound_id;
    res.sendFile(sound_id, {root: dir[7]});
});

app.get('/media/model/:model_id', function(req, res){
    var model_id = req.params.model_id;
    res.sendFile(model_id, {root: dir[8]});
});

app.get('/media/content/films/:film_id', function(req, res){
    var film_id = req.params.film_id;
    console.log(film_id);
    res.sendFile(film_id, {root: dir[9]});
});

app.get('/media/icons/:icon_id', function(req, res){
    var icon_id = req.params.icon_id;
    res.sendFile(icon_id, {root: dir[10]});
});

app.get('/media/card/:card_id', function(req, res){
    var card_id = req.params.card_id;
    res.sendFile(card_id+'.html', {root: dir[12]});
});

app.get('/media/room/media/model/:room_model_id', function(req, res){
    var room_model_id = req.params.room_model_id;
    res.sendFile(room_model_id, {root: dir[14]});
});

app.get('/media/img/bg/:img_id', function(req, res){
    var img_id = req.params.img_id;
    res.sendFile(img_id, {root: dir[13]});
});

var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));

io.sockets.on('connection', function(socket){
    console.log('client connected.');
    var conn = socket;
    
    socket.on('connectRemote', function(data){
        var ip = socket.handshake.address;
        console.log('new connection from ' + ip.address + ':' + ip.port);
        //console.log('new connection connects');
        systemLogic.remoteConnected = data.status;
        systemLogic.remoteList.push({type: 'mobile' , address: ip, connection: socket});
        console.log(`remote connected? ${systemLogic.remoteConnected}`);
        console.log(systemLogic.remoteList);
        console.log(`main screen connected? ${systemLogic.mainScreenConnected}`);
        socket.emit('confirmRemoteConnection', {status: true});
    });
    
    socket.on('connectMainScreen', function(data){
        var ip = socket.handshake.address;
        systemLogic.mainScreenConnected = true;
        systemLogic.mainScreen = {type: 'desktop' , address: ip, connection: socket};
    });
    
    socket.on('identify', function(data){
        console.log('configuring id...');
        var remote = data;
        var user  = {
            manufacturer: remote.manufacturer,
            author: remote.author,
            source: remote.source,
            socket: conn,
            id: guests.length
        };
        guests.push(user);
        console.log('remote registered.');
        console.log(`connection ${user.socket.id} established b/w remote ${user.source.tapin} and ${user.source.product} ${user.source.device}`);
    });
    
    socket.on('launchSAT', function(data){
        var status = data.status;
        console.log('request to launch show and tell...');
        console.log(status);
    });
    
    socket.on('loadcARd', function(data){
        var status = data.status;
        var id = data.id;
        console.log('request to load cARd...');
        console.log(`status: ${status} | id: ${id}`);
    });
    
    socket.on('toggleARMode', function(data){
        var status = data.status;
        var currentMode = data.currentMode;
        console.log('request to toggle AR mode...');
        
        var targetMode = 'flat';
        if(currentMode=='flat'){
            targetMode = 'ar'
        }
        
        console.log(`status: ${status} | current mode: ${currentMode} | target mode: ${targetMode}`);
    });
    
    socket.on('openAvionicsConsole', function(data){
        var status = data.status;
        console.log(status);
        console.log('request to open avionics console...');
        console.log(`status: ${status}`);
    });
    
    socket.on('dpadEvent', function(data){
       // console.log('remotes acting');
        //console.log('-------------------------------------');
        //console.log(systemLogic.remoteList);//ush({type: 'mobile' , address: ip, connection: socket});
        var direction = data.direction;
        remotePageMatrix[systemLogic.pos.y][systemLogic.pos.x]= 0;
        switch(direction){
            case 'up':
                if(systemLogic.pos.y>0){
                    systemLogic.pos.y--;
                }
                break;
            case 'down':
                if(systemLogic.pos.y<3){
                    systemLogic.pos.y++;
                }
                break;
            case 'left':
                if(systemLogic.pos.x>0){
                    systemLogic.pos.x--;
                }
                break;
            case 'right':
                if(systemLogic.pos.x<3){
                    systemLogic.pos.x++;
                }
                break;
            default:
                break;
        }
        remotePageMatrix[systemLogic.pos.y][systemLogic.pos.x] = 1;
        console.log(`direction pressed: ${direction}`);
        /*//console.log(remotePageMatrix);
        console.log('-------------------------------------');
        console.log('screens affected');
        console.log('-------------------------------------');
        console.log(systemLogic.mainScreen);*/
        systemLogic.mainScreen.connection.emit('mainScreenPageChange', {matrix: remotePageMatrix, position: systemLogic.pos});
        
    });
    
    socket.on('recordSuccessfulRemoteToScreenInteraction', function(data){
        systemLogic.remoteActionVisibleOnMainScreen == data.status;
    });
    
    socket.on('disconnect', function(){
        console.log(`socket ${socket.id} disconnected.`);
    });
});