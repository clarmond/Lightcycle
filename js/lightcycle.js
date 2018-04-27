/* -----------------------------------------------------------------------------
  Plug-in Name : Light Cycle 
  
   Description : Used to quickly cycle through a large number of thumbnails

                 Based on the now defunct Cool Iris Flash plug-in. 
                 (See https://github.com/cooliris/embed-wall)

                 Inspired by the movie Tron.

       Author : Chad Armond

       Version : 0.0.0.0

       License : MIT License

 Documentation : <TBD>
----------------------------------------------------------------------------- */

/*
;(function(factory){
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module
		define(["$"], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory(require("$"));
	} else {
		// Browser globals
		factory($);
	}
}
*/
(function( $ ){
	$.fn.lightcycle = function(options) {
		var $this = this;

		// Define namespace
		var namespace = "lightcycle-";

		// Define default values
		var _defaults = {
			baseURLs: {
				content: "",
				link: "",
				thumbnail: ""
			},
			data: null,
			height: 600,
			rows: 0,
			source: null,
			thumbHeight: 150
		};

		var maxItems = 5000;

		// Read parameters into config object
		var config = $.extend(_defaults, options);

		// Define some local variables
		var buttonIntervalID;
		var dragEnd;
		var dragStart;
		var minLeft;

		// And let's begin
		init();

		/** 
		 * Initializes plug-in
		 * @private
		*/
		function init() {
			// Check parameters
			if ((config.data == null) && (config.source == null)) {
				console.error("No data provided to the script.");
				alert("Could not load images");
				return;
			}

			if (typeof config.height === 'string') {
				var heightString = config.height.toLowerCase();
				if ((heightString === 'viewport') ||
					(heightString === 'body') ||
					(heightString === 'window')) {
						config.height = $(window).height()	
				}
			}

			// Add overlay while building UI
			$.LoadingOverlay("show", {
				image: "data:image/png;base64,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",
				minSize: 64,
				maxSize: 64
			});

			// Set up container
			$this.addClass("lc-container");

			// Set up custom trigger
			$this.on(namespace + "data-loaded", build);

			// Check to see if data was provided or needs to be loaded
			if (config.data != null) {
				$.data($this, namespace, config.data);
				$this.trigger(namespace + "data-loaded");
			}
			else {
				loadData();
			}

			// Load cursometer
			$("body").cursometer({
				onUpdateSpeed: function(speed) { }
			});
		}

		/**
		 * Adds left and right buttons
		 * @private
		 */
		function addButtons() {
			//--- Set up left and right buttons
			$("body").append('<div id="lc-left-arrow" class="lc-arrow-button">&#9664;</div>');
			$("body").append('<div id="lc-right-arrow" class="lc-arrow-button">&#9654;</div>');

			var buttonTop = (($this.height() - $("#lc-left-arrow").outerHeight()) / 2) + $this.position().top;

			$("#lc-left-arrow").css("top", buttonTop);
			$("#lc-left-arrow").css("left", "10px");
			$("#lc-left-arrow").show();

			$("#lc-right-arrow").css("top", buttonTop);
			$("#lc-right-arrow").css("right", "10px");
			$("#lc-right-arrow").show();

			$("#lc-left-arrow").mousedown(function() {
				buttonIntervalID = setInterval(function() {
					var leftPosition = $this.position().left;
					if (leftPosition >= 0) {
						clearInterval(buttonIntervalID);
						buttonIntervalID = null;
						$this.finish().animate({left: 500}, 50).animate({left: 0}, 1000, 'easeOutElastic');
						return;
					}
					scrollImages(100, 0);
				}, 50);
			}).mouseup(function() {
				clearInterval(buttonIntervalID);
				if (buttonIntervalID != null) {
					buttonIntervalID = null;
					scrollImages(1000, 1500);
				}
			}).mouseleave(function() {
				clearInterval(buttonIntervalID);
				if (buttonIntervalID != null) {
					buttonIntervalID = null;
					scrollImages(1000, 1500);
				}
			});
	
			$("#lc-right-arrow").mousedown(function() {
				buttonIntervalID = setInterval(function() {
					var leftPosition = $this.position().left;
					if (leftPosition <= minLeft) {
						clearInterval(buttonIntervalID);
						buttonIntervalID = null;
						$this.finish().animate({left: minLeft + 500}, 50).animate({left: minLeft}, 1000, 'easeOutElastic');
						return;
					}
					scrollImages(-100, 0);
				}, 50);
			}).mouseup(function() {
				clearInterval(buttonIntervalID);
				if (buttonIntervalID != null) {
					buttonIntervalID = null;
					scrollImages(-1000, 1500);
				}
			}).mouseleave(function() {
				clearInterval(buttonIntervalID);
				if (buttonIntervalID != null) {
					buttonIntervalID = null;
					scrollImages(-1000, 1500);
				}
			});
		}


		/**
		 * Add images to container
		 * @private
		 * @param {Object} [args] Optional object of arguments.
		 * @param {Integer} [args.start] Starting index of loop.  Default is 1.
		 * @param {Integer} [args.end] Ending index of loop.  Default is length-1 of items array.
		 */
		function addImages (args) {
			var items = $.data($this, namespace).items;
			var startIndex = 0;
			var endIndex = items.length - 1;
			if (args != undefined) {
				if (args.start) startIndex = args.start;
				if (args.end) endIndex = args.end;
			}
			for (var i = startIndex; i <= endIndex; i = i + config.rows) {
				var html = "<div class='lc-column'>";
				for (var j = 0; j < config.rows; j++) {
					var itemNumber = i + j;
					if (items[itemNumber]) {
						var imageSource = config.baseURLs.thumbnail + items[itemNumber].thumbnail;
						var imageContent = config.baseURLs.content + items[itemNumber].content;
						var imageLink = config.baseURLs.link + items[itemNumber].link;
						var imageSize;
						if (items[itemNumber].size) {
							imageSize = items[itemNumber].size.match(/(\d{2,3})x(\d{2,3})/);
						}
						var imageTitle = HTMLEncode(items[itemNumber].title);
						var imageTitleWithLink = imageTitle + "<br><a href=\"" + imageLink + "\" target=\"blank\">View More</a>";
						html += "<div class='lc-image-container'>";
						html += "<span class='lc-helper'></span>";
						html += "<a href='" + imageContent + "' ";
						html += "title='" + imageTitle + "' ";
						html += "data-lightbox='gallery' data-title='" + imageTitleWithLink + "' ";
						html += "class='image-link' target='_blank'>";
						html += "<img ";
						if (imageSize != null) {
							html += "width='" + imageSize[1] + "' height='" + imageSize[2] + "' ";
						}
						// Load first 100 images automatically
						// Then lazy load the rest
						if (i <= 100) {
							html += "src='" + imageSource + "' ";
						}
						else {
							html += "class='lazyload' data-src='" + imageSource + "' ";
						}
						html += "></a></div>";
					}
				}
				html += "</div>";
				$this.append(html);
			}
		}

		/**
		 * Creates event handlers for key presses
		 * @private
		 */
		function addKeyHandlers() {
			$(document).keydown(function (event) {
				if ($(".lightboxOverlay").is(":visible")) {
					// Don't override gallery key presses
					event.preventDefault();
					return;
				}
				// Left arrow
				if (event.which == 37) {
					scrollImages(160, 250);
					event.preventDefault();
				}
				// Right arrow
				if (event.which == 39) {
					scrollImages(-160, 250);
					event.preventDefault();
				}
				// Home key
				if (event.which == 36) {
					scrollImages(-1 * $this.position().left, 1000);
					event.preventDefault();
				}
				// End key
				if (event.which == 35) {
					scrollImages(minLeft, 1000);
					event.preventDefault();
				}
			});
		}

		/**
		 * Builds UI
		 * @private
		 */
		function build() {
			// Retrieve data
			var data = $.data($this, namespace);

			// Height and width calculations
			$this.height(config.height);
			if (config.rows == 0) {
				config.rows = Math.floor($this.height() / 160);
			}
			//TODO: Need a better calculation for width
			$this.width(165 * data.items.length / config.rows);
			
			// Define base urls if defined
			if (data.config.base_urls) config.baseURLs = data.config.base_urls;

			// Add images to container
			addImages();

			// Set min left position
			// Note: This will need to change if we load in batches
			minLeft = 500 - $this.find("img").last().position().left;

			// Define dragabble
			$this.draggable({
				axis: "x",
				start: function(event, ui) {
					dragStart = $(this).position().left;
				},
				stop: function(event, ui) {
					var cursorSpeed = $("body").cursometer('getCurrentSpeed');
					var leftPosition = $this.position().left;
	
					// Calculate how far and fast to scroll
					dragEnd = leftPosition;
					var positionChange = dragEnd - dragStart;
					var leftDelta = positionChange * cursorSpeed;
					var animateTime = 2200 - positionChange;
	
					if (cursorSpeed > 0.05) {
						scrollImages(leftDelta, animateTime);
					}
				}
			});
		
			// Light box functionality
			lightbox.option({
				imageFadeDuration: 500,
				resizeDuration: 250,
				sanitizeTitle: false
			});

			//Enable lazy loading
			lazyload();

			//Add left and right buttons
			addButtons();

			//Capture key presses
			addKeyHandlers();

			// Hide overlay
			$.LoadingOverlay("hide");
		}

		/**
		 * HTML encodes less than, greater than, and quotes
		 * @private
		 * @param {String} str String to be encoded
		 * @returns {String} Encoded string
		 */
		function HTMLEncode(str) {
			if (typeof str === "string") {
				return str.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&apos;');
			}
			else {
				return ""
			}
		}

		/**
		 * Attempts to load data from config.source
		 * If it succeeds, triggers custom event "data-loaded"
		 * @private
		 */
		function loadData() {
			$.ajax({
				url: config.source,
				async: true,
				dataType: 'json',
				error: function (jqXHR, textStatus, errorThrown) {
					console.error("Could not load data from '" + config.source + "'");
					console.error("Error: ", errorThrown);
					$.LoadingOverlay("hide");
					alert("Could not load images");
				},
				success: function (data, textStatus, jqXHR) {
					var itemCount = data.items.length;
					if (itemCount > maxItems) {
						$.LoadingOverlay("hide");
						alert("Max number of images is " + maxItems.toString() + ".  This collection contains " + itemCount.toString() + " items.");
						return;
					}
					$.data($this, namespace, data);
					$this.trigger(namespace + "data-loaded");
					if (data.config.items) {
						if (data.items.length < data.config.items) {
							console.debug("Partial loading in affect");
							//Partial loading, so load rest in batches.
						}
					}
				}
			});
		}

		/**
		 * Scrolls images left or right
		 * @private
		 * @param {number} leftDelta How many pixels to scroll the images
		 * @param {number} animateTime Number of milliseconds to run the ending animation 
		 */
		function scrollImages (leftDelta, animateTime) {
			var leftPosition = $this.position().left;
			
			// If final location will be past the border,
			// then go to border and bounce back
			var finalLocation = leftPosition + leftDelta;

			if (finalLocation > 0) {
				$this.finish().animate({left: 0}, animateTime, 'easeOutElastic');
				return;
			}

			if (finalLocation < minLeft) {
				$this.finish().animate({left: minLeft}, animateTime, 'easeOutElastic');
				return;
			}

			// Animate scroll
			$this.finish().animate({left: "+=" + leftDelta}, animateTime, 'easeOutQuart');
		}

		return this;
	}
})( jQuery );


// Polyfill to fix Lazyload
(function () {
	if ( typeof NodeList.prototype.forEach === "function" ) return false;
	NodeList.prototype.forEach = Array.prototype.forEach;
})();
