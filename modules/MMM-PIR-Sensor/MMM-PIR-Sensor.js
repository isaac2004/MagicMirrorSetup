/* global Module */

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register("MMM-PIR-Sensor", {
  requiresVersion: "2.1.0",
  defaults: {
    sensorPin: 22,
    sensorState: 1,
    relayPin: false,
    relayState: 1,
    alwaysOnPin: false,
    alwaysOnState: 1,
    alwaysOffPin: false,
    alwaysOffState: 1,
    powerSaving: true,
    powerSavingDelay: 0,
    powerSavingNotification: false,
    powerSavingMessage: "Monitor will be turn Off by PIR module"
  },

  // Override socket notification handler.
  socketNotificationReceived: function(notification, payload) {},

  notificationReceived: function(notification, payload) {
    if (notification === "TURN_ON_DISPLAY") {
      this.sendSocketNotification(notification, payload);
    } else if (notification === "TURN_OFF_DISPLAY") {
      this.sendSocketNotification(notification, payload);
    }
  },

  start: function() {
    this.sendSocketNotification("CONFIG", this.config);
    Log.info("Starting module: " + this.name);
  }
});
