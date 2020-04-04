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

    let photoContainer = document.querySelector(".photo-container"),
        photoWrapper = photoContainer.querySelector(".photo-wrapper"),
        photo = photoWrapper.querySelector("img[data-src]"),
        photoPreview = photoWrapper.querySelector("img.preview"),
        src = photo.getAttribute("data-src"),
        width = photo.getAttribute("width"),
        height = photo.getAttribute("height"),
        aspectRatio = width / height,
        suffixStart = src.lastIndexOf("_"),
        suffixEnd = src.lastIndexOf(".");
    
    photo.onload = () => {
        photoWrapper.classList.remove("loading");
        photo.removeAttribute("width");
        photo.removeAttribute("height");
        photoPreview.setAttribute("width", photo.offsetWidth);
        photoPreview.setAttribute("height", photo.offsetHeight);
    };
    
    // TODO: load appropriate image size
    photo.src = src.slice(0, suffixStart) + "_l" + src.slice(suffixEnd);

    function fitHeight() {
        // get viewport dimensions
        const vh = document.documentElement.clientHeight;

        if (vh < photo.offsetHeight) {
            // fit height
            let newHeight = vh - 20,
                newWidth = newHeight * aspectRatio;

            photo.style.width = photoPreview.style.width = newWidth + "px";
            photo.style.height = photoPreview.style.height = newHeight + "px";
        }
    }

    window.onresize = fitHeight;
    fitHeight();
}

export default {
    gallery,
    photoSet,
    photo
};