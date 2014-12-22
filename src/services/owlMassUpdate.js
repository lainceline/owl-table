(function (angular, _, $) {
	'use strict';

	// mass update service is responsible for opening and handling the
	// mass update modal.
	function massUpdateService ($modal, MassUpdateController) {

		var createModal = function () {
			if (_.isUndefined(this.modal) || !this.modal) {
				this.modal = {
					templateUrl: 'partials/massUpdateModal.html',
					controller: MassUpdateController,
					size: 'lg',
					resolve: {
						columns: function () {
							return this.columns;
						}
					},
					backdrop: 'static'
				};
			}

			return this;
		};

		var andOpen = function () {
			this.openModal();

			return this;
		};

		var openModal = function () {
			$modal.open(this.modal);
		};

		var service = {
			createModal: createModal,
			andOpen: andOpen,
			openModal: openModal
		};

		return service;
	}

	angular.module('owlTable')
		.service('owlMassUpdate', ['$modal', 'MassUpdateController', massUpdateService]);

})(window.angular, window._, window.jQuery);
