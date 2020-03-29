import { log, getQueryParam, loader } from "core";
import $ from "jquery";
import "jquery-validation";

export default function () {
    log("Register");

    $("form.register").validate({
        rules: {
            email: {
                remote: "/check-email"
            },
            passwordConfirm: {
                equalTo: "[name=password]"
            }
        },
        messages: {
            name: {
                required: "Please provide your name"
            },
            email: {
                required: "Please provide your email",
                remote: "This email is already taken"
            },
            password: "Please provide your password",
            passwordConfirm: {
                required: "Please confirm your password",
                equalTo: "Passwords does not match"
            }
        },
        submitHandler: function(form, e) {
            e.preventDefault();
            var data = $(form).serialize();
            
            // clear passwords
            $("form.register input[name='password']").val("");
            $("form.register input[name='passwordConfirm']").val("");
            loader.show();
            $.post("/register", data)
                .always(()=> loader.hide)
                .done(function() {
                    $(document).trigger("register");
                    var returnUrl = getQueryParam("return");
                    if (!returnUrl) {
                        returnUrl = "/dashboard";
                    }
                    window.location.href = returnUrl;
                })
                .fail(function(jqXHR) {
                    $("form.register .alert-danger").empty();
                    var response = jqXHR.responseText ? JSON.parse(jqXHR.responseText) : null,
                        error;
                    if (response && response.message) {
                        error = response.message;
                    } else {
                        error = "Unknown error occurred";
                    }
                    $("<div />").text(error);
                    $("form.register .alert-danger").append(error);
                    $("form.register .alert-danger").show();
                });

            return false;
        },
        onfocusout: function (element) { $(element).valid(); },
        onkeyup: function (element) { $(element).valid(); },
        onclick: false,
        highlight: function (element) {
            $(element).addClass("is-invalid").closest("div.form-group").addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid").closest("div.form-group").removeClass("has-error").find(".form-text.error").text("");
        },
        errorPlacement: function (error, element) {
            $(element).closest("div.form-group").find(".error-sign").attr("data-original-title", $(error).text());
        }
    });

    $("form.register input[name='username']").focus();
    $("form.register button").prop("disabled", false);
}
