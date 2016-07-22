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

angular.module('ng').filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
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
	$scope.mapJson =
		[{"id":"world","img":"img/world.jpg","points":[{"href":"europe","label":"Europe","x":51.30962521294718,"y":29.53598484848485,"sticker":"sticky/sticky1.png"},{"href":"caribbean","label":"Carribbean","x":24.225404599659285,"y":50.44981060606061},{"href":"http://www.japan-guide.com/","target":"_blank","label":"Japan","x":85.20815587734242,"y":33.333333333333336}]},{"id":"europe","img":"img/europe.jpg","points":[{"href":"http://wikitravel.org/en/France","target":"_blank","label":"France","x":35.65002129471891,"y":28.33333333333333},{"href":"http://wikitravel.org/en/Montenegro","target":"","label":"Montenegro","x":57.73264480408859,"y":35.89962121212121},{"href":"italy","label":"Italy","x":49.576767461669505,"y":40.60132575757576}],"backLink":"world"},{"id":"caribbean","img":"img/caribbean.jpg","points":[{"href":"http://en.wikipedia.org/wiki/Miami","label":"Miami","x":80,"y":35},{"href":"http://www.geographia.com/aruba/","label":"Aruba","x":70,"y":65},{"href":"http://en.wikipedia.org/wiki/Cuba","label":"Cuba","x":55,"y":50},{"href":"http://www.breezes.com/resorts/breezes-bahamas","label":"Bahamas","x":80,"y":45},{"href":"http://www.rivieramaya.com/","label":"Mexico","x":25,"y":55}],"backLink":"world"},{"id":"italy","img":"img/italy.jpg","points":[{"href":"italy-north","label":"North","x":40.806005110732535,"y":8.787878787878787},{"href":"italy-center","label":"Central","x":44.85466354344123,"y":27.87878787878788},{"href":"italy-south","label":"South","x":51.6396933560477,"y":48.78787878787879},{"href":"sardinia","label":"Sardinia","x":38.95070272572402,"y":60}],"backLink":"europe"},{"id":"italy-north","img":"img/italy-north.jpg","points":[],"backLink":"italy"},{"id":"italy-center","img":"img/italy-center.jpg","points":[{"href":"toscana","label":"Toscana","x":51.61573679727427,"y":40.303030303030305},{"href":"umbria","label":"Umbria","x":62.22316865417376,"y":60.90909090909091},{"href":"liguria","label":"Liguria","x":30.680366269165248,"y":19.393939393939394}],"backLink":"italy"},{"id":"italy-south","img":"img/italy-south.jpg","points":[{"href":"","label":"Pentidattilo","x":43.031303236797264,"y":81.81818181818181},{"href":"","label":"Tropea","x":42.29131175468484,"y":39.39393939393939},{"href":"","label":"Paestum","x":36.66950596252129,"y":16.666666666666668}],"backLink":"italy"},{"id":"sardinia","img":"img/sardinia.jpg","points":[{"href":"","label":"Cagliari","x":44.042802385008514,"y":79.82954545454545},{"href":"","label":"Villasimius","x":57.63681856899488,"y":88.6032196969697},{"href":"","label":"Barumini","x":43.228279386712096,"y":58.404568385650215}],"backLink":"italy"},{"id":"toscana","img":"img/toscana.jpg","points":[{"href":"","label":"Pisa","x":38.9853066439523,"y":26.96969696969697},{"href":"toscana-maremma","label":"Maremma","x":51.32027257240205,"y":71.81818181818181},{"href":"toscana-gafagnana","label":"Garfagnana","x":34.95794293015332,"y":17.267992424242426},{"href":"toscana-arezzo","label":"Arezzo","x":61.54706132879046,"y":45.75757575757576},{"href":"toscana-costa-etr","label":"CostaEtruschi","x":34.933986371379895,"y":45.75284090909091}],"backLink":"italy-center"},{"id":"umbria","img":"img/umbria.jpg","points":[{"href":"","label":"Orvieto","x":69.03747870528109,"y":51.81818181818182},{"href":"","label":"CastigliondelLago","x":59.8381601362862,"y":20.606060606060606}],"backLink":"italy-center"},{"id":"toscana-arezzo","img":"img/toscana-arezzo.jpg","points":[{"href":"","label":"Verna","x":80.55259795570699,"y":24.24242424242424},{"href":"italy-arezzo-loro","label":"LoroChiuffena","x":47.14916950596252,"y":48.48484848484848}],"backLink":"toscana"},{"id":"toscana-arezzo-loro","img":"img/toscana-arezzo-loro.jpg","points":[{"href":"","label":"LoroChiuffena","x":59.17270017035775,"y":33.328598484848484}],"backLink":"italy-arezzo"},{"id":"toscana-costa-etr","img":"img/toscana-costa-etr.jpg","points":[{"href":"","label":"Elba","x":23.82879045996593,"y":55.15151515151515},{"href":"","label":"Populonia","x":58.87989778534924,"y":16.363636363636363}],"backLink":"toscana"},{"id":"toscana-maremma","img":"img/toscana-maremma.jpg","points":[{"href":"","label":"Orbetello","x":34.37233816013629,"y":50.90909090909091},{"href":"","label":"Pitigliano","x":74.14821124361158,"y":28.181818181818183},{"href":"","label":"Sorano","x":78.74787052810903,"y":13.333333333333336}],"backLink":"toscana"},{"id":"toscana-gafagnana","img":"img/toscana-gafagnana.jpg","points":[{"href":"","label":"Viareggio","x":41.6098807495741,"y":62.42424242424242},{"href":"","label":"Altagnana","x":44.335604770017035,"y":22.424242424242426},{"href":"","label":"Carrara","x":29.003407155025553,"y":14.848484848484848}],"backLink":"toscana"}]
		;
}
