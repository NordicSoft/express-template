import Vue from "vue";
import options from "options";

export default function (vueApp) {
    // handle errors
    Vue.config.errorHandler = function (error, vm, info) {

        if (error.isAxiosError) {
            let response = error.response;
            switch (response.status) {
                case 400:
                    vueApp.$toast.error(response.data);
                    break;

                case 401:
                    window.location = "/signin?return=" + location.pathname + location.search;
                    return;

                default:
                    vueApp.$toast.error("Request completed with error");
                    break;
            }

            return;
        }

        vueApp.$toast.error("Unknown error occurred");

        if (options.env === "development") {
            console.log("Vue.config.errorHandler");
            console.dir(error);
            console.log(vm);
            console.log(info);
        }
    };

    window.onerror = function (msg, url, line, col, error) {
        vueApp.$toast.error("Unknown error occurred");
        if (options.env === "development") {
            console.log("window.onerror");
            console.log(msg);
            console.log(url);
            console.log(line);
            console.log(col);
            console.log(error);
        }
    };

    window.addEventListener("unhandledrejection", function (event) {
        vueApp.$toast.error("Unknown error occurred");
        if (options.env === "development") {
            console.log("unhandledrejection");
            console.log(event);
        }
    });
}