(function($, undefined) {
	'use strict';

	var tacky_property       = 'tacky' + new Date().getTime();
	var scrollbar_dimensions = scrollbarDimensions();
	var transform_property   = getPrefixedProperty('transform');
	var tacky_elements       = [];

	/**
	 * Initializes the core Tacky functionality
	 */
	function initializeTacky() {
		// Initialize the jQuery plugin
		if($) {
			$.fn.tacky = function() {
				return tacky(this);
			};
		}

		// If the transform property does not exist, we are done
		if(!transform_property) {
			return;
		}

		// Create a global stylesheet for some basic styling
		var global_style = [
			'.tacky-top,',
			'.tacky-right,',
			'.tacky-bottom,',
			'.tacky-left { position: relative; }',

			'.tacky-top { z-index: 1 !important; }',
			'.tacky-right { z-index: 2 !important; }',
			'.tacky-bottom { z-index: 2 !important; }',
			'.tacky-left { z-index: 1 !important; }',

			'.tacky-top.tacky-right { z-index: 3 !important; }',
			'.tacky-bottom.tacky-right { z-index: 4 !important; }',
			'.tacky-bottom.tacky-left { z-index: 4 !important; }',
			'.tacky-top.tacky-left { z-index: 3 !important; }',
		];

		var global_style_node = document.createElement('style');
		global_style_node.innerHTML = global_style.join('\n');
		document.head.appendChild(global_style_node);

		// Resizing the window will generally require recalculating the translations
		window.addEventListener('resize', function() {
			var elements = document.getElementsByClassName('tacky');

			for(var i = 0; i < elements.length; ++i) {
				updateTranslations(elements[i]);
			}
		});
	}

	/**
	 * Initialize an array elements as tacky elements
	 * @param  {Array}  elements The array of elements to initialize
	 * @return                   The elements passed in
	 */
	function tacky(elements) {
		if(transform_property) {
			var element_array = elements;
			if(element_array.length === undefined) {
				element_array = [element_array];
			}

			for(var i = 0; i < element_array.length; ++i) {
				initializeElement(element_array[i]);
			}
		}

		return elements;
	}

	/**
	 * Initializes an element as a tacky element
	 * @param {HTMLElement} element The HTML element to initialize
	 */
	function initializeElement(element) {
		if(!element[tacky_property]) {
			element[tacky_property] = true;
			element.addEventListener('scroll', function() {
				updateTranslations(element);
			});
		}

		updateTranslations(element);
	}


	/**
	 * Updates Tacky translations
	 * @param {HTMLElement} element The HTML element to update
	 */
	function updateTranslations(element) {
		var scroll_top            = element.scrollTop;
		var scroll_left           = element.scrollLeft;
		var scroll_right          = -element.scrollWidth + element.clientWidth + scroll_left;
		var scroll_bottom         = -element.scrollHeight + element.clientHeight + scroll_top;

		var top_elements          = element.getElementsByClassName('tacky-top');
		var left_elements         = element.getElementsByClassName('tacky-left');
		var right_elements        = element.getElementsByClassName('tacky-right');
		var bottom_elements       = element.getElementsByClassName('tacky-bottom');
		var top_right_elements    = element.getElementsByClassName('tacky-top tacky-right');
		var top_left_elements     = element.getElementsByClassName('tacky-top tacky-left');
		var bottom_right_elements = element.getElementsByClassName('tacky-bottom tacky-right');
		var bottom_left_elements  = element.getElementsByClassName('tacky-bottom tacky-left');

		setStyleProperty(top_elements, transform_property, 'translate(0, ' + scroll_top + 'px)');
		setStyleProperty(left_elements, transform_property, 'translate(' + scroll_left + 'px, 0)');
		setStyleProperty(right_elements, transform_property, 'translate(' + scroll_right + 'px, 0)');
		setStyleProperty(bottom_elements, transform_property, 'translate(0, ' + scroll_bottom + 'px)');

		setStyleProperty(top_right_elements, transform_property, 'translate(' + scroll_right + 'px, ' + scroll_top + 'px)');
		setStyleProperty(top_left_elements, transform_property, 'translate(' + scroll_left + 'px, ' + scroll_top + 'px)');
		setStyleProperty(bottom_right_elements, transform_property, 'translate(' + scroll_right + 'px, ' + scroll_bottom + 'px)');
		setStyleProperty(bottom_left_elements, transform_property, 'translate(' + scroll_left + 'px, ' + scroll_bottom + 'px)');

		(scroll_top === 0 ? addClass : removeClass)(top_elements, 'tacky-top-origin');
		(scroll_left === 0 ? addClass : removeClass)(left_elements, 'tacky-left-origin');
		(scroll_right === 0 ? addClass : removeClass)(right_elements, 'tacky-right-origin');
		(scroll_bottom === 0 ? addClass : removeClass)(bottom_elements, 'tacky-bottom-origin');
	}

	/**
	 * Sets a style property on elements
	 * @param {Array}  elements The HTML elements
	 * @param {String} property The property to set
	 * @param {String} value    The property's value
	 */
	function setStyleProperty(elements, property, value) {
		var element_count = elements.length;
		if(!element_count) {
			return;
		}

		for(var i = 0; i < element_count; ++i) {
			elements[i].style[property] = value;
		}
	}

	/**
	 * Adds a class to elements
	 * @param {Array}  elements   The HTML elements
	 * @param {String} class_name The class to add
	 */
	function addClass(elements, class_name) {
		var element_count = elements.length;
		if(!element_count) {
			return;
		}

		var regexp = new RegExp('(?:^|\\s)' + class_name + '(?!\\S)');

		// Check if the elements already have the class
		// Assume the first element represents all elements
		if(regexp.test(elements[0].className)) {
			return;
		}

		for(var i = 0; i < element_count; ++i) {
			elements[i].className += ' ' + class_name;
		}
	}

	/**
	 * Removes a class to elements
	 * @param {Array}  elements   The HTML elements
	 * @param {String} class_name The class to remove
	 */
	function removeClass(elements, class_name) {
		var element_count = elements.length;
		if(!element_count) {
			return;
		}

		var regexp = new RegExp('(?:^|\\s)' + class_name + '(?!\\S)', 'g');

		// Check if the elements have the class
		// Assume the first element represents all elements
		if(!regexp.test(elements[0].className)) {
			return;
		}

		for(var i = 0; i < element_count; ++i) {
			elements[i].className = elements[i].className.replace(regexp, '');
		}
	}

	/**
	 * Calculate the browser's scrollbar dimensions
	 * @return {Object} An object with a width and height property
	 */
	function scrollbarDimensions() {
		var size      = 100;
		var container = document.createElement('div');

		container.style.position   = 'absolute';
		container.style.visibility = 'hidden';
		container.style.top        = '-9999px';
		container.style.left       = '-9999px';
		container.style.width      = size + 'px';
		container.style.height     = size + 'px';
		container.style.overflow   = 'scroll';

		document.documentElement.appendChild(container);

		var dimensions = {
			width      : size - container.clientWidth,
			height     : size - container.clientHeight
		};

		document.documentElement.removeChild(container);

		return dimensions;
	}

	/**
	 * Determines the proper prefix for a given property
	 * @param  {String}      property   The property to look for
	 * @param  {Boolean}     hyphenated Set to true to return the hyphenated property for use within <style> tags
	 * @return {String|null}            The prefixed property or null if the property was not found
	 */
	function getPrefixedProperty(property, hyphenated) {
		var document_style     = document.documentElement.style;
		var vendor_prefixes    = ['', '-webkit-', '-Moz-', '-ms-', '-o-'];

		property = property.toLowerCase();
		property = property.replace(/^([a-z])|-([a-z])/g, function(match, p1, p2, offset, string) {
			return ((p1 || '') + (p2 || '')).toUpperCase();
		});

		for(var i = 0; i < vendor_prefixes.length; ++i) {
			var prefix        = vendor_prefixes[i];
			var test_prefix   = prefix.replace(/-/g, '');
			var test_property = test_prefix + property;

			if(document_style[test_property] !== undefined) {
				if(hyphenated) {
					return prefix.toLowerCase() + property.toLowerCase();
				}

				return test_property;
			}
		}

		return null;
	}

	initializeTacky();
	window.tacky = tacky;
}(jQuery));
