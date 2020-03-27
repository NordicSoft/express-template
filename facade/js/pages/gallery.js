import { log } from "core";
import $ from "jquery";
import justifiedGallery from "justifiedGallery";

// register justifiedGallery as jQuery plugin
justifiedGallery();

export function gallery() {
    log("Gallery");
    $(".photosets").justifiedGallery({
        rowHeight : 250,
        lastRow : "center",
        margins : 3
    });
}

export function photoSet() {
    log("Gallery PhotoSet");
    $(".photos").justifiedGallery({
        rowHeight : 250,
        lastRow : "center",
        margins : 3,
        sizeRangeSuffixes: {
            192: "_ts",
            256: "_tm",
            512: "_tl",
            600: "_s",
            800: "_m",
            1020: "_l",
        },
        captionSettings: {
            animationDuration: 500,
            visibleOpacity: 1.0,
            nonVisibleOpacity: 0.0
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