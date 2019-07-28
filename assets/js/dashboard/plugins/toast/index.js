// Inspired by https://github.com/eolant/vuetify-toast-snackbar

import Toast from "./Toast.vue";

class ToastPlugin {
    constructor() {
        this.queue = [];                // queue of pending toasts
        this.vueComponent = null;       // current toast

        // default options
        this.options = {
            container: ".application",  // default container to place toasts in
            property: "$toast",         // Vue instance property name
            queue: true                 // if queue is false then next toast will immediately close previous
        };
    }

    createVueComponent(options) {
        // prepare toast
        this.vueComponent = new this.Vue(Toast);
        Object.assign(this.vueComponent, this.Vue.prototype[this.options.property].options, options);
        let el = this.vueComponent.$mount().$el;
        // add toast in DOM
        document.querySelectorAll(this.options.container)[0].appendChild(el);

        // on current toast hide
        this.vueComponent.$on("hidden", () => {
            // clear current toast
            this.vueComponent = null;

            // if there are pending toasts
            if (this.queue.length) {
                // get next toast from queue
                let toast = this.queue.shift();
                // show next toast
                this.showToast(toast.message, toast.options);
            }
        });
    }

    showToast(message, options = {}) {
        // if there is active toast already
        if (this.vueComponent) {
            // if queue enabled
            if (options.queue !== undefined ? options.queue : this.options.queue) {
                // add new toast to the queue
                this.queue.push({ message, options });
            }
            else {
                // add new toast at the beginning of queue
                this.queue.unshift({ message, options });

                // hide active toast immediately
                this.vueComponent.active = false;
            }

            return;
        }

        // show new toast
        options.message = message;
        this.createVueComponent(options);
    }

    install(Vue, options = {}) {
        this.Vue = Vue;
        // apply options
        Object.assign(this.options, options);

        // prepare plugin method
        let vueInstanceMethod = this.showToast.bind(this),
            shortcutMethods = [
                { name: "success", options: { color: "success", icon: "done" } },
                { name: "info", options: { color: "info", icon: "info" } },
                { name: "error", options: { color: "error", icon: "error" } },
                { name: "warning", options: { color: "warning", icon: "warning" } },
            ];

        shortcutMethods.forEach(method => {
            vueInstanceMethod[method.name] = (message, options) => {
                let o = Object.assign({}, method.options, this.options, options);
                this.showToast(message, o);
            };
        });

        vueInstanceMethod.options = this.options;

        // patch Vue instance
        Vue.prototype[this.options.property] = vueInstanceMethod;
    }
}

export default new ToastPlugin();