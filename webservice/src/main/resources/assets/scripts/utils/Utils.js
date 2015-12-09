define(['require', 'bootstrap.notify'], function(require) {
  'use strict';

  var Utils = {};

  Utils.DBToDateObj = function(dbDate) {

    var dateObj = new Date(dbDate.toString());
    // If the above fails for some browser, try our own parse function
    if (isNaN(dateObj)) {
      dateObj = new Date(this.manualDateParse(dbDate.toString()));

    }
    return dateObj;
  };

  Utils.manualDateParse = function(date) {
    var origParse = Date.parse,
      numericKeys = [1, 4, 5, 6, 7, 10, 11];
    var timestamp, struct, minutesOffset = 0;

    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/
        .exec(date))) {
      // avoid NaN timestamps caused by “undefined” values being
      // passed to Date.UTC
      for (var i = 0, k;
        (k = numericKeys[i]); ++i) {
        struct[k] = +struct[k] || 0;
      }

      // allow undefined days and months
      struct[2] = (+struct[2] || 1) - 1;
      struct[3] = +struct[3] || 1;

      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];

        if (struct[9] === '+') {
          minutesOffset = 0 - minutesOffset;
        }
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4],
        struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
      timestamp = origParse ? origParse(date) : NaN;
    }

    return timestamp;
  };

  Utils.defaultErrorHandler = function(model, error) {
    if (error.status == 401) {
      throw new Error("ERROR 401 occured.\n You might want to change this error from here.");
      // window.location.href = "login.jsp" + location.hash;
    }
  };

  Utils.notifyError = function(message,from,align){
    $.notify({
      // options
      icon: 'fa fa-warning',
      message: message
    },{
      // settings
      element: 'body',
      position: null,
      type: 'danger',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement: {
        from: from ? from :"top",
        align: align ? align :"right"
      },
    });
  };

  Utils.notifySuccess = function(message,from,align){
    $.notify({
      // options
      icon: 'fa fa-check',
      message: message
    },{
      // settings
      element: 'body',
      position: null,
      type: 'success',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement: {
        from: from ? from :"top",
        align: align ? align :"right"
      },
    });
  };

  Utils.notifyInfo = function(message,from,align){
    $.notify({
      // options
      icon: 'fa fa-info',
      message: message
    },{
      // settings
      element: 'body',
      position: null,
      type: 'info',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement: {
        from: from ? from :"top",
        align: align ? align :"right"
      },
    });
  };

  Utils.expandPanel = function(e){
    var body = $('body');
    e.preventDefault();
    var box = $(e.currentTarget).closest('div.panel');
    var button = $(e.currentTarget).find('i');
    button.toggleClass('fa-expand').toggleClass('fa-compress');
    box.toggleClass('expanded');
    body.toggleClass('body-expanded');
    var timeout = 0;
    if (body.hasClass('body-expanded')) {
      timeout = 100;
      // box.removeClass('zoomOut');
      box.addClass('zoomIn');
    } else {
      box.removeClass('zoomIn');
      box.addClass('zoomOut');
      box.removeClass('zoomOut');
    }
    setTimeout(function () {
      box.toggleClass('expanded-padding');
    }, timeout);
    setTimeout(function () {
      box.resize();
      box.find('[id^=map-]').resize();
    }, timeout + 50);

  };

  Utils.panelMinimize = function(self){
    //Minimize
    self.$('.minimize').on('click', function() {
        $(this).parents('.panel').find('.panel-body').slideToggle();
        $(this).children().toggleClass("fa-minus fa-plus");
    });
  };

  Utils.uploadFile = function(restURL, data, successCallback, errorCallback){
    $.ajax({
        url: restURL,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: successCallback,
        error: errorCallback
      });
  };

  Utils.showError = function(model, response){
    var msg;
    if(typeof response === "string"){
      msg = model.responseJSON.responseMessage;
    } else if(response.responseJSON.responseMessage){
      msg = response.responseJSON.responseMessage;
    } else {
      msg = response.responseJSON.message;
    }
    Utils.notifyError(msg);
  };

  return Utils;
});