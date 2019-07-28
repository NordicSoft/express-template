import $ from "jquery";
import "slick-carousel";

function animate(elements) {
    var animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    elements.each(function () {
        var $this = $(this);
        var animationDelay = $this.data("delay");
        var animationType = "animated " + $this.data("animation");
        $this.css({
            "animation-delay": animationDelay,
            "-webkit-animation-delay": animationDelay
        });
        $this.addClass(animationType).one(animationEndEvents, function () {
            $this.removeClass(animationType);
        });
    });
}

export default function (slideshow) {

    // animate first slide on init
    slideshow.on("init", function () {
        var elements = slideshow.find(".slide:first-child [data-animation]");
        animate(elements);
    });

    // animate slide on slide change
    slideshow.on("beforeChange", function (e, slick, currentSlide, nextSlide) {
        var elements = slideshow.find(`.slick-slide[data-slick-index='${nextSlide}'] [data-animation]`);
        animate(elements);
    });

    // init slick
    slideshow.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        fade: true
    });
}