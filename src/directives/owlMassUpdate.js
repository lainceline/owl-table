(function (angular, _, $) {
	'use strict';

	function owlMassUpdateDirective ($modal, owlTable) {
		var link = function (scope, elem, attrs, tableCtrl) {
			
		};

		var controller = function ($scope) {
			this.massUpdate = false;

			this.massUpdateModal = function () {
				var modal = {
					templateUrl: 'partials/massUpdateModal.html',
					controllerAs: 'massUpdateModalCtrl',
					controller: function ($scope, $modalInstance, columns) {
						this.columns = columns;

						this.selectedColumn = columns[0];

						this.newValue = undefined;

						this.errors = {
							valueBlank: false
						};

						this.newValueDecorated = function () {
							var returnValue;

							if (!_.isUndefined(this.newValue)) {
								if (!_.isUndefined(this.newValue.text)) {
									returnValue = this.newValue.text;
								} else {
									returnValue = this.newValue;
								}
							} else {
								this.errors.valueBlank = true;
							}

							return returnValue;
						};

						this.currentWizardPage = 1;

						this.nextPage = function () {
							this.currentWizardPage++;
						};
						this.prevPage = function () {
							if (this.currentWizardPage > 0) {
								this.currentWizardPage--;
							}
						};
					},
					resolve: {
						columns: function () {
							return $scope.owlCtrl.owlTable.columns;
						}
					},
					backdrop: true,
					size: 'lg'
				};

				$modal.open(modal);
			};
		};

		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/owlMassUpdate.html',
			link: link,
			controllerAs: 'massUpdateCtrl',
			controller: ['$scope', controller]
		};
	}

	owlMassUpdateDirective.$inject = ['$modal', 'owlTable'];

	angular.module('owlTable')
		.directive('owlMassUpdate', owlMassUpdateDirective);

})(window.angular, window._, window.$);
