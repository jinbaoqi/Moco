class URLLoader extends EventDispatcher {
    constructor() {

    }

    load(request) {

    }

    close() {

    }
}

Moco.URLLoader = URLLoader;

Moco.URLLoaderEvent = {
    COMPLETE: "complete",
    ERROR: "error"
};