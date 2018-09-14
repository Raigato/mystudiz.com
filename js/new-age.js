(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  $('.carousel').carousel({
    interval: 2000
  })

  // Android Subscribe Handling
  $('.android-form-message').hide()

  $('.androidForm').submit(function(e) {
    var $this = $(this);
    $.ajax({
        type: "GET", // GET & url for json slightly different
        url: "http://mystudiz.us19.list-manage.com/subscribe/post-json?c=?",
        data: $this.serialize(),
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        error       : function(err) { alert("Could not connect to the registration server."); },
        success     : function(data) {
          if (data.result != "success") {
            $('.android-form-message').addClass("badge badge-danger")
            $('.android-form-message').html(data.msg)
          } else {
            $('.android-form-message').html("<h2>Thank you for subscribing!<br/>Getting back to you soon 😉</h2>")
            $('.android-form-message').removeClass("badge badge-danger")
            $('.subscribe-form').hide()
          }
          $('.android-form-message').show()
        }
    });
    return false;
  });

})(jQuery); // End of use strict
