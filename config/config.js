/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */
var config = {
	address:
		"localhost", // Address to listen on, can be:
	// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	// - another specific IPv4/6 to listen on a specific interface
	// - "", "0.0.0.0", "::" to listen on any interface
	// Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: [
		"127.0.0.1",
		"::ffff:127.0.0.1",
		"::1"
	], // Set [] to allow all IP addresses
	// or add a specific IPv4 of 192.168.1.5 :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language:
		"en",
	timeFormat: 12,
	units:
		"imperial",

	modules: [
		{
			module:
				"alert"
		},
		{
			module:
				"updatenotification",
			position:
				"top_bar"
		},
		{
			module:
				"clock",
			position:
				"top_left"
		},
		{
			//disabled:true,
			module:
				"MMM-CalendarExt",
			position:
				"top_center",
			config: {
				show: true,
				system: {
					show: [
						"daily",
						"upcoming"
					],
					locale:
						"en",
					redrawInterval: 60000
				},
				views: {
					daily: {
						position:
							"bottom_bar",
						timeFormat:
							"h:mm A",
						counts: 28
					},
					upcoming: {
						position:
							"top_left",
						limit: 5
					}
				},
				defaultCalendar: {
					maxEntries: 50,
					maxDays: 180,
					interval:
						1000 *
						60 *
						5
				},
				calendars: [
					{
						symbol:
							"calendar-o",
						oneLineEvent: 1,
						url:
							"Public ICS Url of Calendar"
					}
				]
			}
		},

		{
			module:
				"currentweather",
			position:
				"top_right",
			config: {
				location:
					"Norwalk",
				locationID:
					"4839822", //ID from http://bulk.openweathermap.org/sample/; unzip the gz file and find your city
				appid:
					"App Id obtained from https://openweathermap.org"
			}
		},
		{
			module:
				"weatherforecast",
			position:
				"top_right",
			header:
				"Weather Forecast",
			config: {
				location:
					"Norwalk",
				locationID:
					"4839822", //ID from https://openweathermap.org/city
				appid:
					"App Id obtained from https://openweathermap.org"
			}
		},
		{
			module:
				"MMM-Voice-Commands",
			config: {
				debug: false, //Displays end results and errors from annyang in the Log
				autoStart: true, //Adds annyang commands when it first starts
				activateCommand:
					"hello mirror", //Command to active all other commands
				deactivateCommand:
					"goodbye mirror", //Command to deactivate all other commands
				alertHeard: true, //Whether an alert should be shown when annyang hears a phrase (mostly for debug)
				commands: {
					"command statement :variable (optional statement)":
						"SOCKET_NOTIFICATION_NAME",
					//The payload of the socket notification will be whatever is said in the :variable
					"command statement *variable": function(
						param
					) {
						alert(
							"Whatever is said in the *variable space is given as the " +
								param
						);
						//These function's 'this' are bound to the module's 'this' so you can do stuff like:
						this.sendNotification(
							"PAGE_SELECT",
							"2"
						);
					}
				}
			}
		},
		{
			module:
				"MMM-GoogleMapsTraffic",
			position:
				"fullscreen_above",
			config: {
				key:
					"Api Key obtained from https://developers.google.com/maps/documentation/javascript/get-api-key",
				lat: 41.111987, // this is lat of Norwalk, CT where I am from, change to lat of your location
				lng: -73.418425, // this is long of Norwalk, CT where I am from, change to long of your location
				height:
					"1910px", //Height Res of my monitor, please change to whatever you want
				width:
					"100%",
				styledMapType:
					"standard",
				disableDefaultUI: true,
				zoom: 15
			}
		},
		{
			module:
				"MMM-Cocktails",
			position:
				"middle_center", // Editable footprint - Fits anywhere.
			config: {
				animationSpeed: 1000
			}
		},
		{
			module:
				"MMM-SingleStock",
			position:
				"top_center",
			config: {
        token: "Your Token from https://iextrading.com/"
				show: true,
				stockSymbol:
					"MSFT",
				updateInterval: 3600000, // 1 hour in milliseconds
				showChange: true // false | true
			}
		},
		{
			module:
				"MMM-PIR-Sensor",
			config: {}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
