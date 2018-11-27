var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var sessionManager = {

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

$(document).ready(function(){
    console.log('landed on the eV page');

    var diagnostic = document.querySelector('.output');
    var bg = document.querySelector('#main-app-container');
    var hints = document.querySelector('.hints');

    var colorHTML= '';
    colors.forEach(function(v, i, a){
      console.log(v, i);
      colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
    });
    hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try '+ colorHTML + '.';


    $('#launch-application-page').click(function(){
        $(this).animate({
            height: 0,
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });
    });
    
    document.body.onclick = function() {
        recognition.start();
        console.log('Ready to receive a color command.');
    }

    recognition.onresult = function(event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The [last] returns the SpeechRecognitionResult at the last position.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object

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
    }
});