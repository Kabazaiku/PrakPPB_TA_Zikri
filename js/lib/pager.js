import {$, clone} from "./dom.js";

// 1 … 4 5 6 … 12
function range(cur, total){
  if(total <= 7) return Array.from({length: total}, (_, i) => i + 1);
  const keep = [...new Set([1, 2, total - 1, total, cur - 1, cur, cur + 1].filter(p => p >= 1 && p <= total))].sort((a, b) => a - b);
  return keep.flatMap((p, i) => i && p - keep[i - 1] > 1 ? ["…", p] : [p]);
}

/**
 * Pagination. `slot` adalah <div class="pager-slot"> di HTML; kontrolnya dari <template id="tpl-pager">.
 * pager.slice(items) mengembalikan item halaman aktif dan memperbarui tombol.
 */
export function createPager(slot, size, onChange){
  slot.append(clone("tpl-pager"));
  const nav = $(".pager", slot), box = $("[data-pages]", nav);
  const prev = $("[data-act=prev]", nav), next = $("[data-act=next]", nav);
  let page = 1;
  const go = p => {
    page = p; onChange();
    slot.closest(".page")?.querySelector(".grid")?.scrollIntoView({behavior: "smooth", block: "start"});
  };
  prev.onclick = () => go(page - 1);
  next.onclick = () => go(page + 1);
  return {
    reset(){ page = 1; },
    slice(items){
      const count = Math.max(1, Math.ceil(items.length / size));
      page = Math.min(page, count);
      slot.hidden = count <= 1; prev.disabled = page <= 1; next.disabled = page >= count;
      box.replaceChildren(...range(page, count).map(p => {
        if(p === "…") return clone("tpl-gap");
        const b = clone("tpl-page"); b.textContent = p; b.classList.toggle("on", p === page);
        if(p === page) b.setAttribute("aria-current", "page"); else b.onclick = () => go(p);
        return b;
      }));
      return items.slice((page - 1) * size, page * size);
    }
  };
}
