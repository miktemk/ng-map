
angular.module('ng').directive('markdown', function() {
	var converter = new Showdown.converter();
	return {
		restrict: 'EA',
		link: function (scope, element, attrs) {
			var htmlText = element.text();
			element.html(converter.makeHtml(htmlText));
		}
	};
});


