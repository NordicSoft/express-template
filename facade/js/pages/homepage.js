import log from "logger";
import $ from "jquery";
import slideshow from "./../components/slideshow";

export default function () {
    log("Homepage");

    // setup Slick
    slideshow($("header .slideshow"));
}