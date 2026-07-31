# Catatan: Logo Navbar & Favicon Baru

*(Ditulis susulan — sempat kelewat nggak dicatat pas v27 dikerjain, ketauan
setelah user nanya kenapa udah lama nggak ada catatan baru.)*

## Konteks

User upload 2 gambar logo hasil generate AI image tool (dari 5+5 prompt saran
yang saya kasih sebelumnya). Kedua gambar berlatar hitam solid, diminta
background-nya dihapus (transparan) terus dipasang: Logo 1 (mahkota+kastil)
buat navbar, Logo 2 (mahkota glow) buat favicon.

## Proses hapus background

Nggak ada tool "remove background" khusus di sandbox, jadi dikerjain manual
pakai Python + Pillow + numpy:

```python
from PIL import Image
import numpy as np

def remove_black_bg(input_path, output_path, threshold=30):
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    is_black = (r.astype(int) + g.astype(int) + b.astype(int)) < threshold
    arr[:,:,3] = np.where(is_black, 0, a)
    Image.fromarray(arr, "RGBA").save(output_path)
```

Logikanya: piksel yang jumlah R+G+B nya di bawah threshold (30, dari 765
maksimal) dianggap "hitam murni" (background), alpha-nya di-set 0 (transparan).
Karena sumbernya JPEG (lossy), background-nya nggak akan 100% hitam sempurna di
tiap piksel (ada noise kompresi) — threshold 30 dipilih cukup longgar buat
nangkep variasi noise itu tapi nggak sampe motong bagian gambar yang emang gelap
(misal shadow di logo).

## Verifikasi transparansi

Nggak cukup cuma "kelihatan transparan" pas dilihat langsung (background viewer
bisa aja putih, jadi transparan keliatan sama kayak putih solid). Diverifikasi
dengan cara nge-composite logo di atas warna SOLID yang beda (biru), pastiin
warna itu beneran "nembus" dari balik logo:

```python
def preview_on_bg(logo_path, bg_color, out_path):
    logo = Image.open(logo_path).convert("RGBA")
    bg = Image.new("RGBA", logo.size, bg_color)
    combined = Image.alpha_composite(bg, logo)
    combined.convert("RGB").save(out_path)
```

Hasilnya dicek visual (lihat gambar), biru beneran nembus di area yang tadinya
hitam — konfirmasi transparansi kerja bener, bukan cuma ilusi visual.

## Crop padding berlebih

Kedua gambar hasil remove-bg punya banyak ruang transparan kosong di
pinggir-pinggirnya (dari kanvas asli). Di-crop pakai `img.getbbox()` (nyari
bounding box konten non-transparan), terus dikasih padding tipis lagi (8-10px)
biar nggak terlalu mepet ke tepi:

```python
def trim_transparent(path, out_path, padding=6):
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    w, h = cropped.size
    padded = Image.new("RGBA", (w + padding*2, h + padding*2), (0,0,0,0))
    padded.paste(cropped, (padding, padding), cropped)
    padded.save(out_path)
```

## Penempatan

- `public/assets/images/logo-navbar.png` — dipasang di `Navbar.tsx`, gantiin
  emoji `⚜️` yang lama. Ukuran render `h-9` (36px tinggi), lebar otomatis
  (`w-auto`)
- `public/assets/images/favicon.png` — dipasang di `index.html`
  (`<link rel="icon" type="image/png" ...>`), gantiin `favicon.svg` yang lama

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses, dicek `dist/` beneran bawa kedua file gambar + link
  favicon di HTML udah nunjuk ke file yang bener

## PENTING buat testing manual

Favicon browser sering nge-cache lama — kalau nggak keliatan gambar baru di tab,
coba **hard refresh** (`Ctrl+Shift+R`) atau clear cache favicon manual.

File yang diubah: `index.html`, `src/components/layout/Navbar.tsx`.
File baru (gambar): `public/assets/images/logo-navbar.png`, `favicon.png`.
