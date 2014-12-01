/*!
 * SwiftSearch
 * A lightweight fuzzy text search function
 * https://github.com/Knotix/SwiftSearch/
 *
 * Copyright 2014 Samuel Hodge
 * Released under the GPL license
 * http://www.gnu.org/licenses/gpl.html
 */
(function(context) {
	'use strict';

	// Add SwiftSearch to the current context
	context.swiftsearch = swiftsearch;

	// RegExp used to escape RegExp special characters
	var escape_regex = /([-[\]{}()*+?.,\\^$|#\s])/g;

	/**
	 * Performs a fuzzy text search against an array of strings
	 * @param  {String}   needle              The string to search for
	 * @param  {Array}    haystacks           An array of strings or an array of objects with "text" properties
	 * @param  {Boolean=} include_non_matches Set to true to include results with no matches
	 * @param  {Number=}  result_limit        The maximum number of results
	 * @return {Array}                        An array of search results
	 */
	function swiftsearch(needle, haystacks, include_non_matches, result_limit) {
		haystacks = haystacks || [];
		needle    = String(needle || '');

		if(!(haystacks instanceof Array)) {
			throw new Error('Invalid haystack array: ' + haystacks);
		}

		// Create a RegExp pattern with every permutation of contiguous characters
		var pattern      = [];
		var unique_parts = {};

		for(var i = needle.length; i > 0; --i) {
			var permutations = needle.length - i;

			// For performance, cap the number of permutations for long needles
			if(needle.length > 32) {
				permutations = 0;
			}

			for(var j = 0; j <= permutations; ++j) {
				var pattern_part = needle.slice(j, j + i).replace(escape_regex, '\\$1');

				if(!unique_parts[pattern_part]) {
					unique_parts[pattern_part] = true;
					pattern.push(pattern_part);
				}
			}
		}

		// Create the RegExp string
		pattern = '(' + pattern.join('|') + ')';

		// Instantiate the RegExp
		var needle_regexp = new RegExp(pattern, 'gi');

		// Loop through each haystack and search for the needle
		var results = [];
		for(var i = 0; i < haystacks.length; ++i) {
			var text = haystacks[i] || '';

			// Support for haystack objects that have a "text" property
			if(typeof text === 'object') {
				text = text.text || '';
			}

			if(typeof text !== 'string') {
				throw new Error('Invalid haystack: ' + text);
			}

			var score              = 0;
			var matched_characters = 0;
			var longest_match      = 0;
			var highlight_text     = null;
			var text_length        = text.length;

			if(text_length && needle.length) {
				var last_index   = 0;
				var regexp_index = 0;
				var regexp_match;

				highlight_text = '';

				// Reset the index of the RegExp
				needle_regexp.lastIndex = 0;

				// Execute the needle RegExp on the haystack
				while((regexp_match = needle_regexp.exec(text))) {
					regexp_index = needle_regexp.lastIndex;

					var match                  = regexp_match[0];
					var match_length           = match.length;
					var match_index            = regexp_index - match_length;
					var match_percentage       = match_length / text_length;
					var match_index_percentage = match_index / match_length;

					score += match_length * match_percentage;
					score -= match_length * match_index_percentage / 1000;

					// Store the number of matched characters
					matched_characters += match_length;

					// Track the longest match
					if(longest_match < match_length) {
						longest_match = match_length;
					}

					// Create the highlight text
					highlight_text += text.slice(last_index, match_index);
					highlight_text += '<mark>' + match + '</mark>';

					last_index = regexp_index;
				}

				// Ceil the score so that fairly similar matches are considered equal
				score = Math.ceil(score);

				// Append the remaining characters of the haystack
				highlight_text += text.slice(regexp_index);
			}

			// Remove non-matches if needed
			if(!include_non_matches && score === 0) {
				continue;
			}

			// Add the result to the results array
			results.push({
				index          : i,
				text           : text,
				highlight_text : highlight_text || text,
				longest_match  : longest_match,
				score          : score,
				difference     : Math.abs(needle.length - matched_characters)
			});
		}

		// Sort the results
		results.sort(sortSearchResults);

		// Limit the result count if needed
		result_limit = +result_limit;

		if(result_limit) {
			results = results.slice(0, result_limit);
		}

		return results;
	}

	/**
	 * Sorts search results
	 * @param  {Object} a The first search result
	 * @param  {Object} b The second search result
	 * @return {number}   The relative direction to move the elements
	 */
	function sortSearchResults(a, b) {
		var tmp_a;
		var tmp_b;

		tmp_a = -a.longest_match;
		tmp_b = -b.longest_match;

		if(tmp_a === tmp_b) {
			tmp_a = -a.score;
			tmp_b = -b.score;

			if(tmp_a === tmp_b) {
				tmp_a = a.difference;
				tmp_b = b.difference;

				if(tmp_a === tmp_b) {
					tmp_a = a.text.length;
					tmp_b = b.text.length;

					if(tmp_a === tmp_b) {
						tmp_a = a.text;
						tmp_b = b.text;

						if(tmp_a === tmp_b) {
							tmp_a = a.index;
							tmp_b = b.index;

							if(tmp_a === tmp_b) {
								return 0;
							}
						}
					}
				}
			}
		}

		if(tmp_a === null) {
			return -1;
		}
		else if(tmp_b === null) {
			return 1;
		}

		return tmp_a < tmp_b ? -1 : 1;
	}
}(this));
