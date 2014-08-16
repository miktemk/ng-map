// usage:
// <div ng-map-editor
//      no-confirm      *optional
// ></div>
angular.module('ng').directive('ngMapEditor', function($filter) {
    return {
        restrict: 'A',
		templateUrl: 'ngMapEditor-template.html',
		scope: { ngMapEditor: '=' },
        link: function(scope, element, attr) {
			// from: http://stackoverflow.com/questions/3596089/how-to-remove-specifc-value-from-array-using-jquery
			function deleteFromArray(arr, x) {
				arr.splice( $.inArray(x, arr), 1 );
			}
			scope.addMap = function () {
				scope.ngMapEditor.push({
					"id": "pleaseSetId",
					"img": "",
					"points": []
				});
			};
			scope.addPoint = function (curMap) {
				curMap.points.push({
					"href": "",
					"label": "",
					"x": 50,
					"y": 50,
					"img": "sticky/sticky1.png"
				});
			};
			scope.deletePoint = function (curMap, point) {
				if (!attr.noConfirm && !confirm('are you sure?'))
					return;
				deleteFromArray(curMap.points, point);
			};
			scope.deleteMap = function (curMap) {
				if (!attr.noConfirm && !confirm('are you sure?'))
					return;
				deleteFromArray(scope.ngMapEditor, curMap);
			};
		}
    };
});
angular.module('ng').directive('toggleButton', function($filter) {
	return {
        restrict: 'A',
		replace: true,
		transclude: true,
        require: 'ngModel',
		scope: {'ngModel': '='},
		template: '<button type="button" class="btn ng-class:{\'btn-primary\':ngModel, \'btn-default\':!ngModel}" data-toggle="button" ng-click="ngModel = !ngModel" ng-transclude></button>'
    };
});

angular.module('ng').directive('ngMapEditorPointDrag', function($filter) {
    return {
        restrict: 'A',
		scope: { ngMapEditorPointDrag: '=' },
		link: function(scope, element, attr, ngModel) {
			if (!element.draggable) {
				console.error('Please include jQuery UI for draggable()');
				return;
			}
			var mapSurface = element.parent();
			element.draggable({
				stop: function( event, ui ) {
					scope.$apply(function () {
						scope.ngMapEditorPointDrag.x = 100 * ui.position.left / mapSurface.width();
						scope.ngMapEditorPointDrag.y = 100 * ui.position.top / mapSurface.height();
						//console.log(scope.ngMapEditorPointDrag.x, scope.ngMapEditorPointDrag.y);
					});
				}
			});
		}
    };
});
angular.module('ng').filter('ngMapEditorCleanupJson', function () {
    return function (data, words) {
    	if (!data)
			return data;
		//$.each(mapJson, function (i, curMap) {
		//	$.each(curMap, function (i, point) {
		//		delete(point.img);
		//	});
		//});
		var mapJson = [];
		for (var i = 0; i < data.length; i++) {
			var mapImage = $.extend(true, {}, data[i]);
			mapJson.push(mapImage);
			for (var j = 0; j < mapImage.points.length; j++) {
				//mapJson[i].points[j].img = null;
				delete (mapImage.points[j].img);
			}
		}
		return mapJson;
    };
});
angular.module('ng').directive('textAreaHighlightWhenClicked', function($filter) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
			element.click(function() { $(this).select(); } );
		}
	};
});

// from: http://stackoverflow.com/questions/17893708/angularjs-textarea-bind-to-json-object-shows-object-object
angular.module('ng').directive('jsonText', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {            
          function into(input) {
            return JSON.parse(input);
          }
          function out(data) {
			// my own addition at this point to nicely format the json
            //return JSON.stringify(data);
			return $filter('json')(data);
          }
          ngModel.$parsers.push(into);
          ngModel.$formatters.push(out);
        }
    };
});



function mapEditor($scope) {
	$scope.sideBySide = true;
	$scope.mapJson = [
	  { "id": "world",
		"img": "img/world.jpg",
		"points": [
		  { "href": "europe", "label":"Europe", "x":55, "y":25, sticker: "sticky/sticky1.png" },
		  { "href": "caribbean", "label":"Carribbean", "x":20, "y":55 },
		  { "href": "http://www.japan-guide.com/", "target":"_blank", "label":"Japan", "x":95, "y":40 }
		]
	  },{ "id": "europe",
		"img": "img/europe.jpg",
		"points": [
		  { "href": "http://wikitravel.org/en/France", "target":"_blank", "label":"France", "x":35, "y":55 },
		  { "href": "http://wikitravel.org/en/Italy", "target":"_blank", "label":"Italy", "x":55, "y":65 },
		  { "href": "http://wikitravel.org/en/Montenegro", "label":"Montenegro", "x":67, "y":60 }
		]
	  },{ "id": "caribbean",
		"img": "img/caribbean.jpg",
		"points": [
		  { "href": "http://en.wikipedia.org/wiki/Miami", "label":"Miami", "x":80, "y":35 },
		  { "href": "http://www.geographia.com/aruba/", "label":"Aruba", "x":70, "y":65 },
		  { "href": "http://en.wikipedia.org/wiki/Cuba", "label":"Cuba", "x":55, "y":50 },
		  { "href": "http://www.breezes.com/resorts/breezes-bahamas", "label":"Bahamas", "x":80, "y":45 },
		  { "href": "http://www.rivieramaya.com/", "label":"Mexico", "x":25, "y":55 }
		]
	  }
	];
}
