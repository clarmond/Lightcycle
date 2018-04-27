# About Lightcycle

Lightcycle is a jQuery plug-in for quickly scrolling horizontally through a large set of thumbnail images.  It is built upon several other jQuery plug-ins.

# Demo

<a href="http://www.csarmond.com/lightcycle/">Example using images from the NASA Image and Video Library</a>

## Dependencies
- Cursometer - https://github.com/loganfranken/Cursometer
- jQuery LoadingOverlay - https://gasparesganga.com/labs/jquery-loading-overlay/
- Lazy Load - https://github.com/tuupola/jquery_lazyload/tree/2.x
- Lightbox - http://lokeshdhakar.com/projects/lightbox2/

# Usage

## Include CSS dependencies

```html
<link rel="stylesheet" href="dep/jquery-ui-1.12.1/jquery-ui.min.css" type="text/css" />
<link rel="stylesheet" href="dep/lightbox2-master/dist/css/lightbox.css" type="text/css" />
<link rel="stylesheet" href="css/lightcycle.css" type="text/css" />
```
## Include JavaScript dependencies

```html
<script type="text/javascript" src="dep/jquery/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="dep/jquery-ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="dep/jquery/jquery.easing.min.js"></script>
<script type="text/javascript" src="dep/lazyload/lazyload.js"></script>
<script type="text/javascript" src="dep/lightbox2-master/dist/js/lightbox.js"></script>
<script type="text/javascript" src="dep/jquery-loading-overlay/loadingoverlay.min.js"></script>
<script type="text/javascript" src="dep/jquery.cursometer.1.0.0.js"></script>
<script type="text/javascript" src="js/lightcycle.js"></script>
```

## Set up Lightcycle

```html
<div id="lc-container"></div>
<script>
	$("#lc-container").lightcycle({
		source: 'my-data-file.json',
		height: 'viewport'
	});
</script>
```

# Parameters

`source` - Required link to source data (described below)

`height` - Optional number specifying the height of the container in pixels.  The default value is _600_.  Additionaly, you can set this value to `viewport` which will maximize the container to the size of the viewport.

# Source Data Format

The data for the Lightcycle plug-in must be in JSON format. 

## JSON Template

```js
{
  "config": {
    "link": "",
    "thumbnail": "",
    "content": ""
  },
  items: [
    {
      "link": "",
      "thumbnail": "",
      "content": ""
      "guid": "",
      "title": ""
    }
  ]
}
```

## Description of Properties

There are 2 main properties in the source data.  One is a `config` property.  This property is _optional_.  The second property `items` is an array of image objects to be displayed.

### config

`config` - Optional property used to remove redunant URLs for the JSON data.

`config.link` - This is the base URL of all links in the `items` data.  For example, if all links begin with `https://www.mydomain.com/mydata/`, then `config.link` would be set to this value.  Then when the links are created, they will all be prepended with `https://www.mydomain.com/mydata/`.

`config.thumbail` - This is the base URL for all thumbnail images.

`config.content` - This is the base URL for all full-resolution images.

### items

`link` - Optional link to more information about the image

`thumbnail` - URL to thumbnail image to be displayed

`content` - URL to the full-resolution image.  This image will be displayed when the user clicks the thumbnail image.

`guid` - This is the unique ID assigned to this image.

`title` - An optional piece of text to describe the image being displayed.  This will be displayed in the light box view.  This text is also put in the `alt` attribute of the `img` tag.

## Example

### Sample JSON

```js
{
  "config": {
    "base_urls": {
    "link": "https://images.nasa.gov/details-",
    "thumbnail": "https://images-assets.nasa.gov/image",
    "content": "https://images-assets.nasa.gov/image"
  }
  },
  "items": [
    {
      "link": "PIA18033.html",
      "thumbnail": "/PIA18033/PIA18033~thumb.jpg",
      "content": "/PIA18033/PIA18033~medium.jpg",
      "guid": "PIA18033",
      "title": "Earth"
    },
    {
      "link": "PIA20912.html",
      "thumbnail": "/PIA20912/PIA20912~thumb.jpg",
      "content": "/PIA20912/PIA20912~small.jpg",
      "guid": "PIA20912",
      "title": "Blazar Artist Concept"
    },
    {
      "link": "PIA12348.html",
      "thumbnail": "/PIA12348/PIA12348~thumb.jpg",
      "content": "/PIA12348/PIA12348~medium.jpg",
      "guid": "PIA12348",
      "title": "Great Observatories Unique Views of the Milky Way"
    },
    {
      "link": "hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o.html",
      "thumbnail": "/hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o/hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o~thumb.jpg",
      "content": "/hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o/hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o~medium.jpg",
      "guid": "hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o",
      "title": "Hubble Captures Vivid Auroras in Jupiter’s Atmosphere"
    },
    {
      "link": "from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o.html",
      "thumbnail": "/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o~thumb.jpg",
      "content": "/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o~medium.jpg",
      "guid": "from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o",
      "title": "From a Million Miles Away, NASA Camera Shows Moon Crossing Face of Earth"
    }
  ]
}
```

### Sample HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Lightcycle Demo</title>
  <meta charset="utf-8" />
  <!-- Required CSS -->
  <link rel="stylesheet" href="dep/jquery-ui-1.12.1/jquery-ui.min.css" type="text/css" />
  <link rel="stylesheet" href="dep/lightbox2-master/dist/css/lightbox.css" type="text/css" />
  <link rel="stylesheet" href="css/lightcycle.css" type="text/css" />

  <!-- Required JavaScript libraries -->
  <script type="text/javascript" src="dep/jquery/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="dep/jquery-ui-1.12.1/jquery-ui.min.js"></script>
  <script type="text/javascript" src="dep/jquery/jquery.easing.min.js"></script>

  <!-- https://github.com/tuupola/jquery_lazyload/tree/2.x -->
  <script type="text/javascript" src="dep/lazyload/lazyload.js"></script>

  <!-- http://lokeshdhakar.com/projects/lightbox2/ -->
  <script type="text/javascript" src="dep/lightbox2-master/dist/js/lightbox.js"></script>

  <!-- https://gasparesganga.com/labs/jquery-loading-overlay/ -->
  <script type="text/javascript" src="dep/jquery-loading-overlay/loadingoverlay.min.js"></script>

  <!-- https://github.com/loganfranken/Cursometer -->
  <script type="text/javascript" src="dep/jquery.cursometer.1.0.0.js"></script>

  <!-- Set up Light Cycle Plug-in -->
  <script type="text/javascript" src="js/lightcycle.js"></script>

  <!-- Custom styling -->
  <style>
  body {
    background-color: #5a5a5a;
    font-family: Arial, Helvetica, Sans-serif;
    font-size: 10pt;
  }
  </style>
</head>
<body>
  <div id="lc-container"></div>
  <script>
    $("#lc-container").lightcycle({
      source: 'popular.json',
      height: 'viewport',
    });
  </script>
</body>
</html>
```
