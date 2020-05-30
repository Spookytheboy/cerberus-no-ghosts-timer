var time_now = 0;
var time_diff = 0;
var time_start = 0; 
var ghost_timer = 56; // default!
var time_remaining = ghost_timer;
var cancel_timer_flag = false;

var options = {
	sound: "bell",
	background: "none"
};

// sounds
let bell = document.getElementById("bell");

let justin   = document.getElementById("justin"); //new Audio('audio/Justin.mp3');
let justin_0 = document.getElementById("justin_0"); //new Audio('audio/Justin-0.mp3');
let justin_1 = document.getElementById("justin_1"); //new Audio('audio/Justin-1.mp3');
let justin_2 = document.getElementById("justin_2"); //new Audio('audio/Justin-2.mp3');
let justin_3 = document.getElementById("justin_3"); //new Audio('audio/Justin-3.mp3');
let justin_4 = document.getElementById("justin_4"); //new Audio('audio/Justin-4.mp3');
let justin_5 = document.getElementById("justin_5"); //new Audio('audio/Justin-5.mp3');

let liv   = document.getElementById("liv"); //new Audio('audio/Liv.mp3');
let liv_0 = document.getElementById("liv_0"); //new Audio('audio/Liv-0.mp3');
let liv_1 = document.getElementById("liv_1"); //new Audio('audio/Liv-1.mp3');
let liv_2 = document.getElementById("liv_2"); //new Audio('audio/Liv-2.mp3');
let liv_3 = document.getElementById("liv_3"); //new Audio('audio/Liv-3.mp3');
let liv_4 = document.getElementById("liv_4"); //new Audio('audio/Liv-4.mp3');
let liv_5 = document.getElementById("liv_5"); //new Audio('audio/Liv-5.mp3');

let russell   = document.getElementById("russell"); //new Audio('audio/Russell.mp3');
let russell_0 = document.getElementById("russell_0"); //new Audio('audio/Russell-0.mp3');
let russell_1 = document.getElementById("russell_1"); //new Audio('audio/Russell-1.mp3');
let russell_2 = document.getElementById("russell_2"); //new Audio('audio/Russell-2.mp3');
let russell_3 = document.getElementById("russell_3"); //new Audio('audio/Russell-3.mp3');
let russell_4 = document.getElementById("russell_4"); //new Audio('audio/Russell-4.mp3');
let russell_5 = document.getElementById("russell_5"); //new Audio('audio/Russell-5.mp3');

$( document ).ready(function() {

    $('button.start').on('click', function() {
    	timerStart();
    });

    $('button.cancel').on('click', function() {
    	if(time_start !== 0) {
    		timerReset();
    	}
    });

    $('button.options').on('click', function() {
    	if($('.options-menu').hasClass('hidden')) {

    		// display options
    		$('.options-menu').removeClass('hidden');

    		// disable cancel
    		disableCancel();

    		// disable start
    		disableStart();

    		// change option text to say "close options"
			$('button.options').html('Close Options');

    	} else {

    		// hide options
    		$('.options-menu').addClass('hidden');

    		// enable cancel
    		enableCancel();

    		// enable start
    		enableStart();

    		// change option text to say "options"
			$('button.options').html('Options');

    	}
    });

    $('button.popout').on('click', function() {
    	console.log('Popout triggered');
    	openPopOutWindow(`${window.location.href}`,'Cerb Timer Mini','400','600');
    });

    $('input[name="sound"]').on('click', function(e) {
    	playSoundProfile(this.value);
    	setSoundProfile(this.value);
    });

    $('input[name="background"]').on('click', function(e) {
    	setBackground(this.value);
    });

});

function openPopOutWindow(URL, windowName, windowWidth, windowHeight) {
	var centerLeft = (screen.width/2)-(windowWidth/2);
	var centerTop = (screen.height/2)-(windowHeight/2);
	var windowFeatures = 'toolbar=no, location=no, directories=no, status=no, menubar=no, titlebar=no, scrollbars=no, resizable=no, ';
	return window.open(URL, windowName, windowFeatures +' width='+ windowWidth +', height='+ windowHeight +', top='+ centerTop +', left='+ centerLeft);
}

function timerReset() {
	cancel_timer_flag = true;
}

function timerStart() {

	// grab start time
	getTime(function(response) {

		time_start = response;

		// disable "start" button to avoid confusion
		disableStart();

		// disable options menu
		disableOptions();

		// begin loop
		loopTimeRemaining();

		// track
		gtag('event', 'timerStarted', {
  			'event_category': 'timer events',
  			'event_label': 'timer start',
  			'value': 1
		});
	});
}

function loopTimeRemaining() {

	var refreshId = setInterval(function() {

		getTime(function(response) {

			time_now = response;

			time_diff = time_now - time_start;

			time_remaining = ghost_timer - time_diff;
			// console.log('time_remaining', time_remaining);

			if(time_remaining <= 0) {

				clearInterval(refreshId);
				resetDefaults();
				enableStart();
				enableOptions();

				playSoundEffect(0);

				// track
				gtag('event', 'timerCompleted', {
		  			'event_category': 'timer events',
		  			'event_label': 'timer completed',
		  			'value': 1
				});

				// track
				gtag('event', 'soundProfile', {
		  			'event_category': 'sound profiles',
		  			'event_label': options.sound,
		  			'value': 1
				});

			} else if(cancel_timer_flag == true) {

				clearInterval(refreshId);
				resetDefaults();
				enableStart();
				enableOptions();

			} else {

				updateTimeRemaining(time_remaining);

				if(time_remaining <= 5) {
					$('.time-remaining').addClass('red');
					playSoundEffect(time_remaining);
				}

			}
		});

	}, 1000);
}

function playSoundProfile(audioId) {
	if(audioId !== "none") {
		window[audioId].play();
	}
}

function setSoundProfile(audioId) {
	options.sound = audioId;
}

function setBackground(backgroundOption) {
	options.background = backgroundOption;
	$('body').css('background-color', backgroundOption);
}

function playSoundEffect(counter) {
	if(options.sound !== "bell") {
		window[options.sound + "_" + counter].play();
	} else if(options.sound == "bell" && counter == 0) {
		window[options.sound].play();
	}
}

function getTimeRemaining() {
	$.post("ajax.php", {
		action: "get_time",

	}).done(function(response) {
		time_diff = response - time_start;
		updateTimeRemaining(time_diff);

	});

	return true;
}

function enableStart() {
	$('button.start').removeAttr('disabled');
}

function disableStart() {
	$('button.start').attr('disabled', 'disabled');
}

function enableCancel() {
	$('button.cancel').removeAttr('disabled');
}

function disableCancel() {
	$('button.cancel').attr('disabled', 'disabled');
}

function enableOptions() {
	$('button.options').removeAttr('disabled');
}

function disableOptions() {
	$('button.options').attr('disabled', 'disabled');
}

function resetDefaults() {
	time_now = 0;
	time_diff = 0;
	time_start = 0; 
	time_remaining = ghost_timer;
	cancel_timer_flag = false;

	updateTimeRemaining(0);

	$('.time-remaining').removeClass('red');
}

function getTime(callback) {
	$.post("ajax.php", {
		action: "get_time",

	}).done(function(response) {
		return callback(response);
	});
}

function updateTimeRemaining(seconds_remaining) {
	$('.seconds-remaining').html(seconds_remaining);
}