"use strict";

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const exec = require("child_process").exec;

module.exports = NodeHelper.create({
  start: function() {},

  activateMonitor: function() {
    // If relays are being used in place of HDMI

    // Check if hdmi output is already on
    exec("/usr/bin/vcgencmd display_power").stdout.on("data", function(data) {
      if (data.indexOf("display_power=0") === 0)
        exec("/usr/bin/vcgencmd display_power 1", null);
    });
  },

  deactivateMonitor: function() {
    // If relays are being used in place of HDMI

    exec("/usr/bin/vcgencmd display_power 0", null);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "CONFIG") {
      const self = this;
      this.config = payload;
    } else if (notification === "TURN_ON_DISPLAY") {
      this.activateMonitor();
    } else if (notification === "TURN_OFF_DISPLAY") {
      this.deactivateMonitor();
    }
  }
});
