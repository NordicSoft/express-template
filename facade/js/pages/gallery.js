import { log } from "core";
import $ from "jquery";
import justifiedGallery from "justifiedGallery";

// register justifiedGallery as jQuery plugin
justifiedGallery();

function parseImageSizes(value) {
    return value.split(",").reduce((acc, x) => { 
        let splitted = x.split(":"),
            suffix = splitted[0],
            size = splitted[2];
        acc[Number(size.split("x")[1])] = suffix ? "_" + suffix : "";
        return acc;
    }, {});
}

export function gallery() {
    log("Gallery");
    $(".photosets").justifiedGallery({
        rowHeight : 250,
        lastRow : "center",
        margins : 3,
        sizeRangeSuffixes: parseImageSizes(process.env.GALLERY_PHOTOSET_COVER_SIZES),
    });
}

export function photoSet() {
    log("Gallery PhotoSet");
    $(".photos").justifiedGallery({
        rowHeight : 250,
        lastRow : "center",
        margins : 3,
        sizeRangeSuffixes: parseImageSizes(process.env.GALLERY_IMAGE_SIZES),
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