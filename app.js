"use strict";
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

var keypress = require('keypress');
var maiden = false;
var bebop = require('node-bebop');
/*var bebop = require('node-bebop');
var drone = bebop.createClient();*/

// main application settings

var config = {
    PORT: 8008, //process.env.PORT ||
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
    },
    level: 0,
    pageData: {
        home: {
            name: 'home',
            maxLevel: {x: 3, y: 2},
            actionMatrix: [
                [
                    '#logo',
                    '#order-option',
                    '#catalog-option',
                    '#contact-option'
                ],
                [
                    '#cash-icon',
                    '#internet-icon',
                    '#snacks-icon',
                    '#rides-icon'
                ],
                [
                    '#footer',
                    '#footer',
                    '#footer',
                    '#footer'
                ]
            ]
        },
        order: {
            name: 'order',
            maxLevel: {x: 3, y: 4},
            actionMatrix: [
                [
                    '#logo',
                    '#order-option',
                    '#catalog-option',
                    '#contact-option'
                ],
                [
                    '#snacks-option',
                    '#snacks-option',
                    '#snacks-option',
                    '#snacks-option',
                ],
                [
                    '#connect-option',
                    '#connect-option',
                    '#connect-option',
                    '#connect-option',
                ],
                [
                    '#rides-option',
                    '#rides-option',
                    '#rides-option',
                    '#rides-option',
                ],
                [
                    '#withdraw-option',
                    '#withdraw-option',
                    '#withdraw-option',
                    '#withdraw-option',
                ],
                [
                    '#footer',
                    '#footer',
                    '#footer',
                    '#footer'
                ]
            ]
        },
        catalog: {
            name: 'catalog',
            maxLevel: {x: 3, y: 5},
            actionMatrix: [
                [
                    '#logo',
                    '#order-option',
                    '#catalog-option',
                    '#contact-option'
                ],
                [
                    '#news-icon',
                    '#cinema-icon',
                    '#tube-icon',
                    '#culture-icon'
                ],
                [
                    '#footer',
                    '#footer',
                    '#footer',
                    '#footer'
                ]
            ],
            actionMatrix2: [
                [
                    '#logo',
                    '#order-option',
                    '#catalog-option',
                    '#contact-option'
                ],
                [
                    '#media-content-preview-0',
                    '#media-content-preview-1',
                    '#media-content-preview-2',
                    '#media-content-preview-2',
                ],
                [
                    '#media-content-preview-3',
                    '#media-content-preview-4',
                    '#media-content-preview-5',
                    '#media-content-preview-5',
                ],
                [
                    '#media-content-preview-6',
                    '#media-content-preview-7',
                    '#media-content-preview-8',
                    '#media-content-preview-8',
                ],
                [
                    '#footer',
                    '#footer',
                    '#footer',
                    '#footer'
                ]
            ]
        },
        contact: {
            name: 'contact',
            maxLevel: {x: 3, y: 2},
            actionMatrix: [
                [
                    '#logo',
                    '#order-option',
                    '#catalog-option',
                    '#contact-option'
                ],
                [
                    '#ceo-profile-image',
                    '#sponsor-profile-image',
                    '#ceo-profile-image',
                    '#sponsor-profile-image'
                ],
                [
                    '#footer',
                    '#footer',
                    '#footer',
                    '#footer'
                ]
            ]
        }
    },
    drone: null,
    maiden: null,
    droneStatus: {
        isFlying: false,
        isLanded: true,
        lastKnownBatteryCharge: null
    }
};

var remotePageMatrix = [
    [null, null, null, null], 
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
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

function broadcast(i, remote){
    var target = remote;
    var id = i;
    console.log(`broadcast page ${target} to remote ${id}`);
    systemLogic.remoteList[id].connection.emit('loadNewPageData', {pageData: systemLogic.pageData[target]});
}

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



function compileObjectMarkup(item, markup){ //, experienceBuilder
    var objectMarkup = markup;
    var i = item;
    var colorArr = [
        'yellow',
        'green',
        'blue',
        'red',
        'purples',
        'orange'
    ];
    
    var objectOrigin = objectsInSceneHandler.points[i];

    var filter = {
        x: objectOrigin.x/100,
        y: objectOrigin.y/100,
        z: 0
    };
    
    var defaultModelMarkup = `<a-entity obj-model="obj: url(media/model/eiffel-tower.obj); mtl: url(media/model/eiffel-tower.mtl)" scale="0.05 0.05 0.05" position="${filter.x} ${filter.y} ${filter.z}"></a-entity>`;
    
    var objectName = objectsInSceneHandler.objectList[i].type;
    
    var objectGeometryLib = {
        'sphere': `<a-sphere color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}" radius="1"></a-sphere>`,
        'tetra': `<a-tetrahedron color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}" radius="1"></a-tetrahedron>`,
        'cube': `<a-box color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}"  depth="1" height="1" width="1"></a-box>`,
        'model': null
    };
    
    if(objectName=='model'){
        var modelSource = objectsInSceneHandler.objectList[i].src;
        var modelScale = objectsInSceneHandler.objectList[i].scale;
        
        defaultModelMarkup = `<a-entity obj-model="obj: url(${modelSource});" scale="${modelScale}" color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}"></a-entity>`;
        
        console.log(`adding model located at ${modelSource} with scale ${modelScale}`);
    }
    
    objectGeometryLib.model = defaultModelMarkup;
    
    objectMarkup += objectGeometryLib[objectName];
    return objectMarkup;
}

function buildUserARExperience(){   //experienceBuilder
    //var builder = experienceBuilder;
    //console.log('TODO: build user ar experience');
    var objectMarkup = '';
    
    for(var i=0; i<objectsInSceneHandler.points.length; i++){
        objectMarkup = compileObjectMarkup(i, objectMarkup);    //, builder
    }
    
    
    var markup = objectMarkup+`
            <!--<a-entity id='floor'
                      geometry='primitive: plane; width: 100; height: 100;'
                      material='src: #floor-texture; repeat: 100 100;'
                      position='0 0 0'
                      rotation='-90 0 0'>
            </a-entity>-->
            
            <a-entity position="3 1.5 5">
                <a-entity camera="active: true" look-controls wasd-controls></a-entity>
            </a-entity>

            <a-sky material='transparent: true; opacity: 0; color: white;'></a-sky>`
    
    // save markup into actual file
    /*fs.writeFile(dir[12]+'/temp.html', markup, function (err) {
        if (err) {
            return console.log('there is an error building the markup');
        }
 
        console.log('the markup file was saved');
    });*/
    //write the file after the experience name is approved
    
    return markup;
}

var objectsInSceneHandler = {
    points: [],
    adding: false,
    saveLastVertex: false,
    gestureInterval: null,
    starter: null,
    webcam: null,
    objectList: [],
    build: {
        markup: ''
    }
};

function landmarkTrackingTest(source){
    var channel = source;
    console.log('launch landmark orientation handling function');
    console.log(channel.id);
    gestureTrackingTest(channel, 0, 100);
}

function gestureTrackingTest(source, target, renderRate){
    
    var delayInterval = renderRate;
    var objectTarget = target;
    var socket = source;
    
    console.log('TODO: add gesture tracking test');
    
    const cv = require('opencv4nodejs');
    
    const skinColorUpper = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255);
    const skinColorLower = hue => new cv.Vec(hue, 0.1 * 255, 0.05 * 255);
    
    const devicePort = 0;
    
    objectsInSceneHandler.webcam = new cv.VideoCapture(devicePort);
    const wCap = objectsInSceneHandler.webcam;
    
    
    const makeHandMask = function(img){
      // filter by skin color
        const imgHLS = img.cvtColor(cv.COLOR_BGR2HLS);
        const rangeMask = imgHLS.inRange(skinColorLower(0), skinColorUpper(15));

      // remove noise
        const blurred = rangeMask.blur(new cv.Size(10, 10));
        const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

        return thresholded;
    };
    
    const getHandContour = function(handMask){
        const contours = handMask.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      // largest contour
        return contours.sort((c0, c1) => c1.area - c0.area)[0];
    };
    
    const getRoughHull = function(contour, maxDist) {
  // get hull indices and hull points
        const hullIndices = contour.convexHullIndices();
        const contourPoints = contour.getPoints();
        const hullPointsWithIdx = hullIndices.map(idx => ({
            pt: contourPoints[idx],
            contourIdx: idx
        }));
  
        const hullPoints = hullPointsWithIdx.map(ptWithIdx => ptWithIdx.pt);

  // group all points in local neighborhood
  
        const ptsBelongToSameCluster = (pt1, pt2) => ptDist(pt1, pt2) < maxDist;
        const { labels } = cv.partition(hullPoints, ptsBelongToSameCluster);
        const pointsByLabel = new Map();
        labels.forEach(l => pointsByLabel.set(l, []));
  
        hullPointsWithIdx.forEach((ptWithIdx, i) => {
            const label = labels[i];
            pointsByLabel.get(label).push(ptWithIdx);
        });

  // map points in local neighborhood to most central point

        const getMostCentralPoint = function(pointGroup) {
        // find center
            const center = getCenterPt(pointGroup.map(ptWithIdx => ptWithIdx.pt));
        // sort ascending by distance to center
            return pointGroup.sort((ptWithIdx1, ptWithIdx2) => ptDist(ptWithIdx1.pt, center) - ptDist(ptWithIdx2.pt, center))[0];
        };
        const pointGroups = Array.from(pointsByLabel.values());
      // return contour indices of most central points
        return pointGroups.map(getMostCentralPoint).map(ptWithIdx => ptWithIdx.contourIdx);
    };
    
    const getHullDefectVertices = function(handContour, hullIndices) {
        const defects = handContour.convexityDefects(hullIndices);
        const handContourPoints = handContour.getPoints();

      // get neighbor defect points of each hull point
        const hullPointDefectNeighbors = new Map(hullIndices.map(idx => [idx, []]));
        defects.forEach((defect) => {
            const startPointIdx = defect.at(0);
            const endPointIdx = defect.at(1);
            const defectPointIdx = defect.at(2);
            hullPointDefectNeighbors.get(startPointIdx).push(defectPointIdx);
            hullPointDefectNeighbors.get(endPointIdx).push(defectPointIdx);
        });

        return Array.from(hullPointDefectNeighbors.keys())
        // only consider hull points that have 2 neighbor defects
        .filter(hullIndex => hullPointDefectNeighbors.get(hullIndex).length > 1)
        // return vertex points
        .map((hullIndex) => {
            const defectNeighborsIdx = hullPointDefectNeighbors.get(hullIndex);
            return ({
                pt: handContourPoints[hullIndex],
                d1: handContourPoints[defectNeighborsIdx[0]],
                d2: handContourPoints[defectNeighborsIdx[1]]
            });
        });
    };
    
    const filterVerticesByAngle = function(vertices, maxAngleDeg){
        vertices.filter(function(v) {
            const sq = x => x * x;
            const a = v.d1.sub(v.d2).norm();
            const b = v.pt.sub(v.d1).norm();
            const c = v.pt.sub(v.d2).norm();
            const angleDeg = Math.acos(((sq(b) + sq(c)) - sq(a)) / (2 * b * c)) * (180 / Math.PI);
            return angleDeg < maxAngleDeg;
        });
        return vertices;
    }
    
            // returns distance of two points
    const ptDist = function(pt1, pt2){
        return pt1.sub(pt2).norm();  
    } 
    // returns center of all points
    const getCenterPt = pts => 
    pts.reduce((sum, pt) => sum.add(pt), new cv.Point(0, 0)).div(pts.length);
    const blue = new cv.Vec(255, 0, 0);
    const green = new cv.Vec(0, 255, 0);
    const red = new cv.Vec(0, 0, 255);
    
    const pointColor = new cv.Vec(255, 255, 255);
    
    objectsInSceneHandler.gestureInterval = setInterval(function(){
        wCap.readAsync(function(err, frame){
            if(frame.empty){
                wCap.reset();
            }
            frame = wCap.read();
                        // const { grabFrames } = require('./utils'); <-- investigate this function

            // main
            const resizedImg = frame.resizeToMax(640);

            const handMask = makeHandMask(resizedImg);
            const handContour = getHandContour(handMask);
            if (!handContour) {
                return;
            }

            const maxPointDist = 25;
            const hullIndices = getRoughHull(handContour, maxPointDist);

              // get defect points of hull to contour and return vertices
              // of each hull point to its defect points
            const vertices = getHullDefectVertices(handContour, hullIndices);

              // fingertip points are those which have a sharp angle to its defect points

            const maxAngleDeg = 60;
            
            const verticesWithValidAngle = filterVerticesByAngle(vertices, maxAngleDeg);
            
            //var drawThatCircle = false;
            //var vertext;

    
            const result = resizedImg.copy();
            const ballScene = resizedImg.copy();
              // draw bounding box and center line

            resizedImg.drawContours([handContour], pointColor, { thickness: 2 }); //previous version: blue
            
                        
          //  if(verticesWithValidAngle[0].d1!='undefined'){
            try{
                const xValue = verticesWithValidAngle[0].d1.x;
                const vertext = verticesWithValidAngle[0].d1;
                //console.log(xValue);   
                ballScene.drawCircle(vertext, 20, pointColor, -5);       // previous version: 50, blueblue
                
                if(objectsInSceneHandler.saveLastVertex){
                    objectsInSceneHandler.points.push(vertext);
                    objectsInSceneHandler.saveLastVertex = false;
                    
                    socket.emit('getCurrentObjectType', {index: objectsInSceneHandler.points.length});
                    
                    console.log('object position recorded.')
                    console.log(`there are currently ${objectsInSceneHandler.points.length} custom objects in this scene.`);
                }
            }catch(err){
                console.log(err);
            }
                
          //  }
              // draw points and vertices
            verticesWithValidAngle.forEach(function(v){
        
                // previous version: the section below was not commented out
                
            /*    resizedImg.drawLine( v.pt, v.d1, { color: green, thickness: 2 });
                resizedImg.drawLine(v.pt, v.d2, { color: green, thickness: 2 });*/
                resizedImg.drawEllipse(
                    new cv.RotatedRect(v.pt, new cv.Size(10, 10), 0), // previous version: cv.Size(20, 20, 0)
            
                    { color: red, thickness: 2 }
                );
                
                result.drawEllipse(
                    new cv.RotatedRect(v.pt, new cv.Size(10, 10), 0), // previous version: cv.Size(20, 20, 0)
                    { color: red, thickness: 2 }
                );
            });
            
            for(var i=0; i<objectsInSceneHandler.points.length; i++){
                resizedImg.drawCircle(objectsInSceneHandler.points[i], 25, green, -5);
                ballScene.drawCircle(objectsInSceneHandler.points[i], 25, red, -5);
            }
              // display detection result  
            const numFingersUp = verticesWithValidAngle.length-2;
    
            result.drawRectangle(
                new cv.Point(10, 10),
                new cv.Point(70, 70),
                { color: green, thickness: 2 }            
            );

            const fontScale = 2;
    
            result.putText(
                String(numFingersUp),
                new cv.Point(20, 60),
                cv.FONT_ITALIC,
                fontScale,
                { color: green, thickness: 2 }
            );

            
            const { rows, cols } = result;
            
            if(objectTarget==0){
                const sideBySide = new cv.Mat(rows, cols * 2, cv.CV_8UC3);
                ballScene.copyTo(sideBySide.getRegion(new cv.Rect(0, 0, cols, rows)));//result
                resizedImg.copyTo(sideBySide.getRegion(new cv.Rect(cols, 0, cols, rows)));


                //cv.imshow('handMask', handMask);
                cv.imshow('result', sideBySide); //sideBySide= a combination of result and resizedImg  result = circled finger tips only; resizedImg = vertex covered hand (green and blue lines, red circles)

                cv.waitKey(9); 
            }
            else if(objectTarget==1){
                if(objectsInSceneHandler.adding){
                    const matRGBA = ballScene.channels === 1
                      ? ballScene.cvtColor(cv.COLOR_GRAY2RGBA)
                      : ballScene.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                    socket.emit('paintCanvas', {buf: bufArray, rows: ballScene.rows, cols: ballScene.cols, type: 'hand'});  
                }
                else{
                    /* Hand mesh*/
                    const matRGBA = resizedImg.channels === 1
                      ? resizedImg.cvtColor(cv.COLOR_GRAY2RGBA)
                      : resizedImg.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                   // console.log(bufArray);

                    socket.emit('paintCanvas', {buf: bufArray, rows: resizedImg.rows, cols: resizedImg.cols, type: 'hand'});/**/    
                }                
            }
        });    
    }, delayInterval);    
}

function facialRecognitionTest(source, target, renderRate){
    
    var delayInterval = renderRate;
    var socket = source;
    var outputTarget = target;
    
    const cv = require('opencv4nodejs');

    const devicePort = 0;
    const wCap = new cv.VideoCapture(devicePort);

    socket.emit('captureResponse', {
        status: 0,
        health: 'good'
    });

    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    //var interval = setInterval(function(){
        //frame = wCap.read();
    objectsInSceneHandler.starter = setInterval(function(){
        wCap.readAsync(function(err, frame){
            if(frame.empty){
                wCap.reset();
            }
            frame = wCap.read();
            //cv.imshow('frame', res);
            //cv.imwrite('./media/capture/cap1.png', frame);
            const resizeFrame = frame.resizeToMax(640);
            const grayImg = resizeFrame.bgrToGray();

            classifier.detectMultiScaleAsync(grayImg, function(err, res){
                if (err) { return console.error(err); }

                const { objects, numDetections } = res;
              //  console.log(objects);
            //  console.log(numDetections);

                if (!objects.length) {
                    console.log('no face detected');
                    
                    return;
                }

                  // draw detection
                const facesImg = resizeFrame.copy();
                const numDetectionsTh = 10;
                objects.forEach(function(rect, i){
                    const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
                    const drawRect = facesImg.drawRectangle(rect, cv.Vec(255, 0, 0), 2, cv.LINE_8);
                    //drawBlueRect(facesImg, rect, { thickness });
                });
                
                if(outputTarget==0){
                   cv.imshow('frame', facesImg);
                }
                else if(outputTarget==1){
                    // convert your image to rgba color space
                    const matRGBA = facesImg.channels === 1
                      ? facesImg.cvtColor(cv.COLOR_GRAY2RGBA)
                      : facesImg.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                   // console.log(bufArray);

                    socket.emit('paintCanvas', {buf: bufArray, rows: facesImg.rows, cols: facesImg.cols, type: 'face'});   
                }
                else{
                    console.log('no specified output target for processing results');
                }
            });

            cv.waitKey(10);

        });
    }, delayInterval);
}

/////////// EXPRESS APP FUNCTIONS ////////
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

app.get('/postAR', function(req, res){
    res.render('postAR.html',{root: dir[0]});
});

app.get('/internet', function(req, res){
    res.render('landingpage.html',{root: dir[0]});
});

app.get('/pamo', function(req, res){
    res.render('pamo.html',{root: dir[0]});
});

app.get('/flybyvoice', function(req, res){
    res.render('flybyvoice.html',{root: dir[0]});
});

app.get('/eV', function(req, res){
    res.render('eV.html',{root: dir[0]});
});

app.get('/rooms/:room_id', function(req, res){
    var room = req.params.room_id
    console.log(`looking for room ${room}`);
    res.render(room,{root: dir[14]});
});

app.get('/css/house_remote.css', function(req, res){
    res.sendFile('house_remote.css', {root: dir[1]});
});

app.get('/css/pARk.css', function(req, res){
    res.sendFile('pARk.css', {root: dir[1]});
});

app.get('/css/rfid.css', function(req, res){
    res.sendFile('rfid.css', {root: dir[1]});
});

app.get('/css/card.css', function(req, res){
    res.sendFile('card.css', {root: dir[1]});
});

app.get('/css/avionics.css', function(req, res){
    res.sendFile('avionics.css', {root: dir[1]});
});

app.get('/css/postAR.css', function(req, res){
    res.sendFile('postAR.css', {root: dir[1]});
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
    res.sendFile(img_id, {root: dir[15]});
});

var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));

function levelChange(target){
    console.log('level changing!!!');
    systemLogic.level = target;
    var newMat = null;
    if(target==0){
        newMat = systemLogic.pageData.catalog.actionMatrix;
    }
    else if(target==1){
        newMat = systemLogic.pageData.catalog.actionMatrix2;
    }
    console.log(newMat);
    systemLogic.remoteList[0].connection.emit('loadNewPageLevel', {actionMatrix: newMat, level: target});
    systemLogic.mainScreen.connection.emit('loadNewPageLevel', {actionMatrix: newMat, level: target});
}

io.sockets.on('connection', function(socket){
    console.log('client connected.');
    var conn = socket;
    
    socket.on('levelChange', function(data){
        var target = data.target;
        levelChange(target);
    });
    
    socket.on('connectRemote', function(data){
        var ip = socket.handshake.address;
        console.log('new connection from ' + ip.address + ':' + ip.port);
        //console.log('new connection connects');
        systemLogic.remoteConnected = data.status;
        systemLogic.remoteList.push({type: 'mobile' , address: ip, connection: socket});
        console.log(`remote connected? ${systemLogic.remoteConnected}`);
        console.log('---------------------------------------');
        console.log(systemLogic.remoteList);
        console.log(`main screen connected? ${systemLogic.mainScreenConnected}`);
        console.log('---------------------------------------');
        socket.emit('confirmRemoteConnection', {status: true, onPage: systemLogic.pageData.home});
        systemLogic.mainScreen.connection.emit('showRemoteSelectionOverlay', {status: true});
    });
    
    socket.on('connectMainScreen', function(data){
        var ip = socket.handshake.address;
        systemLogic.mainScreenConnected = true;
        systemLogic.mainScreen = {type: 'desktop' , address: ip, connection: socket};
    });
    
    socket.on('connectEV', function(data){
        console.log('requesting remote connection to eV...')
        var ip = socket.handshake.address;
        if(systemLogic.mainScreenConnected==true){
            console.log('main screen open? \n yes...connected... \n proceed! \n -----------------');
            
            systemLogic.drone = bebop.createClient();
            
            console.log(systemLogic.drone);
            systemLogic.drone.connect(function() {
                console.log('connected to eV!');
            });

            systemLogic.drone.on('battery', function(data){
                console.log('-----------------');
                console.log(`battery: ${data}`);
                console.log('-----------------');
            });
            console.log('-----------------');
            systemLogic.remoteList[0].connection.emit('loadController', {status: true});
        }
    });
    
    socket.on('closeController', function(data){
        console.log('requesting return to main screen from avionics console...');
        var ip = socket.handshake.address;
        if(systemLogic.mainScreenConnected==true){
            console.log('closing controller and redirecting to main...');
            /*systemLogic.drone.connect(function() {
                console.log('connected to eV!');
            });

            systemLogic.drone.on('battery', function(data){
                console.log('-----------------');
                console.log(`battery: ${data}`);
                console.log('-----------------');
            });*/
        }
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
    
    socket.on('launchShowAndTell', function(data){
        var status = data.status;
        console.log('request to launch show and tell...');
        systemLogic.mainScreen.connection.emit('launchApplication', {status: 'showAndTell'});
        console.log(status);
    });
    
    socket.on('loadcARd', function(data){
        var status = data.status;
        var id = data.id;
        console.log('request to load cARd...');
        systemLogic.mainScreen.connection.emit('launchApplication', {status: 'cARd'});
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
        systemLogic.remoteList[0].connection.emit('launchApplication', {status: 'toggleARmode', value: targetMode});
        console.log(`status: ${status} | current mode: ${currentMode} | target mode: ${targetMode}`);
    });
    
    socket.on('openAvionicsConsole', function(data){
        var status = data.status;
        console.log(status);
        console.log('request to open avionics console...');
        systemLogic.mainScreen.connection.emit('launchApplication', {status: 'eV'});
        console.log(`status: ${status}`);
    });
    
    socket.on('dpadEvent', function(data){
        var selecting = false;
       // console.log('remotes acting');
        //console.log('-------------------------------------');
        //console.log(systemLogic.remoteList);//ush({type: 'mobile' , address: ip, connection: socket});
        var direction = data.direction;
        var max = data.maxLevel;
        var actionMatrix = data.actionMatrix;
        remotePageMatrix[systemLogic.pos.y][systemLogic.pos.x]= 0;
        switch(direction){
            case 'up':
                if(systemLogic.pos.y>0){
                    systemLogic.pos.y--;
                }
                break;
            case 'down':
                if(systemLogic.pos.y<max.y){
                    systemLogic.pos.y++;
                }
                break;
            case 'left':
                if(systemLogic.pos.x>0){
                    systemLogic.pos.x--;
                }
                break;
            case 'right':
                if(systemLogic.pos.x<max.x){
                    systemLogic.pos.x++;
                }
                break;
            case 'select':
                selecting = true;
                var targetAction = actionMatrix[systemLogic.pos.y][systemLogic.pos.x];
                console.log(`perform action ${targetAction}`);
                systemLogic.mainScreen.connection.emit('remoteActionRequest', {action: targetAction});
                if(targetAction=='#news-icon'||targetAction=='#cinema-icon'||targetAction=='#tube-icon'||targetAction=='#culture-icon'){
                    levelChange(1);
                }
                break;
            default:
                break;
        }
        remotePageMatrix[systemLogic.pos.y][systemLogic.pos.x] = 1;
        var targetAct = actionMatrix[systemLogic.pos.y][systemLogic.pos.x];
        
        console.log(`moved to ${targetAct}`);
        console.log(`direction pressed: ${direction}`);
        console.log(remotePageMatrix);
        console.log('-------------------------------------');
        /*//console.log('screens affected');
        console.log('-------------------------------------');
        console.log(systemLogic.mainScreen);*/
        systemLogic.mainScreen.connection.emit('mainScreenPageChange', {matrix: remotePageMatrix, position: systemLogic.pos, pause: selecting});
        
    });
        
    socket.on('apadEvent', function(data){
        var direction = data.direction
        console.log(`maiden voyayge already taken? ${systemLogic.maiden}`);
        
        if(systemLogic.maiden){
            systemLogic.drone.stop();
        }
        else{
            systemLogic.maiden = true;
        }
        
        switch(direction){
            case 'counter':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone counter clockwise at 10');
                        systemLogic.drone.counterClockwise(10);
                    }
                }
                break;
            case 'clockwise':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone clockwise at 10');
                        systemLogic.drone.clockwise(10);
                    }
                }//  
                break;
            case 'left':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone left at 5');
                        systemLogic.drone.left(5);
                    }
                }
                break;
            case 'back':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone back at 5');
                        systemLogic.drone.back(5);
                    }
                }
                break;
            case 'front':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone forward at 5');
                        systemLogic.drone.front(5);
                    }
                }
                break;
            case 'right':
                if(systemLogic.droneStatus.isFlying){
                    if(systemLogic.drone!=null){
                        console.log('drone right at 5');
                        systemLogic.drone.right(5);
                    }
                }
                break;
            case 'toggle':
                if(systemLogic.droneStatus.isLanded){
                    systemLogic.droneStatus.isFlying = true;
                    systemLogic.droneStatus.isLanded = false;
                    console.log('take off');
                    systemLogic.drone.takeoff();
                }
                else{
                    systemLogic.droneStatus.isFlying = false;
                    systemLogic.droneStatus.isLanded = true;
                    console.log('land');
                    systemLogic.drone.land();
                }
                break;
            case 'stop':
                if(systemLogic.droneStatus.isFlying){
                    console.log('stop moving.');
                    systemLogic.drone.stop();
                }
                break;
            default:
                console.log('no action; remaining still');
                systemLogic.drone.stop();
                //drone.stop();
                break;
        }
    });
    
    socket.on('selectPage', function(data){
        var target = data.target;
        for(var i=0; i<systemLogic.remoteList.length; i++){
            broadcast(i, target);
        }
    });
    
    socket.on('recordSuccessfulRemoteToScreenInteraction', function(data){
        systemLogic.remoteActionVisibleOnMainScreen == data.status;
    });
    
    /////////// build functions for the postAR app ///////////
    
    
    socket.on('createScene', function(data){
        var ori = data.orientation;
        
        socket.emit('clearInitialVideoFeed', {status: 1});
        
        switch(ori){
            case 0: // landmark oriented
                landmarkTrackingTest(socket);
                break;
            case 1: // face oriented
                //facialRecognitionTest(socket, 0, 100);
                facialRecognitionTest(socket, 1, 250);
                break;
            case 2: // hand oriented
                //gestureTrackingTest(socket, 0, 100);
                gestureTrackingTest(socket, 1, 250);
                //gestureTrackingTest(socket, 1, 1000);
                break;
            default:
                console.log('no associated orientation found');
                break;
        }
        
        socket.emit('transitionToBuildView', {buildType: ori});
    });
    
    // TODO DEFINE THUMBS UP gesture to provide  means for exiting the building mode
    
    socket.on('addObjectToLandmarkOrientedScene', function(data){
        console.log('TODO: add object to landmark scenery');
    });
    
    socket.on('addObjectToFaceOrientedScene', function(data){
        console.log('TODO: add object to face scenery');
        
        // TODO change global variable switch that triggers buffer output from that of the face box (eventually mesh) mesh to that of a mask, sunglasses, or heads up display
        // TODO to swipe through the options after the initial change gesture tracking should be involved, e.g. making a motion to wipe your face brings up a new mask
    });
    
    socket.on('addObjectToHandOrientedScene', function(data){
        console.log('TODO: add object to hand scenery');
        if(objectsInSceneHandler.adding){
            objectsInSceneHandler.adding = false;
            objectsInSceneHandler.saveLastVertex = true;
        }
        else{
            objectsInSceneHandler.adding = true;
        }
        // TODO change global variable switch that triggers buffer output from that of the hand mesh to that of the ball
    });
    
    socket.on('generateExperience', function(data){
        console.log(objectsInSceneHandler.points);
        var builder = data.builder;
        var type = builder.orientation;
        console.log('--------------------------');
        console.log('builder:');
        console.log(builder);
        console.log('--------------------------');
        console.log('type:')
        console.log(type);
        console.log('--------------------------');
        
        switch(type){
            case 0:
                console.log('stopping landmark scene builder...');
                
                clearInterval(objectsInSceneHandler.gestureInterval);
                
                console.log('hand gesture tracking stopped.');
                break;
            case 1:
                console.log('stopping face oriented scene builder...');
                
                clearInterval(objectsInSceneHandler.starter);
                
                console.log('face tracking stopped.');
                break;
            case 2:
                console.log('stopping hand oriented scene builder...');
                
                clearInterval(objectsInSceneHandler.gestureInterval);
                
                console.log('hand gesture tracking stopped.');
                break;
            default:
                console.log('no experience generator associated with this type.');
                break;
        }
                
        socket.emit('cleanUpExperienceBuilderScene', {amountCreated: objectsInSceneHandler.points.length});
        
        var experience = buildUserARExperience();   // builder
        objectsInSceneHandler.build.markup = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1.0' />
                <title>AR Template | v 0.9.1</title>
                <link rel='stylesheet' type='text/css' href='../../css/roomsapp/profile.css' />
                <script src='../../js/jquery-3.2.1.min.js'></script>
                <script src='../../js/aframe.min.js'></script>
                <script src="https://rawgit.com/mayognaise/aframe-gif-shader/master/dist/aframe-gif-shader.min.js"></script>
                <script src='../../js/ar.min.js'></script>
                <script>
                    var sessionManager;

                    function requestFullScreen(element) { //    makes the application fullscreen on fullscreen equipped browsers
                        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen; // Supports most browsers and their versions.

                        if (requestMethod) { // Native full screen.
                            requestMethod.call(element);
                        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                            var wscript = new ActiveXObject("WScript.Shell");
                            if (wscript !== null) {
                                wscript.SendKeys("{F11}");
                            }
                        }
                    }

                    function initializeSession(data){
                        sessionManager = {
                            audio: {
                                player: null,
                                isPlaying: false,
                                focus: null,
                                state: 0 // 0 = inactive; 1 = playing; 2 = paused
                            },
                            application: {
                                focus: 0, // 0 = home; 1 = audio; 2 = visual; 3 = search
                                players: {
                                    available: [
                                        'audioAR',
                                        'visualAR'
                                    ],
                                    loaded: null
                                }
                            },
                            visual: {
                                player: null,
                                isPlaying: false,
                                focus: null,
                                state: 0 // 0 = inactive; 1 = playing; 2 = paused
                            },
                        };

                       // loadAREnvironment(0);
                        /**/

                        sessionManager.audio.focus = 0;
                    }

                    $(document).ready(function(){
                        initializeSession();

                        // FIRST STAGE
                        $('#launch-application-page').click(function(){

                            console.log('application launch...');

                            var elem = document.body;
                            //requestFullScreen(elem);

                            $(this).animate({
                                height: 0
                            }, 2500, function(){
                                $(this).hide();
                            });
                        });

                    });
                </script>
            </head>
            <body>
                <div id='launch-application-page' class='entry-layer overlay'>
                    <div id='instructions'>
                        tap anywhere
                        <div id='logo'></div>
                        to launch app
                    </div>
                </div>
                <div id='main-app-container' class='viewer-layer'>
                <a-scene embedded>
                    <a-assets>
                        <img id='floor-texture' src='../../media/texture/grid_pattern.png' preload='true' />
                    </a-assets>`+experience+`</a-scene></div></body></html>`;
        
        setTimeout(function(){
            if(type==2){
                objectsInSceneHandler.webcam.release();
                //objectsInSceneHandler.webcam = null;    
            }
            
            socket.emit('loadUserARExperience', {status: 1, source: experience});
            
            setTimeout(function(){
                socket.emit('restartVideoFeed', {status: 1});
            }, 500);
        }, 500);
        
    });
    
    socket.on('recordCurrentObjectType', function(data){
        var type = data.type;
        var source = data.src;
        var scale = data.scale;
        objectsInSceneHandler.objectList.push({type: type, src: source, scale: scale});
    });
    
    socket.on('registerExperience', function(data){
        var fileName = '/'+data.name+'.html';
        
        var markup = objectsInSceneHandler.build.markup;
        
        fs.writeFile(dir[12]+fileName, markup, function (err) {
            if (err) {
                return console.log('there is an error building the markup');
            }

            console.log('the user experience was built and saved. \n file registered in system.');
        });
        
        socket.emit('completeRegistration', {success: true});
    });
    
    socket.on('disconnect', function(){
        console.log(`socket ${socket.id} disconnected.`);
    });
});