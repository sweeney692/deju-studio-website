#!/usr/bin/env bash
# Build the Deju "Press On Nails Workshop" flyers: inline assets -> standalone HTML -> PDF/PNG.
# Run from anywhere; paths are resolved relative to this script.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$(cd "$DIR/.." && pwd)"               # marketing/flyer/  (final deliverables land here)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

inline () { python3 "$DIR/inline.py" "$DIR/$1.html" "$DIR/$1.inlined.html"; }

pdf () { # <template> <out.pdf>
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
    --print-to-pdf="$OUT/$2" "file://$DIR/$1.inlined.html" 2>/dev/null
  echo "  -> $2"
}

png () { # <template> <out.png> [WxH] [scale]
  local size="${3:-1080,1920}"; local scale="${4:-1}"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor="$scale" --window-size="$size" \
    --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
    --screenshot="$OUT/$2" "file://$DIR/$1.inlined.html" 2>/dev/null
  echo "  -> $2"
}

for t in editorial-a4 editorial-story photographic-a4 photographic-story \
         promo-editorial-story promo-editorial-ig promo-editorial-fb promo-editorial-a4 \
         hiring-editorial-story hiring-editorial-ig hiring-editorial-fb hiring-editorial-a4 \
         hiring-editorial-landscape; do inline "$t"; done

echo "Exporting workshop flyers:"
pdf editorial-a4       "Deju - Workshop Flyer - Editorial - A4.pdf"
pdf photographic-a4    "Deju - Workshop Flyer - Bold - A4.pdf"
png editorial-story    "Deju - Workshop Flyer - Editorial - Story.png"
png photographic-story "Deju - Workshop Flyer - Bold - Story.png"
# Vector/social PDFs of the stories too (handy for WhatsApp / printing one-up)
pdf editorial-story    "Deju - Workshop Flyer - Editorial - Story.pdf"
pdf photographic-story "Deju - Workshop Flyer - Bold - Story.pdf"

echo "Exporting mani+pedi / referral promo (Editorial, all placements):"
png promo-editorial-story "Deju - Promo - Editorial - Story.png"                       # 1080x1920 IG/FB Story + WhatsApp Status
png promo-editorial-ig    "Deju - Promo - Editorial - Instagram Ad 1080x1350.png" 1080,1350
png promo-editorial-fb    "Deju - Promo - Editorial - Facebook Ad 1080x1080.png" 1080,1080
png promo-editorial-a4    "Deju - Promo - Editorial - A4 WhatsApp.png" 794,1123 2      # A4 raster for WhatsApp image share
pdf promo-editorial-story "Deju - Promo - Editorial - Story.pdf"
pdf promo-editorial-a4    "Deju - Promo - Editorial - A4 WhatsApp.pdf"                  # vector A4 (210x297mm) for print / WhatsApp document
# Bold direction archived 2026-06-18 (marketing/flyer/_archive) - did not look right.

echo "Exporting hiring flyers (Editorial, all placements):"
png hiring-editorial-story "Deju - Hiring - Editorial - Story.png"                       # 1080x1920 IG Story + WhatsApp Status
png hiring-editorial-ig    "Deju - Hiring - Editorial - Instagram 1080x1350.png" 1080,1350
png hiring-editorial-fb    "Deju - Hiring - Editorial - Facebook 1080x1080.png" 1080,1080
png hiring-editorial-a4    "Deju - Hiring - Editorial - A4.png" 794,1123 2               # A4 raster for WhatsApp image share
png hiring-editorial-landscape "Deju - Hiring - Editorial - Landscape 1200x628.png" 1200,628   # 1.91:1 landscape (Meta link/feed)
pdf hiring-editorial-story "Deju - Hiring - Editorial - Story.pdf"
pdf hiring-editorial-a4    "Deju - Hiring - Editorial - A4.pdf"                           # vector A4 (210x297mm) for print / WhatsApp document

echo "Done."
