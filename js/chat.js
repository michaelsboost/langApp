// To Do
/* 
  Add sound for typing, sending and receiving messages
  Add sound for when lesson is completed
*/

if ( !$.inArray($("[data-gender]").text().toLowerCase(), ["male", "female"]) ) {
  alertify.error("Operation cancelled! Contact MUST have a male/female gender!");
}

function shiftChecked() {
  if ( $("#shift").is(":checked") ) {
    $("[data-action=lowercasetxt]").addClass("hide");
    $("[data-action=uppercasetxt]").removeClass("hide");
  } else {
    $("[data-action=lowercasetxt]").removeClass("hide");
    $("[data-action=uppercasetxt]").addClass("hide");
  }
}

$("#shift").on("change", function() {
  shiftChecked();
});

$("[data-action=uppercasetxt] button").each(function(e) {
  $(this).text($(this).text().toUpperCase());
})
.click(function() {
  $("#shift").prop("checked", false).trigger("change");
});

// Type the word with a physical keyboard
function typeWordKeyBoard() {
  $(window).on("keydown", function(e) {
    if (e.shiftKey) {
      var letter = String.fromCharCode(e.which);
      if (e.shiftKey && $(".keyboard button:contains('"+ letter +"')").not(".ignore").text() === letter) {
        $(".keyboard button:contains('"+ letter +"')").not(".ignore").trigger("click");
      }
      if (e.shiftKey && $(".keyboard button:contains('"+ letter +"')").not(".ignore").text() === "1" ) {
        $(".keyboard button:contains('!')").trigger("click");
      }
      if ( e.shiftKey && letter === "¿" ) {
        $(".keyboard button:contains('?')").trigger("click");
      }
      $("#shift").prop("checked", true).trigger("change");
      return false;
    } else {
      var letter = String.fromCharCode(e.which).toLowerCase();
      if ( letter === "þ" ) {
        $('.keyboard button:contains("\'")').trigger("click");
      }
      if ( letter === "¼" ) {
        $(".keyboard button:contains(',')").trigger("click");
      }
      if ( letter === "¾" ) {
        $(".keyboard button:contains('.')").trigger("click");
      }
      $(".keyboard button:contains('"+ letter +"')").not(".ignore").trigger("click");
      return false;
    }
    return false;
  }).on("keyup", function(e) {
    $("#shift").prop("checked", false).trigger("change");
  });
}
shiftChecked();
typeWordKeyBoard();

// Check if user's browser supports voice support
if (!responsiveVoice.voiceSupport()) {
  alertify.alert("You're browser does not have voice support!<br>Please upgrade to a more recent browser. <p>We recommend <a href='http://chrome.google.com/' target='_blank'>Google Chrome</a>!</p>");
}

// Reply and keyboard variables
var remWord        = "",
    str            = $(".chat-history > .you:hidden:first").text().trim(),
    typeIt         = str.substr(0, str.length - str.length + 1),
    nextStr        = str.substr(1, str.length),
    audioElement   = document.createElement("audio"),
    audioWord      = document.createElement("audio"),
    finishedLesson = function() {
      audioElement.setAttribute("src", "../../sounds/effects/lesson-complete.mp3");
      audioElement.play();
    },
    scroll2B       = function() {
      $(".chat-container").animate({
        scrollTop: $(this).height()
      });
    },
    checkSentence  = function() {
      // Word used to reply
      str = nextStr;
      // Detect first letter for typing
      typeIt = str.substr(0, str.length - str.length + 1);
      // Remove first letter for typing
      nextStr = str.substr(1, str.length);
    },
    speakSentence  = function() {
      // Speak arabic word/sentence
      $(".them, .you").find("[data-meaning]").on("click mouseover", function() {
        responsiveVoice.cancel();
        if ( $("[data-gender]").attr("data-gender") === "female" ) {
          responsiveVoice.speak(this.textContent, "UK English Female");
        } else {
          responsiveVoice.speak(this.textContent, "UK English Male");
        }
        return false;
      });
      responsiveVoice.cancel();
      if ( $("[data-gender]").attr("data-gender") === "female" ) {
        responsiveVoice.speak($(".chat-history > div").last().text(), "UK English Female");
      } else {
        responsiveVoice.speak($(".chat-history > div").last().text(), "UK English Male");
      }
    },
    speakThis      = function(msg) {
      // Speak arabic word/sentence
      responsiveVoice.cancel();
      if ( $("[data-gender]").attr("data-gender") === "female" ) {
        responsiveVoice.speak(msg, "UK English Female");
      } else {
        responsiveVoice.speak(msg, "UK English Male");
      }
      return false;
    },
    reloadChat     = function() {
      // Reload chat history
      $(".chat-history div").each(function(i) {
        $(this).remove();
        $(".chat-history").append(this);
      });
    },
    typeWord       = function() {
      // Detect first letter for typing
      typeIt = str.substr(0, str.length - str.length + 1);
      // Remove first letter for typing
      nextStr = str.substr(1, str.length);

      // Find out character's charCode
      // alertify.log(typeIt.charCodeAt(0));
      
      // Remove clicked letter and reset word to type
      $(".keyboard .active").removeClass("active");

      // Remember typed word
      remWord = remWord += typeIt;
      $("h1").text(remWord);
      // alertify.log(nextStr);

      if (!nextStr) {
        // Hello
        if (remWord === $(".chat-history > .you:hidden:first").text().trim()) {
          $(".chat-history > .you:hidden:first").removeClass("hide");
          $(".typingloader").removeClass("hide");
          speakThis( $(".chat-history .you:visible:last").text() );
          setTimeout(function() {
            $(".chat-history > .them:hidden:first").removeClass("hide");
            $(".typingloader").addClass("hide");
            scroll2B();
            speakThis( $(".chat-history .them:visible:last").text() );
          
            // Reset variables
            remWord = "";
            str = $(".chat-history > .you:hidden:first").text().trim();
            nextStr = str;
            checkSentence();
            $(".keyboard button:contains(\""+ typeIt +"\")").addClass("active");
            // Speak message when hovered over
            speakSentence();
          }, 2000);
          $("h1").text("");
          scroll2B();
          // Speak message when hovered over
          speakSentence();
        }
        // Goodbye
        if (remWord === $(".chat-history > .them:last").prev().text().trim()) {
          $("h1").text("");

          // Reset variables
          remWord = "";
          str = $(".chat-history > .you:last").text().trim();
          nextStr = str;
          checkSentence();
          $(".keyboard button:contains('"+ typeIt +"')").addClass("active");
          
          alertify.alert("Congrats! You've completed the Introductory Chat :)", function(e) {
            if (e) {
              // Speak message when hovered over
              speakSentence();
            } else {
              alertify.error("Houston there's a problem " + e);
            }
          });
          finishedLesson();
          // Speak message when hovered over
          speakSentence();
        }
        reloadChat();
        return false;
      } else {
        checkSentence();
        $(".keyboard button:contains(\""+ typeIt +"\")").addClass("active");
      }
      
      //// See console outputs
      //console.log("Type String: " + str);
      //console.log("Remember Word: " + remWord);
      //console.log("Next String: " + nextStr);
    },
    audioKey       = document.createElement("audio"),
    keySound  = function() {
      audioKey.setAttribute("src", "../../sounds/effects/keypress.mp3");
      audioKey.play();
    };


// Speak first message
setTimeout(function() {
  speakThis( $(".chat-history .them:first").text() );
}, 300);

// Speak message when hovered over
speakSentence();

// Make first letter active to type
$(".keyboard button:contains('"+ typeIt +"')").not(".ignore").addClass("active");

// Reload keyboard keys click function
$(".keyboard").each(function(i) {
  $(".keyboard").eq(i).on("click", "> div .active", function(e) {
    $(".keyboard").eq( Number(!i) ).append(this);
    
    // Keypress type sound effect
    keySound();

    $(".keyboard").find(".active").on("click", function(e) {
      if ($(e.target).hasClass("active")) {
        typeWord();
        typeWordKeyBoard();
      }
      return false;
    }).trigger("click");
    return false;
  });
});
$("label[for=shift]").click(function() {
  keySound();
});

// Detect pressed letter
//$("[data-detect=key]").on("keydown", function(e) {
//  e.preventDefault();
//  alertify.log(e.which);
//  alertify.log( String.fromCharCode(e.which) );
//});