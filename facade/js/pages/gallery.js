import log from "logger";
import loader from "loader";
import $ from "jquery";
import justifiedGallery from "justifiedGallery";
import "jquery-touchswipe";

// register justifiedGallery as jQuery plugin
justifiedGallery();

function getGalleryRowHeight() {
    let galleryWidth = $(window).width();

    if (galleryWidth <= 414) {
        return 96;
    } else if (galleryWidth <= 768) {
        return 128;
    } else if (galleryWidth <= 1024) {
        return 192;
    }
    return 300;
}

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
    
    $(".photos").justifiedGallery({
        rowHeight : Math.max(getGalleryRowHeight() * 0.5, 96),
        lastRow : "center",
        margins : 3,
        sizeRangeSuffixes: parseImageSizes(process.env.GALLERY_IMAGE_SIZES),
        captionSettings: {
            animationDuration: 500,
            visibleOpacity: 1.0,
            nonVisibleOpacity: 0.0
        }
    });

    $(window).resize(() => {
        $(".photos").justifiedGallery({ rowHeight : getGalleryRowHeight() });
    });
}

export function photoSet() {
    log("Gallery PhotoSet");
    $(".photos").justifiedGallery({
        rowHeight : getGalleryRowHeight(),
        lastRow : "center",
        margins : 3,
        sizeRangeSuffixes: parseImageSizes(process.env.GALLERY_IMAGE_SIZES),
        captionSettings: {
            animationDuration: 500,
            visibleOpacity: 1.0,
            nonVisibleOpacity: 0.0
        }
    });

    $(window).resize(() => {
        $(".photos").justifiedGallery({ rowHeight : getGalleryRowHeight() });
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

    
    function prevPhoto() {
        loader.show();
        $(".photo-nav .prev")[0].click();
    }

    function nextPhoto() {
        loader.show();
        $(".photo-nav .next")[0].click();
    }

    // setup touch events
    // http://labs.rampinteractive.co.uk/touchSwipe/docs/$.fn.swipe.html#event:swipe
    $(".photo-wrapper").swipe({
        swipeLeft: nextPhoto,
        swipeRight: prevPhoto,
        threshold: 50,
    });

    $(".photo-nav a").click(() => { loader.show(); });

}

export default {
    gallery,
    photoSet,
    photo
};