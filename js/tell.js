var sessionManager = {
    actionsTriggered: [],
    actionHistory: []
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

function appendActionToBanner(last){
    var item = last;
    var totem = null;
    var max = sessionManager.actionsTriggered.length-1;
    var recentFilter = null;
    
    if(max>-1){
        recentFilter = sessionManager.actionsTriggered[max];
        if(item.indexOf(recentFilter)>-1){
            console.log('already logged this movement...');
        } //dis is da wae
    }
    // THERE is a more systematic way of doing this; PLEASE REVISE -- p@m0
    
    if(item.indexOf('take off')>-1&&recentFilter!='take off'){
        sessionManager.actionsTriggered.push('take off');
        totem = `<div class='action-history-bubble take-off-bubble'>TO</div>`;
    }
    if(item.indexOf('land')>-1&&recentFilter!='land'){
        sessionManager.actionsTriggered.push('land');
        totem = `<div class='action-history-bubble land-bubble'>LD</div>`;
    }
    if(item.indexOf('up')>-1&&recentFilter!='up'){
        sessionManager.actionsTriggered.push('up');
        totem = `<div class='action-history-bubble up-bubble'>UP</div>`;
    }
    if(item.indexOf('down')>-1&&recentFilter!='down'){
        sessionManager.actionsTriggered.push('down');
        totem = `<div class='action-history-bubble down-bubble'>DN</div>`;
    }
    if(item.indexOf('left')>-1&&recentFilter!='left'){
        sessionManager.actionsTriggered.push('left');
        totem = `<div class='action-history-bubble left-bubble'>LT</div>`;
    }
    if(item.indexOf('right')>-1&&recentFilter!='right'){
        sessionManager.actionsTriggered.push('right');
        totem = `<div class='action-history-bubble right-bubble'>RT</div>`;
    }
    if(item.indexOf('front')>-1&&recentFilter!='front'){
        sessionManager.actionsTriggered.push('front');
        totem = `<div class='action-history-bubble front-bubble'>FT</div>`;
    }
    if(item.indexOf('back')>-1&&recentFilter!='back'){
        sessionManager.actionsTriggered.push('back');
        totem = `<div class='action-history-bubble back-bubble'>BK</div>`;
    }
    if(item.indexOf('stop')>-1&&recentFilter!='stop'){
        sessionManager.actionsTriggered.push('stop');
        totem = `<div class='action-history-bubble stop-bubble'>SP</div>`;
    }
    
    
    $('#action-history-container').append(totem);
    
}

$(document).ready(function(){
    console.log('landed on the eV page');

    $('#launch-application-page').click(function(){
        init();
        console.log('begin recording...');
        $(this).animate({
            height: 0,
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });
    });
   
    /*recognition.onresult = function(event) {
      var last = event.results.length - 1;
      var color = event.results[last][0].transcript;

      diagnostic.textContent = 'Result received: ' + color + '.';
      bg.style.backgroundColor = color;
      console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function() {
      recognition.stop();
    }

    recognition.onnomatch = function(event) {
      diagnostic.textContent = "I didn't recognise that color.";
    }

    recognition.onerror = function(event) {
      diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }*/
});