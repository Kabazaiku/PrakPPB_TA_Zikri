import {$} from "../lib/dom.js";
import {createPager} from "../lib/pager.js";
import {state} from "../data/state.js";
import {brandCard} from "../components/cards.js";

const pager = createPager($("#brands-pager"), 8, render);
function render(){ $("#brand-list").replaceChildren(...pager.slice(state.brands).map(brandCard)); }
export const show = render;
