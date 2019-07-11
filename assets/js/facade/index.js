import { log } from "core";
import options from "options";
import page from "page";
import pages from "./pages";
import $ from "jquery";
import "bootstrap";
import AOS from "aos";
import slideshow from "./components/slideshow";

log("Welcome to NordicSoft Express 4 Template! Environment: " + options.env);

page("/", pages.homepage);
page("/about", pages.about);
page("/contacts", pages.contacts);
page("/register", pages.register);
page("/signin", pages.signin);
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

// setup Slick
slideshow($("header .slideshow"));