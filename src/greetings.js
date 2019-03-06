class Greetings {

	static init(){
		this.PLUGIN_ID = "pd_greetings";

		this.greetings = [];
		this.greetings_lookup = new Map();

		this.hour = (new Date().getHours());

		this.show_for_guests = true;

		this.$welcome = null;

		this.setup();

		if((pb.data("user").is_logged_in || (!pb.data("user").is_logged_in && this.show_for_guests)) && this.greetings.length > 0){
			this.build_table();

			$(this.ready.bind(this));
		}
	}

	static ready(){
		this.$welcome = $("#welcome span");

		// Check to see if the welcome element exists

		if(this.$welcome.length == 0){

			// Could be a guest, if so, there is no span.

			if($("#welcome").length > 0){
				this.$welcome = $("#welcome");
			} else {
				return;
			}
		}

		// Check the hour is in the lookup and then pick a random greeting for that hour.

		let greetings = this.greetings_lookup.get(this.hour);

		if(greetings != null && Array.isArray(greetings) && greetings.length > 0){

			// Remove "Welcome " from the span. Only do this if we have a greeting.

			this.remove_welcome();

			// Get random greeting for this hour.

			let greeting = greetings[Math.floor(Math.random() * greetings.length)];

			this.$welcome.prepend("<span class='greeting'>" + greeting + "</span> ");
		}
	}

	// Remove "Welcome," from the span.

	static remove_welcome(){

		// Need to be a little careful, because the name may contain the default greeting and
		// it may not be english.

		if(this.$welcome != null){
			let html = this.$welcome.html();

			if(html.match(new RegExp("^(.+? )" + pb.data("user").name + "\.", "m"))){
				this.$welcome.html(html.replace(RegExp.$1, ""));
			}
		}
	}

	// Here we build a lookup table for each hour.  The plugin supports different greetings for the same
	// hour, but will choose a random one for that hour. We make a lookup table so they are all grouped up per hour.

	static build_table(){
		for(let i = 0; i < this.greetings.length; ++ i){
			let hour = parseInt(this.greetings[i].hour, 10);

			if(!this.greetings_lookup.has(hour)){
				this.greetings_lookup.set(hour, []);
			}

			this.greetings_lookup.get(hour).push(this.greetings[i].greeting);
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.greetings = plugin.settings.greetings;
			this.show_for_guests = (parseInt(plugin.settings.show_for_guests, 10) == 1)? true : false;
		}
	}

}