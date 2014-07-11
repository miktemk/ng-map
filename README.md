ng-map
======

### How it works

This widget uses the [AngularJS framework] to function.

 - You need to `add ng-app="mikhail"` to your `body` tag in order to get it to work.
 - The `ng-map` attribute is the AngularJS directive that does all the main work. This attribute takes a URL of the Map JSON structure.
   Check out the one used in [this example](map.json).
 - You can optionally use the ng-map-options attribute to specify some settings to the ng-map directive. The following options are available currently (with their defaults):
   - delay: 300
   - stickerTemplate: "img/sticky{num}.png"
   - nStickers: 3
     (together with stickerTemplate will thus randomly use
	  `img/sticky1.png`, `img/sticky2.png`, `img/sticky3.png`)
   - homeText: "Back to top"
   - loadingText: "Loading..."

### Map JSON format

The map consists of an array of screens. Each screen has an "id", an image URL and a list of points.
Each point has an (x,y) coordinate specified in percent, so (100, 100) would mean the point is in the
bottom-right corner. Each point then has the "href" property which is used for navigation.
This map widget supports 2 types of navigation:

 - **Within-map**: When href is set to the id of one of the screens. By clicking on a point you then navigate to another screen within the same map control.
   You like my cool fading effect? I noticed a glitch on Firefox, please let me know if you find it too.
 - **External**: When you specify an href that starts with "http://" or "https://" then that page is loaded.
 - **External in a new tab**: An optional "target" property of the point object, when set to target="_blank" can be used to open the href link in a new
   tab/window. In this example Japan, France and Italy all have target="_blank" and will open in a new tab. Everyone else will just navigate to a new page

### Map Editor

To make life simpler, you can (and should) use this [map editor]().

### Compatibility with IE7

Eeeeerr! None. Don't use it.

[AngularJS framework]: http://angularjs.org/
