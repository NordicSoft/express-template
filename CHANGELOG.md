# Changelog

## **1.0.4** - *2020-03-05*
* node.js packages updated;
* `Dashboard/Gallery`:
    * pre-populate with XMP data fixed;
    * editing photo's photoSets fixed;
    * confirm deleting photo set;
    * store photos in different sizes (6 sizes + original);
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