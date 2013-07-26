(function () {

  /* Responder objects store responses to matched requests
  ---------------------------------------------------------*/

  function guardResponseNotSet(responder) {
    if( responder.__response_type )
      throw('Response for ' + responder.message + ' has already been set to ' + responder.__response_type + ' with ' + responder.__response_message)
  }

  Sockete.Responder = function (event_type, message) {
    this.event_type = event_type;
    this.message = message;
  }

  Sockete.Responder.prototype = {
    __response_type: null,
    __response_message: null,
    // Configuration API
    respond: function (message) {
      guardResponseNotSet(this);
      this.__response_type = 'message';
      this.__response_message = message;
      return this;
    },
    fail: function (message) {
      guardResponseNotSet(this);
      this.__response_type = 'close';
      this.__response_message = message;
      return this;
    },
    // Public methods
    match: function (request) {
      return request.request_type == this.event_type;
    },

    response: function (request) {
      var response_message;
      if (typeof this.__response_message === 'function') {
        response_message = this.__response_message(request.message);
      } else {
        response_message = this.__response_message;
      }
      return new Sockete.Response(request.client, this.__response_type, response_message);
    }
  }


})();
