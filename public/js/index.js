//Code that handles caht-bot

var $messages = $('.messages-content');
var serverResponse = "wala";
console.log(personalchat[0].members[1]);


var suggession;
//speech reco
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
}

$('#start-record-btn').on('click', function(e) {
  recognition.start();
});

recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
 document.getElementById("MSG").value= speechToText;
  //console.log(speechToText)
  insertMessage()
}


function listendom(no){
  console.log(no)
  //console.log(document.getElementById(no))
document.getElementById("MSG").value= no.innerHTML;
  insertMessage();
}

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    serverMessage("Hello!I am your personal assistant to solve your worries related to COVID-19..Ask your doubts;)");
  }, 100);

});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  fetchmsg() 
  
  $('.message-input').val(null);
  updateScrollbar();

}



// function insertMessage1() {
//   msg ='Symptom-Checker';
//   if ($.trim(msg) == '') {
//     return false;
//   }
//   $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
 
//   fetchmsg1() 
  
//   updateScrollbar();

// }

document.getElementById("mymsg").onsubmit = (e)=>{
  e.preventDefault() 
  insertMessage();
  
 // speechSynthesis.speak( new SpeechSynthesisUtterance("hello"))
}


// document.getElementById("mymsg1").onsubmit = (e)=>{
//   e.preventDefault() 
//   insertMessage1();
  
//  // speechSynthesis.speak( new SpeechSynthesisUtterance("hello"))
// }

function serverMessage(response2) {


  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="images/navimg.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  

  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="images/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);

}


function fetchmsg(){

     var url = 'http://localhost:5000/send-msg';
      
      const data = new URLSearchParams();
      for (const pair of new FormData(document.getElementById("mymsg"))) {
          data.append(pair[0], pair[1]);
          console.log(pair)
      }
    
      console.log("abc",data)
        fetch(url, {
          method: 'POST',
          body:data
        }).then(res => res.json())
         .then(response => {
          console.log(response);
          serverMessage(response.Reply);
         // speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))
        
          
         })
          .catch(error => console.error('Error h:', error));

}


// function fetchmsg1(){

//   var url = 'http://localhost:5000/send-msg1';
   
//    const data = new URLSearchParams();
   
//    console.log("abc",data)
//      fetch(url, {
//        method: 'POST',
//        body:data
//      }).then(res => res.json())
//       .then(response => {
//        console.log(response);
//        serverMessage(response.Reply);
//       // speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))
     
       
//       })
//        .catch(error => console.error('Error h:', error));

// }


