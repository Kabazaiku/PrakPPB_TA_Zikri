export const blobToDataURL = b => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });

/** Memperkecil gambar (sisi terpanjang maks. `max` px). type: "image/jpeg" (foto) atau "image/png" (logo). */
export function resize(file, max = 900, type = "image/jpeg"){
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error("Gagal memproses gambar")), type, .82);
    };
    img.onerror = () => rej(new Error("File bukan gambar yang valid")); img.src = url;
  });
}
