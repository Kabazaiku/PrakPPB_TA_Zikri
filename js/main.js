import {loadData} from "./data/api.js";
import {startRouter} from "./router.js";
import {initInstall} from "./install.js";

initInstall();
loadData().then(startRouter);
if("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
