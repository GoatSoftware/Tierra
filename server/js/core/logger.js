(function() {
  var Logger = function() {
    var self = this;
    var conn = null;

    self.info = info;
    self.warn = warn;
    self.error = error;
    self.log = log;

    function info(message) {
      console.info(message);
    }

    function warn(message) {
      console.warn(message);
    }

    function error(message) {
      console.error(message);
    }

    function log(message) {
      console.log(message);
    }

  };

  module.exports = Logger;
}());
