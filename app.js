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

var dir = config.DIRECTORY;

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('/'));

var deviceType = 'unknown';

app.get('/', function(req, res){
    if(deviceType=='unknown'){
        var result = new WhichBrowser(req.headers);
        console.log(result.toString());

        if(result.isType('desktop')){
            console.log('This is a desktop computer. \n User is most likely streaming firectly from eV quARk.');
            deviceType = 'desktop';
        }
        else{
            console.log('This is a mobile device. \n User is most likely connecting her remote.');
            deviceType = 'mobile';
        }
    }
    
    res.render('snackshack.html',{root: dir[0]});
});

app.get('/remote', function(req, res){
    if(deviceType=='unknown'){
        var result = new WhichBrowser(req.headers);
        console.log(result.toString());

        if(result.isType('desktop')){
            console.log('This is a desktop computer. \n User is most likely streaming firectly from eV quARk.');
            deviceType = 'desktop';
        }
        else{
            console.log('This is a mobile device. \n User is most likely connecting her remote.');
            deviceType = 'mobile';
        }
    }
    
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

var scenes = [];

var guests = [
    
];

io.sockets.on('connection', function(socket){
    console.log('client connected.');
    var conn = socket;
    
    socket.on('checkDeviceType', function(data){
        socket.emit('loadDeviceType', {type: deviceType});
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
        var direction = data.direction;
        console.log(direction);
    });

    socket.on('disconnect', function(){
        console.log(`socket ${socket.id} disconnected.`);
    });
});