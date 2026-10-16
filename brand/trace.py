import subprocess, sys, shutil
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

SRC   = Path(sys.argv[1] if len(sys.argv) > 1 else "Alter_Ego_Logo.png")
OUT   = Path("layers")
SCALE = 2        # upscale sebelum trace agar tepi lebih halus
TURD  = 20       # buang bintik kecil hasil anti-aliasing (px)

# Palet warna logo. Cek dengan color picker dan sesuaikan kalau perlu.
PALETTE = {
    "red":        [(235, 28, 18), (150, 12, 12)],   # merah terang + merah gelap gradasi
    "black":      [(12, 10, 12)],
    "white":      [(250, 250, 250)],
    "gray_light": [(178, 178, 178)],
    "gray_mid":   [(120, 120, 120)],
    "gray_dark":  [(80, 80, 80)],
}
# Urutan dari paling bawah (belakang) ke paling atas (depan)
ORDER = ["red_outer", "black", "gray_dark", "gray_mid", "gray_light", "white", "red_detail"]
FILL = {
    "red_outer": "#e01a12", "black": "#0b0a0c", "gray_dark": "#505050",
    "gray_mid": "#787878", "gray_light": "#b2b2b2", "white": "#ffffff",
    "red_detail": "#ec1c12",
}

if not shutil.which("potrace"):
    sys.exit("potrace tidak ditemukan di PATH")

OUT.mkdir(exist_ok=True)
for f in OUT.glob("*"):
    f.unlink()

img = Image.open(SRC).convert("RGBA")
img = img.resize((img.width * SCALE, img.height * SCALE), Image.LANCZOS)
arr = np.asarray(img).astype(np.int32)
rgb, alpha = arr[..., :3], arr[..., 3]
inside = alpha >= 128

# Kuantisasi tiap piksel ke warna palet terdekat
names, refs = [], []
for n, cols in PALETTE.items():
    for c in cols:
        names.append(n); refs.append(c)
refs = np.array(refs)
dist = ((rgb[..., None, :] - refs[None, None]) ** 2).sum(-1)
nearest = np.array(names)[dist.argmin(-1)]

ids = {n: i + 1 for i, n in enumerate(PALETTE)}
label = np.zeros(alpha.shape, np.int32)
for n, i in ids.items():
    label[(nearest == n) & inside] = i
label = ndimage.median_filter(label, size=3)   # rapikan tepi antar warna

# Pisahkan merah: bingkai luar (komponen terbesar) vs detail (huruf T, mata)
red = label == ids["red"]
comp, n = ndimage.label(red)
sizes = ndimage.sum(red, comp, range(1, n + 1))
outer = comp == (np.argmax(sizes) + 1)

region = {
    "red_outer":  outer,
    "red_detail": red & ~outer,
    **{k: label == ids[k] for k in ["black", "white", "gray_light", "gray_mid", "gray_dark"]},
}
region["red_outer"] |= inside & (label == 0)   # sisa piksel tak terklasifikasi

# Mask kumulatif: tiap layer = dirinya + semua layer di atasnya → tidak ada celah
for i, name in enumerate(ORDER):
    mask = np.zeros_like(inside)
    for upper in ORDER[i:]:
        mask |= region[upper]
    if i == 0:
        mask = inside.copy()
    if not mask.any():
        continue
    pbm = OUT / f"{i:02d}_{name}.pbm"
    Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).convert("1").save(pbm)
    subprocess.run([
        "potrace", str(pbm), "-s", "-o", str(OUT / f"{i:02d}_{name}.svg"),
        "-C", FILL[name], "-t", str(TURD), "-a", "1.0", "-O", "0.4",
    ], check=True)
    pbm.unlink()
    print("✓", name)

print("Selesai → folder layers/")