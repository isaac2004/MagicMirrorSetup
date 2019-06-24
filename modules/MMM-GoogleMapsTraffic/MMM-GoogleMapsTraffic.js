/* global Module */

/* Magic Mirror
 * Module: MMM-GoogleMapsTraffic
 *
 * By Victor Mora
 * MIT Licensed.
 */

Module.register("MMM-GoogleMapsTraffic", {
  // Module config defaults
  defaults: {
    key: "",
    lat: "",
    lng: "",
    height: "300px",
    width: "300px",
    zoom: 10,
    mapTypeId: "roadmap",
    styledMapType: "standard",
    disableDefaultUI: true,
    updateInterval: 900000,
    backgroundColor: "rgba(0, 0, 0, 0)",
    loaded: false
  },

  getStyles: function() {
    return ["MMM-GoogleMapsTraffic.css"];
  },

  start: function() {
    var self = this;
    Log.info("Starting module: " + this.name);

    if (this.config.key === "") {
      Log.error("MMM-GoogleMapsTraffic: key not set!");
      return;
    }

    this.sendSocketNotification("MMM-GOOGLE_MAPS_TRAFFIC-GET", {
      style: this.config.styledMapType
    });

    setInterval(function() {
      this.updateDom();
    }, this.config.updateInterval);
  },

  updateMap: function(location) {
    var wrapper = document.getElementById("map");
    wrapper.className = "hidden";

    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: this.config.zoom,
      mapTypeId: this.config.mapTypeId,
      center: {
        lat: this.config.lat,
        lng: this.config.lng
      },
      styles: this.styledMapType,
      disableDefaultUI: this.config.disableDefaultUI,
      backgroundColor: this.config.backgroundColor
    });

    map.addListener("tilesloaded", function() {
      var wrapper = document.getElementById("map");
      wrapper.className = "visible";
      var spinner = document.getElementById("spinner");
      spinner.className = "hidden";
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    var geocoder = new google.maps.Geocoder();

    var address = location;
    this.geocodeAddress(address, geocoder, map);
  },

  geocodeAddress: function(location, geocoder, resultsMap) {
    if (location != undefined) {
      var address = location;
      geocoder.geocode({ address: address }, function(results, status) {
        if (status === "OK") {
          let pos = new google.maps.LatLng(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng()
          );
          resultsMap.setCenter(pos);
        } else {
        }
      });
    }
    var wrapper = document.getElementById("map");
    wrapper.className = "hidden";
    var spinner = document.getElementById("spinner");
    spinner.className = "visible";
  },
  getDom: function() {
    var lat = this.config.lat;
    var lng = this.config.lng;

    var parent = document.createElement("div");
    parent.style.height = this.config.height;
    parent.style.width = this.config.width;

    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "map");

    wrapper.style.height = this.config.height;
    wrapper.style.width = this.config.width;
    wrapper.className = "hidden";

    var spinner = document.createElement("div");
    spinner.setAttribute("id", "spinner");
    spinner.style.height = this.config.height;
    spinner.style.width = this.config.width;
    wrapper.className = "visible";
    spinner.innerHTML = "Loading Map...";

    var found = false;
    for (var i = 0; i < document.scripts.length; i++) {
      if (document.scripts[i].src.indexOf("googleapis") > -1) found = true;
    }

    if (!found) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" + this.config.key;
      script.setAttribute("defer", "");
      script.setAttribute("async", "");
      document.body.appendChild(script);
    }

    parent.appendChild(spinner);
    parent.appendChild(wrapper);
    return parent;
    //return wrapper;
  },
  ///////////////////// For use with Hello-Lucy /////////////////////////////////////////
  notificationReceived: function(notification, payload) {
    if (notification === "HIDE_MAP") {
      this.config.loaded = false;
      var wrapper = document.getElementById("map");
      wrapper.className = "hidden";
      this.hide();
    } else if (notification === "SHOW_MAP") {
      this.show(1000);
      this.updateMap(payload);
    }
  },

  // socketNotificationReceived from helper
  socketNotificationReceived: function(notification, payload) {
    if (notification === "MMM-GOOGLE_MAPS_TRAFFIC-RESPONSE") {
      this.styledMapType = payload.styledMapType;
      console.log = this.styledMapType;
      this.updateDom();
    }
  }
});
