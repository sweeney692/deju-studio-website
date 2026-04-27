#!/usr/bin/env bash
# Optimise the curated gallery into web-ready assets/img/.
# Produces 1600w (long edge) JPG + WebP for each image.
# Run from repo root: bash scripts/optimize-images.sh

set -euo pipefail

SRC="Image Gallery"
DST="assets/img"
mkdir -p "$DST"

# image_basename | source filename | category | alt text
images=(
  "hero-sea-creatures|IMG_4219.JPG|nail-art|Long navy almond nails with hand-painted sea-creature accents on the ring fingers, on an open book"
  "hero-hydrangea|Nail Art.JPG|nail-art|Pink and pearl nails with three-dimensional florals and gold detailing, resting on blue hydrangeas"
  "hero-pastel-florals|IMG_8714.JPG|nail-art|Almond nails with a multi-pastel floral wash across each finger"
  "hero-black-chrome|IMG_5630.jpg|extensions|Black chrome almond extensions with a polished glass finish"
  "manicure-milky|IMG_7421.JPG|manicure|Short milky-nude manicure on natural nails"
  "manicure-nude-square|IMG_8906.jpg|manicure|Long square soft-nude manicure"
  "manicure-pink-chrome|IMG_3863.jpg|manicure|Pearl-pink chrome almond manicure"
  "manicure-tiffany|IMG_1143.jpg|manicure|Tiffany-blue chrome short manicure"
  "manicure-red-short|IMG_7328.JPG|manicure|Bright red short almond manicure on an open book"
  "manicure-purple-yellow|IMG_3522.JPG|manicure|Long purple-to-yellow ombre cat-eye manicure"
  "art-cats|IMG_4457.jpg|nail-art|Square nails with hand-painted black-cat illustrations"
  "art-leopard|IMG_4677.jpg|nail-art|Pink marble nails with leopard accents"
  "art-daisies|IMG_5937.JPG|nail-art|Short nude manicure with hand-painted daisies"
  "art-teddy|IMG_6721.JPG|nail-art|Plaid manicure with cartoon teddy-bear accents"
  "art-3d-flowers|IMG_0175.JPG|3d-nail-art|French manicure with three-dimensional white floral accents"
  "art-3d-leaves|IMG_0993.jpg|3d-nail-art|Olive chrome nails with three-dimensional leaf detailing"
  "art-3d-chrome|IMG_5248.jpg|3d-nail-art|Mixed chrome almond nails with three-dimensional flower accents"
  "art-3d-pearl|IMG_3248.jpg|3d-nail-art|Pearl manicure with snake-and-floral motifs"
  "ext-red|IMG_3505.JPG|extensions|Red almond extensions on natural-toned hands"
  "ext-square-chrome|IMG_5237.JPG|extensions|Square chrome extensions with three-dimensional silver flowers"
  "ped-red-flower|2CE76A2E-9874-4E3D-82D8-C4BE5181C73D.JPEG|pedicure|Red gel pedicure with hand-painted floral accent"
  "ped-coral|AA15B66E-83FB-4944-B939-8705F710B3F3.JPEG|pedicure|Coral gel pedicure on a soft towel"
  "ped-pearl|IMG_8956.jpg|pedicure|Pearl French gel pedicure"
  "ped-navy|IMG_8961.jpg|pedicure|Navy gel pedicure"
)

for entry in "${images[@]}"; do
  IFS='|' read -r name src category alt <<< "$entry"
  echo "→ $name"
  magick "$SRC/$src" -auto-orient -resize "1600x1600>" -quality 82 -strip "$DST/$name.jpg"
  magick "$SRC/$src" -auto-orient -resize "1600x1600>" -quality 80 -define webp:method=6 -strip "$DST/$name.webp"
done

echo "Done."
