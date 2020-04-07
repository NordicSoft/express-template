# Changelog

## **2.1.1** - *2020-xx-xx*
* Dashboard - browsers list adjusted (IE support dropped);

## **2.1.0** - *2020-04-07*
* API - `REGISTRATION_MODE` option added (possible values are `open` and `invite`);
* Facade - show Slick header slideshow only on homepage;
* Dashboard:
    * check user authentication before rendering page;
    * user authentication & registration implemented inside Dashboard;
* Gallery:
    * `GALLERY_NEW_PHOTOS_FIRST` option added;
    * resize photoset cover;
    * `jimp` support dropped;
    * refresh photoset's cover after changing it;
    * view photo set - load the smallest thumbnails by default;
    * Facade - consider `GALLERY_IMAGE_SIZES` and `GALLERY_PHOTOSET_COVER_SIZES` options in `justifiedGallery`;
    * image loading adjusted (show blurred thumbnail while loading larger image);
    * show last `GALLERY_LAST_PHOTOS_COUNT` photos below photo sets;
    * navigation in `All Photos` photo set;
    * photo sets order - init;
* dev proxy - copy dev URL to clipboard;
* minor changes;

## **2.0.1** - *2020-04-01*
* ability to use MongoDB as session storage added;
* consider `FACADE_PORT`, `DASHBOARD_PORT`, `API_PORT` env vars;
* `Facade`:
    * retry logic added for failed api requests;
    * api.js additional checks added;
* `Dashboard/Gallery` - handle xmp-js errors


## **2.0.0** - *2020-03-29*
Break the rock - split the monolith into smaller parts: `api`, `dashboard` and `facade`.

## **1.0.5** - *2020-03-10*
* store all configs in `.env` files and use `config.js` to access them easily;
* `module-alias` npm package added;
* error pages changed;
* `config.json` dropped;
* ESLint errors fixed;
* `npm run dev` task changed to run `lint`, `nodemon` and `gulp` concurrently;
* `Dashboard` - link to `Facade` added;
* `Facade/Gallery` - photos navigation inside photo sets (prev/next);

## **1.0.4** - *2020-03-06*
* node.js packages updated;
* Rollup.js updated to v2;
* nodemon added as Gulp task;
* `Dashboard/Gallery`:
    * pre-populate with XMP data fixed;
    * editing photo's photoSets fixed;
    * confirm deleting photo set;
    * store photos in different sizes (6 sizes + original);
    * ability to choose image processing module (sharp or jimp);
    * Vue Router silent push;

## **1.0.3** - *2019-11-30*
* `Facade/Gallery` added:
    * [Justified Gallery](http://miromannino.github.io/Justified-Gallery) used to display photo sets and photos thumbnails;
    * hide Gallery dropdown menu when there are no photo sets with photos;
    * hide Gallery link when there are no photo sets and photos to display;
* `Dashboard/Gallery`:
    * upload photos - pre-populate `alt`, `title` and `description` with data from XMP if available (custom package [xmp-js](https://www.npmjs.com/package/xmp-js) created for this);
    * reorder photos within photo set with drag & drop;
    * other improvements;

## **1.0.2** - *2019-11-25*
* `Facade` - contacts page updated;

## **1.0.1** - *2019-10-27*
* `Dashboard` - global loading overlay added;
* `Dashboard/Gallery`:
    * success toasts added;
    * cards loading behavior added;
    * photosets appearance improved;
    * the 'Trash' functionality added for photos (remove photos into Trash first; photos can be then restored from Trash or removed permanently);
    * new photos uploading - consider switching between photo sets;
* `Facade` - homepage updated;

## **1.0.0** - *2019-10-26*
* `Dashboard/Gallery` page added;
* `Vuetify` updated to v2.1.7;
* both backend & frontend refactored;
* minor appearance changes;

## **0.0.7** - *2019-09-25*
* `Dashboard/Google Maps` page added;

## **0.0.6** - *2019-09-22*
* `Dashboard/Files` page added (separate `Vuetify File Browser` component created for this);
* `MongoDB Store` refactored;
* `lint` run task added (runs ESLint);
* follow `ESLint` recommendations;
* `axios` configuration changed (used as Vue $http plugin);

## **0.0.5** - *2019-08-27*
* `Dashboard/Profile` page - separate route (URL) for each tab;
* `dotenv-defaults` added;
* `aws-sdk` added;
* `Dashboard/Send Email` page added (uses Amazon SES);
* `Vuetify` updated to v2.0;
* `MongoDB` connection URL moved to environment vars;


## **0.0.4** - *2019-07-18*
* global error handing;
* `Toast` Vue plugin added;
* Dashboard/Profile page - base implementation;
* data access layer (store) refactored;


## **0.0.3** - *2019-07-11*
* `Welcome` part renamed to `Facade`;
* facade - header slideshow added;
* `Animate.css` added;
* `Slick` carousel added;
* `Policies` page added;
* `Homepage` redesigned;
* `Font Awesome` updated to v5.9;
* `Facade Pages` redesigned;


## **0.0.2** - *2019-06-27*
* `CSS MQPacker` PostCSS plugin removed due to problems on big projects;
* npm packages updated;
* use memory session store instead of redis by default;
* fixed bug with logging user's id in production (morgan);
* `npm start` command changed;
* minor fixes and code cleanup;


## **0.0.1** - *2019-05-28*
* initial release