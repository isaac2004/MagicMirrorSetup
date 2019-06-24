Module.register("MMM-Voice-Commands", {
  defaults: {
    debug: false, //Displays end results and errors from annyang in the Log
    autoStart: true, //Adds annyang commands when it first starts
    activateCommand: "hello mirror", //Command to active all other commands
    deactivateCommand: "goodbye mirror", //Command to deactivate all other commands
    alertHeard: false, //Wether an alert should be shown when annyang hears a phrase (mostly for debug)
    commands: {
      "socket test :payload": "TEST_SOCKET",
      "function test :payload": function(payload) {
        alert("Test: " + payload);
      } //in these functions 'this' is bound to the module so this.sendNotification() is valid
    }
  },

  start: function() {
    this.rawCommands = this.config.commands;
    this.autoStart = this.config.autoStart;
    this.activateCommand = this.config.activateCommand;
    this.deactivateCommand = this.config.deactivateCommand;
    this.alertHeard = this.config.alertHeard;
    this.debug = this.config.debug;

    this.commands = {};
    this.active = false;

    this.initAnnyang();
  },
  notificationReceived: function(notification, payload) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("START", {
        config: this.config,
        modules: this.modules
      });
    } else if (notification === "REGISTER_VOICE_MODULE") {
      if (
        Object.prototype.hasOwnProperty.call(payload, "mode") &&
        Object.prototype.hasOwnProperty.call(payload, "sentences")
      ) {
        this.modules.push(payload);
      }
    }

    if (notification === "DOM_OBJECTS_CREATED") {
      this.hideModules(false);
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.hideModules(false);
    }
  },

  hideModules: function(all) {
    MM.getModules().enumerate(module => {
      if (!module.config.show || all) {
        module.hide(1000);
      }
    });
  },

  initAnnyang: function() {
    const self = this;
    if (annyang) {
      //Iterate over commands list to create a valid annyang command object
      for (var key in self.rawCommands) {
        if (self.rawCommands.hasOwnProperty(key)) {
          //If the property is already a function, leave it that way. Otherwise assume it is a socket name
          if (typeof self.rawCommands[key] !== "function") {
            //Construct a valid function...
            function createCommand(socket) {
              return function(payload) {
                self.sendNotification(socket, payload);
              };
            }

            //...And then put it in the object
            self.commands[key] = createCommand(self.rawCommands[key]);
          } else {
            self.commands[key] = self.rawCommands[key].bind(self);
          }
        }
      }

      if (self.autoStart) {
        annyang.addCommands(self.commands);
        self.active = true;
      }

      const standardCommands = {};
      standardCommands[self.activateCommand] = function() {
        if (!self.active) {
          self.addCommands(self.commands);
          self.active = true;
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Activated"
          });
        } else {
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Already Active"
          });
        }
      };

      standardCommands[self.deactivateCommand] = function() {
        if (self.active) {
          self.removeCommands(self.commands);
          self.active = false;
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Deactivated"
          });
        } else {
          self.sendNotification("SHOW_ALERT", {
            type: "notification",
            title: "Voice Commands",
            message: "Already Deactivated"
          });
        }
      };

      annyang.addCommands(standardCommands);

      annyang.start();

      if (self.debug) {
        annyang.addCallback("result", function(e) {
          Log.log(e);
        });

        annyang.addCallback("error", function(e) {
          Log.log(e);
        });
      }

      // This is the code that I added to add a similar experience to Hello-Lucy
      if (self.alertHeard) {
        annyang.addCallback("result", function(e) {
          for (var i = 0; i < e.length; i++) {
            // Get First result from annyang, which will be closest speech match
            // Format notification into format to match MMM-HelloLucy
            var notification = e[i]
              .toUpperCase()
              .trim()
              .replace(" ", "_");

            // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to HIDE (I changed traffic to MAP)
            if (notification === "HIDE_MAP") {
              self.sendNotification("HIDE_MAP");
              break;
            }
            // Check if notification is requesting location
            else if (notification.indexOf("SHOW_MAP") > -1) {
              // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to SHOW Default location per config
              if (notification === "SHOW_MAP") {
                self.sendNotification("SHOW_MAP");
              }
              // MMM-Voice-Commands sends notification to MMM-GoogleMapsTraffic to SHOW passed location from voice
              else {
                var strippedPayload = notification
                  .replace("_", " ")
                  .substr(ind + 8, notification.length)
                  .trim();
                var location = st
                  .replace("of", "")
                  .trim()
                  .replace("for", "")
                  .trim();
                self.sendNotification("SHOW_MAP", location);
              }
              break;
            } else if (notification.indexOf("SHOW_COCKTAILS") > -1) {
              if (notification === "SHOW_COCKTAILS") {
                self.sendNotification("SHOW_COCKTAILS");
              } else {
                var strippedPayload = notification
                  .replace("_", " ")
                  .substr(ind + 14, notification.length)
                  .trim();
                var drink = st
                  .replace("of", "")
                  .trim()
                  .replace("for", "")
                  .trim();
                self.sendNotification("SHOW_COCKTAILS", drink);
              }
              break;
            } else if (notification === "HIDE_COCKTAILS") {
              self.sendNotification("HIDE_COCKTAILS");

              break;
            } else if (notification.indexOf("SHOW_STOCK") > -1) {
              if (notification === "SHOW_STOCK") {
                self.sendNotification("SHOW_STOCK");
              } else {
                var strippedPayload = notification
                  .replace("_", " ")
                  .substr(ind + 14, notification.length)
                  .trim();
                var stock = st
                  .replace("of", "")
                  .trim()
                  .replace("for", "")
                  .trim();
                self.sendNotification("SHOW_STOCK", stock);
              }
              break;
            } else if (notification === "HIDE_STOCK") {
              self.sendNotification("HIDE_STOCK");

              break;
            } else if (notification === "TURN_ON_DISPLAY") {
              self.sendNotification("TURN_ON_DISPLAY");
              break;
            } else if (notification === "TURN_OFF_DISPLAY") {
              self.sendNotification("TURN_OFF_DISPLAY");
              break;
            }
            //////////////////////////////////////////////////////////////////////////
            // if you want to add more custom voice handling, add more else ifs here
          }
        });
      }
    }
  },

  addCommands: function(commands) {
    annyang.abort();
    annyang.addCommands(commands);
    annyang.start();
  },

  removeCommands: function(commands) {
    annyang.abort();
    var test1 = typeof commands;
    var test2 = Array.isArray(commands);
    if (typeof commands === "object")
      annyang.removeCommands(
        Array.isArray(commands) ? commands : Object.keys(commands)
      );
    annyang.start();
  },

  getScripts: function() {
    return [this.file("js/annyang.min.js")];
  }
});
