(function (angular) {
	'use strict';

	function owlPrintDirective($window, owlTable) {
		var printSection = document.getElementById('owlPrintSection');

		if (!printSection) {
			printSection = document.createElement('div');
			printSection.id = 'owlPrintSection';
			document.body.appendChild(printSection);
		}

		function link (scope, elem, attrs, tableCtrl) {
			elem.on('click', function () {
				var elemToPrint = document.getElementById(attrs.printElementId);
				if (elemToPrint) {
					printElement(elemToPrint);
				}
			});

			// This is for Chrome and other browsers that don't support onafterprint
			if ($window.matchMedia) {
				var mediaQueryList = $window.matchMedia('print');
				mediaQueryList.addListener(function (mql) {
					if (!mql.matches) {
						afterPrint();
					}
				});
			}

			$window.onafterprint = afterPrint;

			var printElement = function (elem) {
				var domClone;

				tableCtrl.tableWillPrint();

				domClone = elem.cloneNode(true);
				printSection.appendChild(domClone);
				$window.print();
			};

			var afterPrint = function () {
				tableCtrl.tableDidPrint();
				printSection.innerHTML = '';
			};
		}

		return {
			link: link,
			restrict: 'A',
			require: '^owlTable'
		};
	}

	owlPrintDirective.$inject = ['$window', 'owlTable'];
	angular.module('owlTable').directive('owlPrint', owlPrintDirective);

})(window.angular);
