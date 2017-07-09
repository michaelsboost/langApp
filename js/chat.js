// Check if user's browser supports voice support
if (!responsiveVoice.voiceSupport()) {
  alertify.alert("You're browser does not have voice support!<br>Please upgrade to a more recent browser. <p>We recommend <a href='http://chrome.google.com/' target='_blank'>Google Chrome</a>!</p>");
}

var male   = "Kareem Shamon",
    female = "Akira Khoury";

if ( !$.inArray($("[data-gender]").text().toLowerCase(), ["male", "female"]) ) {
  alertify.error("Operation cancelled! Contact MUST have a male/female gender!");
}
if ( $("[data-person]").attr("data-person") ) {
  $("[data-person], [data-output=name]").text($("[data-person]").attr("data-person"));
} else {
  if ( $("[data-gender]").attr("data-gender") === "female" ) {
    $("[data-gender]").text(female);
  } else {
    $("[data-gender]").text(male);
  }
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

// Reply and keyboard variables
var intervalChat,
    remWord        = "",
    str            = $(".chat-history > .you:hidden:first").text().trim(),
    typeIt         = str.substr(0, str.length - str.length + 1),
    nextStr        = str.substr(1, str.length),
    audioElement   = document.createElement("audio"),
    audioWord      = document.createElement("audio"),
    audioKey       = document.createElement("audio"),
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
    speakSentenceHover = function() {
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
      $(".preview h1").text(remWord);
      // alertify.log(nextStr);

      if (!nextStr) {
        // Hello
        if (remWord === $(".chat-history > .you:hidden:first").text().trim()) {
          $(".chat-history > .you:hidden:first").removeClass("hide");
          $(".typingloader").removeClass("hide");
          $(".bottom-bar").fadeOut();
          $(".chat-container").delay(150).css("height", "calc(100vh - 55px");

          speakThis( $(".chat-history .you:visible:last").text() );
          scroll2B();
          intervalChat = setInterval(function() {
            // Detect if they have multiple messages
            if ( $(".chat-history > .msg:hidden:first").hasClass("them")) {
              $(".typingloader").removeClass("hide");
              scroll2B();
              $(".chat-history > .them:hidden:first").removeClass("hide");
              speakThis( $(".chat-history .them:visible:last").text() );
              scroll2B();

              if ( $(".chat-history > .msg:hidden:first").hasClass("you")) {
                $(".typingloader").addClass("hide");
                $(".chat-container").attr("style", "");
                $(".bottom-bar").fadeIn();

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
                $(".preview h1").text("");
                
                clearInterval(intervalChat);
              }
            } else {
              clearInterval(intervalChat);
              $(".typingloader").addClass("hide");
              // Detect if last message
              if ($(".chat-history > .you:last").is(":visible")) {
                clearInterval(intervalChat);
                $(".chat-container").css("height", "calc(100vh - 55px");
                $(".bottom-bar").remove();
                
                UIkit.modal.alert("<h3>Fantastic! You've completed the lesson!").then(function() {
                  window.location.href = "../../index.html";
                  // location.reload("true");
                });
                finishedLesson();
                speakSentence();
                return false;
              } else {
                clearInterval(intervalChat);
                $(".chat-container").attr("style", "");
                $(".bottom-bar").fadeIn();
              }
            }
            
            var chatHistory = $("[data-output=messages]").html();
            $("[data-output=messages]").html("");
            $("[data-output=messages]").html(chatHistory);

            // Reset variables
            remWord = "";
            str = $(".chat-history > .you:hidden:first").text().trim();
            nextStr = str;
            checkSentence();
            $(".keyboard button:contains('"+ typeIt +"')").addClass("active");
            scroll2B();
          }, 2000);
          $(".preview h1").text("");
        }
        reloadChat();
        
        // Speak message when hovered over
        speakSentenceHover();
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
    keySound       = function() {
      audioKey.setAttribute("src", "../../sounds/effects/keypress.mp3");
      audioKey.play();
    };

// Share to Social Networks
$("[data-call=share]").click(function() {
  $(".sharelist").slideToggle();
});
$(".chat-container, .bottom-bar").click(function() {
  if ($(".sharelist").is(":visible")) {
    $(".sharelist").slideToggle();
  }
});
$(".comingsoon").click(function() {
  alertify.log("coming soon");
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

// Check and see if you start first
if ($(".chat-history > .you:first").is(":visible")) {
  $(".typingloader").removeClass("hide");
  $(".bottom-bar").fadeOut();
  $(".chat-container").delay(150).css("height", "calc(100vh - 55px");
  speakThis( $(".chat-history .you:visible:last").text() );
  scroll2B();
  setTimeout(function() {
    $(".chat-history > .them:hidden:first").removeClass("hide");
    $(".typingloader").addClass("hide");
    $(".chat-container").attr("style", "");
    $(".bottom-bar").fadeIn();
    speakThis( $(".chat-history .them:visible:last").text() );
    scroll2B();
  }, 2000);
}

// Speak first message
setTimeout(function() {
  speakThis( $(".chat-history .msg:first").text() );
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