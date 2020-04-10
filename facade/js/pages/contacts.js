import log from "logger";
import loader from "loader";
import $ from "jquery";

function renderMap() {

    var mapOptions = {
        scrollwheel: false,
        center: { lat: 51.4934, lng: 0.0098 },
        zoom: 16
    };

    var map = new google.maps.Map(document.querySelector(".map"), mapOptions);
    var marker = new google.maps.Marker({
        map: map,
        position: { lat: 51.4934, lng: 0.0098 },
        title: "Grinvich",
        url: "https://goo.gl/maps/Xx22fzLjzULpdjbL6"
    });

    google.maps.event.addListener(marker, "click", function () {
        window.location.href = this.url;
    });
}

function sendMessage(e) {
    e.preventDefault();
    let contactForm = $(".contact-form"),
        name = $("[name=name]", contactForm),
        email = $("[name=email]", contactForm),
        message = $("[name=message]", contactForm);

    if (name.val().trim() === "") {
        name.focus();
        return;
    }
    if (email.val().trim() === "" || !/^\S+@\S+$/i.test(email.val())) {
        email.focus();
        return;
    }
    if (message.val().trim() === "") {
        message.focus();
        return;
    }

    var data = contactForm.serialize();
    loader.show();
    $.post("/send-message", data)
        .always(loader.hide)
        .done(() => {
            contactForm.find(".alert-success").fadeIn();
            contactForm[0].reset();
            setTimeout(function () {
                contactForm.find(".alert-success").fadeOut();
            }, 4000);
        })
        .fail(() => {
            contactForm.find(".alert-danger").fadeIn();
            setTimeout(function () {
                contactForm.find(".alert-danger").fadeOut();
            }, 4000);
        });
}

export default function () {
    log("Contacts");

    $(renderMap);
    $(".contact-form button").click(sendMessage);

}