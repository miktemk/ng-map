function mapTest($scope) {
	$scope.mapJson = [
	  { "id": "world",
		"img": "img/world.jpg",
		"points": [
		  { "href": "europe", "label":"Europe", "x":55, "y":25 },
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