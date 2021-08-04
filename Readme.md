# ExtJS Components & Widgets

* compatible with ExtJS 6.x+

## Components

### map

* wrapper for open street map and leatlet js
* osm directly is deprecated
* leaflet artefacts loaded via cdn

### JSON Viewer

* tree
* text

### Raspberry Pi Camera Frontend

* simple GUI to access the camera through GUI
* backend implementation needed - not included within this repo yet

### Webamp

* webaudio based mp3 player
* play your music from soundcloud

## Widgets

### Weather

* wip

---

### TODOs

* include leaflet deps in package.json
* clean up and fix build files that every component / widgets can be build independent

---

## Setup

* clone repo
* simple (without editing): 
* serve public -> ie using serve (recommended)
<br/><br/> 
* complex (edit and build): 
* in case you wanna edit stuff
* run npm install
* browserify wrapper.js - check comments there
* do your changes and run node build
* serve public or copy your single package from build/