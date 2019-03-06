"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Greetings = function () {
	function Greetings() {
		_classCallCheck(this, Greetings);
	}

	_createClass(Greetings, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_greetings";

			this.greetings = [];
			this.greetings_lookup = new Map();

			this.hour = new Date().getHours();

			this.show_for_guests = true;

			this.$welcome = null;

			this.setup();

			if ((pb.data("user").is_logged_in || !pb.data("user").is_logged_in && this.show_for_guests) && this.greetings.length > 0) {
				this.build_table();

				$(this.ready.bind(this));
			}
		}
	}, {
		key: "ready",
		value: function ready() {
			this.$welcome = $("#welcome span");

			// Check to see if the welcome element exists

			if (this.$welcome.length == 0) {

				// Could be a guest, if so, there is no span.

				if ($("#welcome").length > 0) {
					this.$welcome = $("#welcome");
				} else {
					return;
				}
			}

			// Check the hour is in the lookup and then pick a random greeting for that hour.

			var greetings = this.greetings_lookup.get(this.hour);

			if (greetings != null && Array.isArray(greetings) && greetings.length > 0) {

				// Remove "Welcome " from the span. Only do this if we have a greeting.

				this.remove_welcome();

				// Get random greeting for this hour.

				var greeting = greetings[Math.floor(Math.random() * greetings.length)];

				this.$welcome.prepend("<span class='greeting'>" + greeting + "</span> ");
			}
		}

		// Remove "Welcome," from the span.

	}, {
		key: "remove_welcome",
		value: function remove_welcome() {

			// Need to be a little careful, because the name may contain the default greeting and
			// it may not be english.

			if (this.$welcome != null) {
				var html = this.$welcome.html();

				if (html.match(new RegExp("^(.+? )" + pb.data("user").name + "\.", "m"))) {
					this.$welcome.html(html.replace(RegExp.$1, ""));
				}
			}
		}

		// Here we build a lookup table for each hour.  The plugin supports different greetings for the same
		// hour, but will choose a random one for that hour. We make a lookup table so they are all grouped up per hour.

	}, {
		key: "build_table",
		value: function build_table() {
			for (var i = 0; i < this.greetings.length; ++i) {
				var hour = parseInt(this.greetings[i].hour, 10);

				if (!this.greetings_lookup.has(hour)) {
					this.greetings_lookup.set(hour, []);
				}

				this.greetings_lookup.get(hour).push(this.greetings[i].greeting);
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				this.greetings = plugin.settings.greetings;
				this.show_for_guests = parseInt(plugin.settings.show_for_guests, 10) == 1 ? true : false;
			}
		}
	}]);

	return Greetings;
}();


Greetings.init();