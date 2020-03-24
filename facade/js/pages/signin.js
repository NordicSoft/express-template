import { log, getQueryParam, loader } from "core";
import $ from "jquery";
import "jquery-validation";

export default function () {
    log("Signin");

    $("form.signin").validate({
        messages: {
            email: "Please provide your email.",
            password: "Please provide your password."
        },
        onfocusout: $.validator.validateElement,
        onkeyup: $.validator.validateElement,
        onclick: false,
        submitHandler: function(form, e) {
            e.preventDefault();
            var data = $(form).serialize();
            $("form.signin input[name='password']").val("");
            loader.show();
            $.post("/signin", data)
                .always(loader.hide)
                .done(function() {
                    $(document).trigger("signin");                    
                    var returnUrl = getQueryParam("return");
                    if (!returnUrl) {
                        returnUrl = "/dashboard";
                    }
                    window.location.href = returnUrl;
                })
                .fail(function(jqXHR) {
                    $("form.signin .alert-danger").empty();
                    var response = jqXHR.responseText ? JSON.parse(jqXHR.responseText) : null,
                        error;
                    if (response && response.message) {
                        error = response.message;
                    } else {
                        error = "Unknown error occurred";
                    }
                    $("<div />").text(error);
                    $("form.signin .alert-danger").append(error);
                    $("form.signin .alert-danger").show();
                });
            return false;
        },
        highlight: function (element) {
            $(element).addClass("is-invalid");//.closest("div.form-group").addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid").closest("div.form-group").find(".form-text.text-danger").text("");
        },
        errorPlacement: function (error, element) {
            $(element)
                .closest("div.form-group")
                .find(".error-sign")
                .attr("data-original-title", $(error).text());
        }
    });

    $("form.signin input[name='email']").focus();
    $("form.signin button").prop("disabled", false);
}
