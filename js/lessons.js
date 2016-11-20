// Is back button visible?
if ( !$(".goback").is(":visible") ) {
  // $("body").append("<a href=\"../../index.html\" class=\"gohome pointer\">\n    <i class=\"fa fa-home\"></i>\n  </a>");
  // $("body").append("<a onclick='history.back()' class=\"goback pointer\">\n    <i class=\"fa fa-chevron-left\"></i>\n  </a>");
  // $("body").append("<a onclick='history.back()' class=\"goback pointer\">\n    <i class=\"fa fa-chevron-left\"></i>\n  </a>");
  $("body").append("<a href='../../index.html' class=\"goback pointer\">\n    <i class=\"fa fa-home\"></i>\n  </a>");
}

// Plugins
(function($) {
  $.fn.randomize = function(childElm) {
    return this.each(function() {
      var $this = $(this);
      var elms = $this.children(childElm);
      
      elms.sort(function() {
        return (Math.round(Math.random())-0.05);
      });
      $this.remove(childElm);
      
      for (i = 0; i < elms.length; i++) {
        $this.append(elms[i]);
      }
    });
  }
})(jQuery);

// Variables
var counter = 0;
    parentPage = window.location.toString().split(/\?|#/)[0],
    audioElement  = document.createElement("audio"),
    audioWord     = document.createElement("audio"),
    successSound  = function() {
      audioElement.setAttribute("src", "../../sounds/effects/success.mp3");
      audioElement.play();
    },
    errorSound    = function() {
      audioElement.setAttribute("src", "../../sounds/effects/error.mp3");
      audioElement.play();
    },
    wrongSound    = function() {
      audioElement.setAttribute("src", "../../sounds/effects/wrong.mp3");
      audioElement.play();
    },
    wrongAnswer   = function(answer, call) {
      wrongSound();

      alertify.alert("The correct answer is... " + "<h1>"+ answer +"</h1>");
    },
    randomCorrect = function() {
      successSound();
//      alertify.log("correct")
      setTimeout(function() {
        location.reload(true);
      }, 1300);
      return false;
    },
    randomError   = function() {
//      alertify.log("wrong")
      errorSound();
    },
    randomWrong   = function(answer) {
      wrongSound();
      $("body").css("background", "#fec2f1");
      
      // Show the user what question he/she got wrong
      alertify.set({
        labels: {
          ok    : "Continue"
        }
      });
      alertify.alert("The correct answer is... " + answer, function(e) {
        if (e) {
//          setTimeout(function() {
//            location.reload(true);
//          }, 1300);
            location.reload(true);
        } else {
          alertify.error("Houston there's a problem " + e);
        }
      });
      
      return answer;
    };

$(document).ready(function() {
  if ( $("body").hasClass("speak") ) {
    if ( $(".arb").is(":visible") ) {
      $(".speak").on("click mouseover", function() {
        responsiveVoice.cancel();
        responsiveVoice.speak($(".arb").text(), "Arabic Female");
      });
      setTimeout(function() {
        responsiveVoice.cancel();
        responsiveVoice.speak($(".arb").text(), "Arabic Female");
      }, 500);
    } else if ( $(".eng").is(":visible") ) {
      $(".speak").on("click mouseover", function() {
        responsiveVoice.cancel();
        responsiveVoice.speak($(".eng").text(), "UK English Female");
      });
      setTimeout(function() {
        responsiveVoice.cancel();
        responsiveVoice.speak($(".eng").text(), "UK English Female");
      }, 500);
    }
  }
  
  $(".arb").on("click mouseover", function() {
    responsiveVoice.cancel();
    responsiveVoice.speak(this.textContent.trim(), "Arabic Female");
  });
  $(".eng").on("click mouseover", function() {
    responsiveVoice.cancel();
    //responsiveVoice.speak(this.textContent.trim(), "UK English Female");
    responsiveVoice.speak($(this).attr("data-meaning"), "Arabic Female");
  });
  
  $(function() {
    // Variables
    var $val, nextElm,
        counter          = 1;
        words            = null,
        answer           = $("." + $("input:checked").attr("id") + " .answer").text(),
        speakQues        = function() {
          if ( $("." + $("input:checked").attr("id") + " .arb.ques").is(":visible") ) {
            var $txt = $("." + $("input:checked").attr("id") + " .arb.ques");
            setTimeout(function() {
              responsiveVoice.cancel();
              responsiveVoice.speak($txt.text().trim(), "Arabic Female");
            }, 300);
          } else {
            var $txt = $("." + $("input:checked").attr("id") + " .eng.ques");
            setTimeout(function() {
              responsiveVoice.cancel();
              responsiveVoice.speak($txt.attr("data-meaning"), "Arabic Female");
              //responsiveVoice.speak($txt.text().trim(), "UK English Female");
            }, 300);
          }
        },
        speechKitTest    = function() {
          // first we make sure annyang started succesfully
          if (annyang) {
            annyang.debug();

            // Add our commands to annyang
            annyang.addCommands({
              'hello': function() { alert('Hello world!'); }
            });

            // Tell KITT to use annyang
            SpeechKITT.annyang();

            // Define a stylesheet for KITT to use
            SpeechKITT.setStylesheet('../../css/flat.css');

            // Render KITT's interface
            SpeechKITT.vroom();

            // Set a language for speech recognition (defaults to English)
            // annyang.setLanguage('ar-EG');
          } else {
            alertify.error("Ooops... Looks like your browser does not support the HTML5 Speach API.");
            alertify.error("Please upgrade to a newer version. Chrome recommended");
          }
        },
        annyangTest      = function() {
          // first we make sure annyang started succesfully
          if (annyang) {
            // define our commands.
            var commands = {
              'hello': function() {
                alertify.log("hello");
              }
            };

            annyang.addCommands(commands);
            annyang.debug();

            // Set a language for speech recognition (defaults to English)
            // annyang.setLanguage('ar-EG');

            if ($(this).hasClass("listening")) {
              annyang.abort();
              $(this).removeClass("listening");
            } else {
              annyang.start();
              $(this).addClass("listening");
            }
          } else {
            alertify.error("Ooops... Looks like your browser does not support the HTML5 Speach API.");
            alertify.error("Please upgrade to a newer version. Chrome recommended");
          }
        },
        html5SpeechTest1 = function() {
          if ("webkitSpeechRecognition" in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "EN-US";
            recognition.continuous = false;
            recognition.interimResults = false;
          }

          recognition.start();
          $(".mic").removeClass("fa-microphone")
                  .addClass("fa-microphone-slash");

          recognition.onresult = function(evt) {
            for (var i = evt.resultIndex; i < evt.results.length; i++) {
              var transcript = evt.results[i][0].transcript;
              if (evt.results[i].isFinal) {
                console.log(transcript);
                recognition.stop();
                $(".mic").removeClass("fa-microphone-slash")
                        .addClass("fa-microphone");
                return true;
              } else {
                console.log(transcript);
              }
            }
            console.log(evt);
          }
        };
        html5SpeechTest2 = function() {
          var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
          var recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          // recognition.continuous = false;
          recognition.interimResults = false;
          recognition.maxAlternatives = 5;
          recognition.start();
          recognition.onstart = function() {
            $(".mic").addClass("fa-microphone")
                    .removeClass("fa-microphone-slash");
          };

          recognition.onresult = function(evt) {
            var transcript = evt.results[0][0].transcript;
            alertify.log("You said: " + transcript);
          }
          recognition.onspeechend = function() {
            $(".mic").removeClass("fa-microphone-slash")
                    .addClass("fa-microphone");
          };
        };
    
    // Lesson name
    $("[data-document=title]").text( document.title.replace("langApp: ", "") );
    
    function initializeLesson() {
      // Translate Sentence
      $(".userSentence").on("keyup", function(e) {
        if ( e.which == 13 ) {
          $("." + $("input:checked").attr("id") + " .checkSentence").trigger("click");
        }
        if ( this.value === $("." + $("input:checked").attr("id") + " .answer").text() ) {
          $("." + $("input:checked").attr("id") + " .checkSentence").trigger("click");
        }
        return false;
      });
      // Check answer
      $(".checkSentence").on("click", function() {
        $val = $("." + $("input:checked").attr("id") + " .userSentence").val();
        nextElm = Number( $("input:checked").attr("id") ) + 1;

        if ( $val === $("." + $("input:checked").attr("id") + " .answer").text() ) {
          successSound();
          $("[data-correct=amount]").text(counter++);
          if ( $("input#" + nextElm).is(":visible") ) {
            $("input#" + nextElm).trigger("click");
            speakQues();
          } else {
            alertify.log("End of lesson");
          }
        } else {
          answer = $("." + $("input:checked").attr("id") + " .answer").text();

          if ( $("input#" + nextElm).is(":visible") ) {
            wrongSound();
            alertify.alert("The correct answer is... " + "<h1>"+ answer +"</h1>", function(e) {
              if (e) {
                // Go to next section when ok is clicked 
                $("input#" + nextElm).trigger("click");
              }
            });
          } else {
            wrongAnswer($("." + $("input:checked").attr("id") + " .answer").text());
            alertify.log("End of lesson");
          }
        }
        return false;
      });
      // Add a letter to the textbox
      $(".charmenu a").on("click", function() {
        $val = $("." + $("input:checked").attr("id") + " .userSentence").val();
        $("." + $("input:checked").attr("id") + " .userSentence").val( $val + this.textContent );

        // Is this correct?
        if ( $val === $("." + $("input:checked").attr("id") + " .answer").text() ) {
          $("." + $("input:checked").attr("id") + " .checkSentence").trigger("click");
        }
      });
      // Backspace
      $(".delword").on("click", function() {
        $val = $("." + $("input:checked").attr("id") + " .userSentence").val();
        $("." + $("input:checked").attr("id") + " .userSentence").val($val.slice(0, -1));
        return false;
      });

      // Find card answer
      $(".card").on("click", function() {
        var pickedCard = $(this).find("h2").text();
        answer = $("." + $("input:checked").attr("id") + " .answer");

        if ( !pickedCard === answer.text() ) {
          this.style.backgroundColor = "#ff3666";
        }
        return false;
      });

      // Speak the sentence
      $(".speak").on("click", function() {
        annyangTest();
      });

      // Listen to sentence
      $(".listen").on("click mouseover", function() {
        speakQues();
      });
      $(".hear").on("click", function() {
        speakQues();
      });
      speakQues();

      // Check answers
      $(".correct").on("click", function() {
        $("[data-correct=amount]").text(counter++);
        nextElm = Number( $("input:checked").attr("id") ) + 1;
        if ( $("input#" + nextElm).is(":visible") ) {
          successSound();
          $("input#" + nextElm).trigger("click");
          speakQues();
        } else {
          successSound();
          alertify.log("End of lesson");
        }
        return false;
      });
      $(".wrong").on("click", function(e) {
        nextElm = Number( $("input:checked").attr("id") ) + 1;
        answer =  $("." + $("input:checked").attr("id") + " .answer").text();
        if ( $("input#" + nextElm).is(":visible") ) {
          wrongSound();
          alertify.alert("The correct answer is... " + "<h1>"+ answer +"</h1>", function(e) {
            if (e) {
              // Go to next section when ok is clicked 
              $("input#" + nextElm).trigger("click");
              speakQues();
            }
          });
        } else {
          wrongAnswer($("." + $("input:checked").attr("id") + " .answer").text());
          alertify.log("End of lesson");
        }
        return false;
      });
      $(".error").on("click", function() {
        errorSound();
        return false;
      });
      $(".skip").on("click", function() {
        nextElm = Number( $("input:checked").attr("id") ) + 1;
        if ( $("input#" + nextElm).is(":visible") ) {
          $("input#" + nextElm).trigger("click");
          speakQues();
        } else {
          alertify.log("End of lesson");
        }
        return false;
      });
    }
    initializeLesson();

    // Randomize stuff
    $(".cards-container").randomize(".card");
    $(".list").randomize(".addword");  
    
    // Translate question on click
    $("body").on("click", function(e) {
      console.log( $(e.target).attr("class") )
      if ( $(e.target).attr("data-meaning") ) {
        if ( $(e.target).hasClass("ques") ) {
          $meaning = $(e.target).attr("data-meaning");
          $width   = $(e.target).css("width").toString().replace("px", "");
          $top     = $(e.target).offset().top;
          $left    = $(e.target).offset().left;
 
          $(".translation").slideDown().css({
            top: "calc(" + $top + "px + 36px)",
            left: $left + "px"
          }).find(".text").text($meaning);
        }
      } else {
        $(".translation").slideUp();
      }
    });
  });
  
  // Check if alphabet menu is visible
  if ( $("#charmenu").is(":visible") ) {
    // Scroll Character Menu
    (function() {
      function scrollMenu(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.getElementById('charmenu').scrollLeft -= (delta*40); // Multiplied by 40
        return false;
      }
      if (document.getElementById('charmenu').addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.getElementById('charmenu').addEventListener('mousewheel', scrollMenu, false);
        // Firefox
        document.getElementById('charmenu').addEventListener('DOMMouseScroll', scrollMenu, false);
      } else {
        // IE 6/7/8
        document.getElementById('charmenu').attachEvent('onmousewheel', scrollMenu);
      }
    })();
  }
});