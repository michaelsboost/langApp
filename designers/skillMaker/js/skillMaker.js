// Application Name
var appName = "skillMaker";
document.title = appName;
$(".apptitle").text(appName);

// Language application name
var langApp = "langApp";

// Variables
var counter = 0,
    lessonCode,
    skillName   = $("[data-skill=name]").text(),
    deleteLessons = function() {
      $("[data-delete=lesson]").on("click", function() {
        $(this).parent().remove();

        var totalLessons = $(".lesson-flyer").length;
        $(".lesson-flyer").each(function(index) {
          var count = index + 1;
          $(this).find("h2").text("Lesson " + count + " / " + totalLessons);

          // Make editable properties active
          $("[data-set=editable]").attr("contenteditable", "true");
          $("[data-set=editable]").on("keyup", function() {
            localStorage.setItem("lessonFlyers", $(".lessons-container").html());
          });
          localStorage.setItem("lessonFlyers", $(".lessons-container").html());
        });
      });
    },
    storeValues   = function() {
      // Remember Skill Name
      if ( localStorage.getItem("skillName")) {
        $("[data-skill=name]").text(localStorage.getItem("skillName"));
        skillName = localStorage.getItem("skillName");
      }
      $("[data-skill=name]").on("keyup change", function() {
        localStorage.setItem("skillName", this.textContent);
      });
      // Remember Added lessonFlyers
      if ( localStorage.getItem("lessonFlyers")) {
        $(".lessons-container").html(localStorage.getItem("lessonFlyers"));
        $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-times deleteLesson' data-delete='lesson'></a>");
        // $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-edit editLesson' data-edit='lesson'></a>");

        var lessonPrev = $("[data-place=lesson]").find(".lesson-preview");
        lessonPrev.attr("data-set", "editable");
        lessonPrev.attr("contentEditable", "true");

        $("[data-set=editable]").on("keyup", function() {
          localStorage.setItem("lessonFlyers", $(".lessons-container").html());
          return false;
        });

        $(".lessons-container a").on("click", function(e) {
          e.preventDefault();
        });
      }
      // Remember Added lessonNotes
      if ( localStorage.getItem("lessonNotes")) {
        $("[data-edit=notes]").html(localStorage.getItem("lessonNotes"));

        $("[data-edit=notes]").on("keyup", function() {
          localStorage.setItem("lessonNotes", $("[data-edit=notes]").html());
          return false;
        });
      }
      // Remember Dictionary Notes
      if ( localStorage.getItem("dictionaryNotes")) {
        $("[data-code=dictionary]").val(localStorage.getItem("dictionaryNotes"));
      }
    };

// Editor
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
  mode: "text/html",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: true,
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  paletteHints: true
});
Inlet(htmlEditor);
emmetCodeMirror(htmlEditor);
htmlEditor.on("change", function() {
  if ( $(".codelessons[data-view=code]").is(":visible") ) {
    $(".lessons-container").html( htmlEditor.getValue() );
    localStorage.setItem("lessonFlyers", $(".lessons-container").html());

    $(".lessons-container a").on("click", function(e) {
      e.preventDefault();
    });
  } else if ( $(".codenotes[data-view=notesCode]").is(":visible") ) {
    $("[data-edit=notes]").html( htmlEditor.getValue() );
    localStorage.setItem("lessonNotes", $("[data-edit=notes]").html());
  }
});

// Clear all saved data
$("[data-clear=storage]").click(function() {
  alertify.confirm("<h2>Are you sure you want to start new?</h2> <h2 style='font-size: 17px;'>None of your changes will be saved!</h2>",
    function(e) {
      if (e) {
        localStorage.clear();
        location.reload(true);
      } else {
        // User clicked cancel
        return false;
      }
    });
});

// Notes
$(function() {
  $("[data-add=notes]").click(function() {
    // No editable elements
    $(this).toggleClass("active");
    $(".notes-container-fill").toggle();

    if ($(this).hasClass('active')) {
      if ( $(".codelessons[data-view=code]").is(":visible") ) {
        $("[data-view=code]").trigger("click");
      }
      if ( $(".active[data-add=dictionary]").is(":visible") ) {
        $("[data-add=dictionary]").trigger("click");
      }
      $(".hold-buttons button").not("[data-add=notes]").hide();
      $("[data-design=notes] button").css("display", "");
      $("[data-design=notes]").removeClass("hide");
      $("[data-edit=notes]").attr("contentEditable", "true");
      htmlEditor.setValue( $("[data-edit=notes]").html() );
      beautifyHTML(htmlEditor);
      htmlEditor.refresh();
    } else {
      $(".hold-buttons button").not("[data-add=notes], [data-design=lesson]").css("display", "");
      $("[data-design=notes] button").hide();
      $("[data-design=notes]").addClass("hide");
      $("[data-edit=notes]").removeAttr("contentEditable");
      if ( $("[data-view=notesCode]").hasClass("active") ) {
        $("[data-view=notesCode]").trigger("click");
      }
    }
  });
  $("[data-edit=notes]").on("keyup", function() {
    localStorage.setItem("lessonNotes", $("[data-edit=notes]").html());
    return false;
  });
  $("[data-view=notesCode]").click(function() {
    $(this).toggleClass("active");
    $(this).toggleClass("codenotes");
    $(".code-container-fill").toggle();

    htmlEditor.setValue( $("[data-edit=notes]").html() );
    beautifyHTML(htmlEditor);
  });
  // Undo
  $("[data-action=undo]").click(function() {
    document.execCommand("undo", false, true);
  });
  // Redo
  $("[data-action=redo]").click(function() {
    document.execCommand("redo", false, true);
  });
  // H1
  $("[data-action=h1]").click(function() {
    var value = window.getSelection();
    document.execCommand("insertHTML", true, "<h1 class=\"headline-primary--grouped txtcenter\">"+ value +"</h1>");
  });
  // H2
  $("[data-action=h2]").click(function() {
    var value = window.getSelection();
    document.execCommand("insertHTML", true, "<h2 class=\"headline-secondary--grouped modintoh2\">"+ value +"</h2>");
  });
  // Bold Head
  $("[data-action=boldhead]").click(function() {
    var value = window.getSelection();
    document.execCommand("insertHTML", true, "<b class=\"bold-heading\">"+ value +"</b>");
  });
  // Bold
  $("[data-action=bold]").click(function() {
    document.execCommand("bold", false, true);
  });
  // Paragraph
  $("[data-action=paragraph]").click(function() {
  //  document.execCommand("insertParagraph", false, true);
    var value = window.getSelection();
    document.execCommand("insertHTML", true, "<p>"+ value +"</p>");
  });
  // Italic
  $("[data-action=italic]").click(function() {
    document.execCommand("italic", false, true);
  });
  // Underline
  $("[data-action=underline]").click(function() {
    document.execCommand("underline", false, true);
  });
  // Strikethrough
  $("[data-action=strikethrough]").click(function() {
    document.execCommand("strikeThrough", false, true);
  });
  // Image
  $("[data-action=image]").click(function() {
    var imgSrc = prompt("Enter image location!", "");
    if (imgSrc != null) { 
      document.execCommand("insertImage", false, imgSrc);
    }
  });
  // Link
  $("[data-action=link]").click(function() {
    var linkURL = prompt("Enter the url for this link!", "http://");
    document.execCommand("createLink", false, linkURL);
  });
  // Unlink
  $("[data-action=unlink]").click(function() {
    document.execCommand("unlink", false, true);
  });
});

// Call functions onload
$(document).ready(function() {
  // Make editable properties active
  $("[data-set=editable]").attr("contenteditable", "true");

  // Re-add Skills with proper length
  var totalLessons = $(".lesson-flyer").length;
  $(".lesson-flyer").each(function(index) {
    var count = index + 1;
    $(this).find("h2").text("Lesson " + count + " / " + totalLessons);

    $(this).find("a.gotolesson").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/lesson"+ count +".html");
    $(".lesson-note").find("a").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/notes.html");
    $(".lesson-chat").find("a").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/chat.html");
  });
  
  // Delete and Edit/Design Lessons
  storeValues();
  deleteLessons();
});

// Make editable properties active
$(".lessons-container a").on("click", function(e) {
  e.preventDefault();
});

// Refresh Skill Name Variable
$("[data-skill=name]").on("keyup", function() {
  skillName = this.textContent;
});

// Edit Lesson Name
$("[data-set=editable]").on("keyup", function() {
  localStorage.setItem("lessonFlyers", $(".lessons-container").html());
});

// Display Skill Code
$("[data-view=code]").click(function() {
  // No editable elements
  $("[data-edit=lesson]").remove();
  $("[data-delete=lesson]").remove();
  var lessonPrev = $("[data-place=lesson]").find(".lesson-preview");
  lessonPrev.removeAttr("data-set").removeAttr("contentEditable");

  $(this).toggleClass("active");
  $(this).toggleClass("codelessons");
  $(".code-container-fill").toggle();
  
  if ($(this).hasClass('active')) {
    var lessonCode = '<div class="lessons-container txtcenter">' + $(".lessons-container").html().toString() + '</div>';
    // var skillCode  = "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ langApp + ": "+ skillName +"</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n    <link rel=\"stylesheet\" href=\"../css/style.css\" />\n    <script src=\"../libraries/jquery/jquery.js\"></script>\n    <script src=\"../libraries/alertify/alertify.min.js\"></script>\n  </head>\n  <body>\n    "+ lessonCode +"\n    \n    <script src=\"../js/lessons.js\"></script>\n  </body>\n</html>";
    var skillCode = $(".lessons-container").html().toString();
    if ( $("[data-view=notesCode]").hasClass("active") ) {
      $("[data-view=notesCode]").trigger("click");
    }
    if ( $(".active[data-add=dictionary]").is(":visible") ) {
      $("[data-add=dictionary]").trigger("click");
    }
    htmlEditor.setValue(skillCode);
    beautifyHTML(htmlEditor);
  } else {
    lessonPrev.attr("data-set", "editable");
    lessonPrev.attr("contentEditable", "true");
    $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-times deleteLesson' data-delete='lesson'></a>");
    // $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-edit editLesson' data-edit='lesson'></a>");
    $("[data-set=editable]").on("keyup", function() {
      localStorage.setItem("lessonFlyers", $(".lessons-container").html());
      return false;
    });
  }
});
$(".code-container-bg").click(function() {
  $("[data-view=code]").trigger("click");
});

// Delete Skill
$("[data-delete=skill]").on("click", function() {
  // alertify.log( $(this).parent().parent().attr("class") );
  // $(this).parent().remove();
  // $(this).parent().next().remove();
   $(this).parent().parent().remove();
});

// Add a Lesson
$("[data-add=lesson]").on("click", function() {
  counter++;
  totalLessons = 0;
  // var totalLessons = $(".lesson-flyer").length;
  var skillLesson = '<div class="lesson-flyer txtcenter">\n  <h2>Lesson '+ counter +' / '+ totalLessons +'</h2>\n\n  <p class="lesson-preview" data-set="editable">\n    name | name\n  </p>\n\n  <a class="btn--default gotolesson" href="javascript:void(0)">start</a>\n</div>\n\n';
  // Add Skill (need to fix heading)
  $("[data-place=lesson]").append(skillLesson);
  $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-times deleteLesson' data-delete='lesson'></a>");

  // Find Total Skills
  var totalLessons = $(".lesson-flyer").length;
  
  // Re-add Skills with proper length
  $(".lesson-flyer").each(function(index) {
    var count = index + 1;
    $(this).find("h2").text("Lesson " + count + " / " + totalLessons);

    $(this).find("a.gotolesson").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/lesson"+ count +".html");
    $(".lesson-note").find("a").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/notes.html");
    $(".lesson-chat").find("a").attr("href", "../lessons/"+ skillName.replace(" ", "").toLowerCase() +"/chat.html");

    // Make editable properties active
    $("[data-set=editable]").attr("contenteditable", "true");
  });
  deleteLessons();
  localStorage.setItem("lessonFlyers", $(".lessons-container").html());
  $("[data-set=editable]").on("keyup", function() {
    localStorage.setItem("lessonFlyers", $(".lessons-container").html());
  });
  return false;
});

// Design a Lesson
$("[data-design=lesson]").on("click", function() {
  $(this).hide();
  $(".designer-container-fill").addClass("hide");
});

// Dictionary of skill words
$("[data-add=dictionary]").click(function() {
  // No editable elements
  $(this).toggleClass("active");
  $(".dictionary-container-fill").toggle();
  
  if ($(this).hasClass('active')) {
    if ( $(".codelessons[data-view=code]").is(":visible") ) {
      $("[data-view=code]").trigger("click");
    }
  } else {
    
  }
});
$("[data-code=dictionary]").on("keyup", function() {
  localStorage.setItem("dictionaryNotes", $("[data-code=dictionary]").val());
});

// Download Skill
$("[data-download=skill]").click(function() {
  // No editable elements
  $("[data-edit=lesson]").remove();
  $("[data-delete=lesson]").remove();
  var lessonPrev = $("[data-place=lesson]").find(".lesson-preview");
  lessonPrev.removeAttr("data-set").removeAttr("contentEditable");
  
  // Get strings
  var skillCode = '<div class="lessons-container">' + $(".lessons-container").html().toString() + '</div>';
  var skillFull  = "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ langApp + ": "+ skillName +"</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n    <link rel=\"stylesheet\" href=\"../css/style.css\" />\n    <script src=\"../libraries/jquery/jquery.js\"></script>\n    <script src=\"../libraries/alertify/alertify.min.js\"></script>\n  </head>\n  <body>\n    "+ skillCode +"\n    \n    <script src=\"../js/lessons.js\"></script>\n  </body>\n</html>";
  htmlEditor.setValue(skillFull);
  beautifyHTML(htmlEditor);
  skillCode = htmlEditor.getValue();

  var notesCode = $("[data-edit=notes]").html().toString();
  var noteFull = '<!DOCTYPE html>\n<html>\n  <head>\n    <title>'+ langApp + ': '+ skillName +' Tips and Notes</title>\n    <meta charset="utf-8">\n    <meta name="viewport" content="initial-scale=1.0">\n    <meta http-equiv="X-UA-Compatible" content="IE=9" />\n    <link rel="stylesheet" href="../../css/style.css" />\n    <script src="../../libraries/jquery/jquery.js"></script>\n    <script src="../../libraries/alertify/alertify.min.js"></script>\n  </head>\n  <body>\n    <div class="underline-links">\n      <h4 id="type" class="grid">&nbsp;</h4>\n\n      <div class="breakword grid" style="background-color: #fefff6; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.1);">\n        <div class="centered grid__col--12" style="padding: 0 calc(100vw - 100%);">\n'+ notesCode +'        </div>\n      </div>\n      <p>&nbsp;</p>\n      <p>&nbsp;</p>\n    </div>\n\n    <a onclick="history.back()" class="goback pointer">\n      <i class="fa fa-chevron-left"></i>\n    </a>\n  </body>\n</html>';
  htmlEditor.setValue(noteFull);
  beautifyHTML(htmlEditor);
  noteFull = htmlEditor.getValue();

  var chatCode = "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ langApp + ": "+ skillName +" Chat</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\">\n    <link rel=\"stylesheet\" href=\"../../css/chat.css\">\n    <script src=\"../../libraries/jquery/jquery.js\"></script>\n    <script src=\"../../libraries/alertify/alertify.min.js\"></script>\n    <script src=\"../../js/responsivevoice.js\"></script>\n  </head>\n  <body>\n    <div class=\"contact-bar\">\n      <!--Contact Gender MUST be male or female-->\n      <i class=\"contact-pic fa fa-user\"></i> <span data-gender=\"male\">Michael Khoury</span>\n    </div>\n    \n    <div class=\"chat-container\">\n      <div class=\"chat-history\">\n        <!--\n          Bot talks, you talk, bot talks, you talk...\n          That's how the app is configured.\n          Chat ends when the bot says goodbye, followed by your goodbye response.\n        -->\n        \n        <div class=\"them msg\">\n          <p class=\"message\" data-meaning=\"Welcome!\">Welcome!</p>\n        </div>\n        <div class=\"tar you msg hide\">\n          <p class=\"message\" data-meaning=\"Hello!\">Hello!</p>\n        </div>\n        <div class=\"them msg hide\">\n          <p class=\"message\" data-meaning=\"My name is ...\">My name is ...</p>\n        </div>\n        <div class=\"tar you msg hide\">\n          <p class=\"message\" data-meaning=\"Nice to meet you\">Nice to meet you</p>\n        </div>\n        <div class=\"them msg hide\">\n          <p class=\"message\" data-meaning=\"Thanks you too\">Thanks you too</p>\n        </div>\n        <div class=\"tar you msg hide\">\n          <p class=\"message\" data-meaning=\"How are you?\">How are you?</p>\n        </div>\n        <div class=\"them msg hide\">\n          <p class=\"message\" data-meaning=\"I'm good and you?\">I'm good and you?</p>\n        </div>\n        <div class=\"tar you msg hide\">\n          <p class=\"message\" data-meaning=\"I'm good. Thank you!\">I'm good. Thank you!</p>\n        </div>\n        <div class=\"them msg hide\">\n          <p class=\"message\" data-meaning=\"Goodbye\">Goodbye</p>\n        </div>\n        <div class=\"tar you msg hide\">\n          <p class=\"message\" data-meaning=\"Goodbye\">Goodbye</p>\n        </div>\n        <div class=\"them msg hide\">\n          <p class=\"message\"></p>\n        </div>\n      </div>\n      \n      <div class=\"them typingloader hide\">\n        <div class=\"message\">\n          <div class=\"typing\">\n            <div class=\"load1\"></div>\n            <div class=\"load2\"></div>\n            <div class=\"load3\"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \n    <!--Hold shift for capital letters-->\n    <input type=\"checkbox\" id=\"shift\" class=\"hide\">\n    \n    <div class=\"bottom-bar\">\n      <div class=\"preview\">\n        <h1></h1>\n      </div>\n      <div class=\"keyboard notxtsel\">\n        <div>\n          <button>1</button>\n          <button>2</button>\n          <button>3</button>\n          <button>4</button>\n          <button>5</button>\n          <button>6</button>\n          <button>7</button>\n          <button>8</button>\n          <button>9</button>\n          <button>0</button>\n        </div>\n        <div data-action=\"lowercasetxt\">\n          <div>\n            <button>q</button>\n            <button>w</button>\n            <button>e</button>\n            <button>r</button>\n            <button>t</button>\n            <button>y</button>\n            <button>u</button>\n            <button>i</button>\n            <button>o</button>\n            <button>p</button>\n            <button>a</button>\n          </div>\n          <div>\n            <button>s</button>\n            <button>d</button>\n            <button>f</button>\n            <button>g</button>\n            <button>h</button>\n            <button>j</button>\n            <button>k</button>\n            <button>l</button>\n            <button>z</button>\n            <button>x</button>\n            <button>c</button>\n          </div>\n          <div>\n            <button>v</button>\n            <button>b</button>\n            <button>n</button>\n            <button>m</button>\n            <button>#</button>\n            <button>'</button>\n            <button>,</button>\n            <button>.</button>\n            <button>!</button>\n            <button>?</button>\n            <label for=\"shift\" class=\"ignore\">\n              shift\n            </label>\n          </div>\n        </div>\n        <div class=\"hide\" data-action=\"uppercasetxt\">\n          <div>\n            <button>Q</button>\n            <button>W</button>\n            <button>E</button>\n            <button>R</button>\n            <button>T</button>\n            <button>Y</button>\n            <button>U</button>\n            <button>I</button>\n            <button>O</button>\n            <button>P</button>\n            <button>A</button>\n          </div>\n          <div>\n            <button>S</button>\n            <button>D</button>\n            <button>F</button>\n            <button>G</button>\n            <button>H</button>\n            <button>J</button>\n            <button>K</button>\n            <button>L</button>\n            <button>Z</button>\n            <button>X</button>\n            <button>C</button>\n          </div>\n          <div>\n            <button>V</button>\n            <button>B</button>\n            <button>N</button>\n            <button>M</button>\n            <button>#</button>\n            <button>'</button>\n            <button>,</button>\n            <button>.</button>\n            <button>!</button>\n            <button>?</button>\n            <label for=\"shift\" class=\"ignore\">\n              shift\n            </label>\n          </div>\n        </div>\n        <div>\n          <button class=\"spacebar\"> </button>\n        </div>\n      </div>\n    </div>\n\n    <script src=\"../../js/chat.js\"></script>\n  </body>\n</html>";
  
  // Download code
  var fileName = $("[data-skill=name]").text().replace(" ", "").toLowerCase();
  //blob = new Blob([ skillCode ], {type: "text/html"});
  //saveAs(blob, fileName + ".html");
  var redirectCode = '<script>\n  location.href = "../../skills/'+ fileName +'.html"\n</script>';
  
  var zip = new JSZip();
  var skills = zip.folder("skills");
  skills.file(fileName + ".html", skillFull);
  zip.file("lessons/" + fileName + "/index.html", redirectCode);
  zip.file("lessons/" + fileName + "/notes.html", noteFull);
  zip.file("lessons/" + fileName + "/chat.html", chatCode);
  zip.file("lessons/" + fileName + "/dictionary.txt", $("[data-code=dictionary]").val());
  var content = zip.generate({type:"blob"});
  saveAs(content, fileName + ".zip");
  
  // Set elements back to default.
  lessonPrev.attr("data-set", "editable");
  lessonPrev.attr("contentEditable", "true");
  $("[data-place=lesson]").find(".lesson-flyer").prepend("<a class='pointer fa fa-times deleteLesson' data-delete='lesson'></a>");
});

// Mousewhell for Designer's Horizontal Scrollbar
(function() {
  function scrollDesign(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('designscroll').scrollLeft -= (delta*40); // Multiplied by 40
    return false;
  }
  if (document.getElementById('designscroll').addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.getElementById('designscroll').addEventListener('mousewheel', scrollDesign, false);
    // Firefox
    document.getElementById('designscroll').addEventListener('DOMMouseScroll', scrollDesign, false);
  } else {
    // IE 6/7/8
    document.getElementById('designscroll').attachEvent('onmousewheel', scrollDesign);
  }
  
  function scrollMenu(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('notesmenu').scrollLeft -= (delta*40); // Multiplied by 40
    return false;
  }
  if (document.getElementById('notesmenu').addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.getElementById('notesmenu').addEventListener('mousewheel', scrollMenu, false);
    // Firefox
    document.getElementById('notesmenu').addEventListener('DOMMouseScroll', scrollMenu, false);
  } else {
    // IE 6/7/8
    document.getElementById('notesmenu').attachEvent('onmousewheel', scrollMenu);
  }
})();