$.fn.imgSrcFade = function (src, options) {
	var opt = $.extend({
		delay:1000,
		after:function () {}
	}, options);
	return this.each(function (key, value) {
		var element = $(this);
		if (typeof(element.attr("src")) != "undefined") {
			element = element.fadeOut(opt.delay, function() {
				element.attr("src", src);
			}).fadeIn(opt.delay, function() {
				opt.after();
			});
		} else {
			element = element.hide(0, function() {
				element.attr("src", src);
			}).fadeIn(opt.delay, function() {
				opt.after();
			});
		}
	});
};

angular.module('ng').directive('ngSrcFadeEffect', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			//console.log('injectables');
			//console.log(injectables);
			attrs.$observe('ngSrcFadeEffect', function(value) {
				if (element.attr("src") == value)
					return;
				//console.log('ngSrcFadeEffect has changed value to ' + value);
				var opt = $.extend({
					ngSrcFadeEffectDelay: "300",
					ngSrcFadeEffectAfter: ""
				}, attrs);
				$(element).imgSrcFade(value, {
					delay: parseInt(opt.ngSrcFadeEffectDelay),
					after: scope.$eval(opt.ngSrcFadeEffectAfter)
				});
			});
		}
	};
});

angular.module('ng').directive('ngMap', function($http) {
	return {
		restrict: 'A',
		template:
'<div ng-hide="curMap != null">{{loadingText}}'+
'</div>'+
'<div class="maproot ng-cloak" >'+
'  <div class="mapbg">'+
'    <img '+
'      ng-src-fade-effect="{{curMap.img}}"'+
'      ng-src-fade-effect-delay="{{fadeDelay}}"'+
'      ng-src-fade-effect-after="activateLabels"'+
'      width="100%" />'+
'  </div>'+
'  <div class="mappoint" ng-show="showLabels" ng-repeat="point in curMap.points"'+
'      ng-style="{top:point.y+\'%\', left:point.x+\'%\'}"'+
'      ng-click="gotoMap(point.href, point.target)"'+
'      ng-map-editor-point-drag="point" >'+
'    <img ng-src="{{point.img}}" />'+
'    <span>{{point.label}}</span>'+
'  </div>'+
'  <div class="mappoint back-button" ng-show="showHomeButton" ng-click="gotoMapBack(curMap)">'+
'    {{homeText}}'+
'  </div>'+
'</div>',
		//templateUrl: 'map_template.html',
		scope: { ngMap: '=' },
		link: function ($scope, element, attrs, controller) {

			var opt = $.extend({
				delay: 300,
				stickerTemplate: "img/sticky{num}.png",
				nStickers: 3,
				homeText: "Back",
				loadingText: "Loading...",
				editMode: false
			}, $scope.$eval(attrs.ngMapOptions));

			function safeApply($scope, callback) {
				($scope.$$phase || $scope.$root.$$phase)
					? callback()
					: $scope.$apply(callback);
			}
			function setMapJson(data) {
				$scope.maps = data;

				// rig the model
				$.each($scope.maps, function(index, elem) {
					var curMap = this;
					// preload images
					var pic1= new Image(); 
					pic1.src = curMap.img;
					$.each(this.points, function(index, point) {
						this.img = point.sticker
							? point.sticker
							: opt.stickerTemplate.replace("{num}", Math.floor((Math.random()*opt.nStickers)+1));
						var bounds = $.extend({ x:0, y:0, w:100, h:100 }, curMap.bounds);
						this.x = 100 * (this.x - bounds.x) / bounds.w;
						this.y = 100 * (this.y - bounds.y) / bounds.h;
					});
				});

				// rig the scope
				$scope.curMap = $scope.maps[0];
				$scope.showLabels = false;
				$scope.showHomeButton = false;
				$scope.hrefHomeButton = $scope.maps[0].id;
				$scope.homeText = opt.homeText;
				$scope.loadingText = opt.loadingText;
				$scope.fadeDelay = opt.delay;
			}
			
			// ng-map-json-url attribute take priority
			if (attrs.ngMapJsonUrl)
				$http.get(attrs.ngMap + "?timestamp=" + Math.random()).success(setMapJson);
			else if ($scope.ngMap)
				setMapJson($scope.ngMap);
			
			$scope.gotoMap = function (href, target) {
				if (typeof(href) == "undefined" || href == null || href == "")
					return;
				var mapzz = $.grep($scope.maps, function (x) { return (x.id == href); });
				if (mapzz.length == 0 && opt.editMode)
					return;
				if (mapzz.length == 0) {
					if (href.toLowerCase().indexOf("http://") != -1 || href.toLowerCase().indexOf("https://") != -1) {
						if (typeof(target) != "undefined" && target == "_blank") {
							window.open(href, '_blank');
							window.focus();
						} else
							window.location.href = href;
					}
					return;
				}
				$scope.showLabels = false;
				$scope.showHomeButton = false;
				$scope.curMap = mapzz[0];
			};
			$scope.gotoMapBack = function (curMap) {
				var link = curMap.backLink;
				if (!link || link == '')
					link = $scope.hrefHomeButton;
				$scope.gotoMap(link);
			}
			$scope.activateLabelsInner = function () {
				if (typeof($scope.maps) == "undefined")
					return;
				$scope.showLabels = true;
				console.log($scope);
				$scope.showHomeButton = ($scope.curMap != $scope.maps[0]);
			};
			$scope.activateLabels = function () {
				safeApply($scope, $scope.activateLabelsInner);
			};
		}
	};
});
