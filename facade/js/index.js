import log  from "logger";
import page from "page";
import pages from "./pages";
import $ from "jquery";
import "bootstrap";
import AOS from "aos";
log("Welcome to NordicSoft Express 4 Template! Environment: " + process.env.NODE_ENV);

page("/", pages.homepage);
page("/about", pages.about);
page("/contacts", pages.contacts);
page("/gallery", pages.gallery);
page("/gallery/:photoSet", pages.photoSet);
page("/gallery/:photoSet/:photoId", pages.photo);
//page('*', app.pages.notfound)
page({ click: false });

// init Bootstrap tooltips
$("body").tooltip({
    selector: "[data-toggle=\"tooltip\"]",
    container: "body"
});

// setup default jQuery ajax options
$.ajaxSetup({
    cache: false,
});

// setup AOS
AOS.init({ once: true });

// make logger global
window.logger = log;