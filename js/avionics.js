var sessionManager = {
    actionsTriggered: [],
    actionHistory: [],
    connection: null
};

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

function init(){
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    let finalTranscript = '';
    let recognition = new window.SpeechRecognition();
    
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        var insert;
        var lastItem = event.results.length - 1;
        
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
                //if(transcript.indexOf)
            }
        }
        
        if(interimTranscript.indexOf('take off')>-1){
            insert = interimTranscript.indexOf('take off');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+8)+'</span>'+interimTranscript.substring(insert+9);
            
        }
        if(interimTranscript.indexOf('land')>-1){
            insert = interimTranscript.indexOf('land');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: yellow;">'+interimTranscript.substring(insert, insert+4)+'</span>'+interimTranscript.substring(insert+4);
        }
        if(interimTranscript.indexOf('up')>-1){
            insert = interimTranscript.indexOf('up');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+2)+'</span>'+interimTranscript.substring(insert+2);
        }
        if(interimTranscript.indexOf('down')>-1){
            insert = interimTranscript.indexOf('down');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+4)+'</span>'+interimTranscript.substring(insert+4);
        }
        if(interimTranscript.indexOf('left')>-1){
            insert = interimTranscript.indexOf('left');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+4)+'</span>'+interimTranscript.substring(insert+4);
        }
        if(interimTranscript.indexOf('right')>-1){
            insert = interimTranscript.indexOf('right');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+5)+'</span>'+interimTranscript.substring(insert+5);
        }
        if(interimTranscript.indexOf('back')>-1){
            insert = interimTranscript.indexOf('back');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: aquamarine;">'+interimTranscript.substring(insert, insert+4)+'</span>'+interimTranscript.substring(insert+4);
        }
        if(interimTranscript.indexOf('stop')>-1){
            insert = interimTranscript.indexOf('stop');
            interimTranscript = interimTranscript.substring(0, insert)+'<span style="color: red;">'+interimTranscript.substring(insert, insert+4)+'</span>'+interimTranscript.substring(insert+4);
        }
        
        document.querySelector('.output').innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</>';
        
        var last = event.results[lastItem][0].transcript;
        appendActionToBanner(last);
    }
    
    recognition.onspeechend = (event) => {
        console.log('stopped talking...');
        console.log(finalTranscript);
        console.log(sessionManager.actionsTriggered);
        
        sessionManager.actionHistory = [].concat(sessionManager.actionsTriggered);
        sessionManager.actionsTriggered = [];
    }
    
    recognition.start();
}

$(document).ready(function(){
    console.log('landed on the eV page');
    sessionManager.connection = io.connect(location.host);

    $('#launch-application-page').click(function(){
        sessionManager.connection.emit('connectEV', {status: true});
        //init();
        console.log('open console...');
        $(this).animate({
            height: 0,
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });
    });
});