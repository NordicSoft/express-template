import { log } from "core";
import $ from "jquery";
import justifiedGallery from "justifiedGallery";

// register justifiedGallery as jQuery plugin
justifiedGallery();

export function gallery() {
    log("Gallery");
    $(".photosets").justifiedGallery({
        rowHeight : 250,
        lastRow : "nojustify",
        margins : 3
    });
}

export function photoSet() {
    log("Gallery PhotoSet");
    $(".photos").justifiedGallery({
        rowHeight : 250,
        lastRow : "nojustify",
        margins : 3,
        sizeRangeSuffixes: {
            160: "_ts",
            320: "_tm",
            640: "_tl",
            800: "_m",
            1020: "_l",
        }
    });
}

export function photo() {
    log("Gallery Photo");
}

export default {
    gallery,
    photoSet,
    photo
};