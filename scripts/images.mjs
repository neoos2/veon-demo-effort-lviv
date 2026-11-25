// One-off image pipeline for the demo: client photos from ../audit/client-img → public/img (WebP, several widths).
// Single treatment for every photo: crop, monochrome mapped from ink (#212121) to paper (#F4F3EF).
// Run: node scripts/images.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = '../audit/client-img/';
const OUT = 'public/img/';
fs.mkdirSync(OUT, { recursive: true });

const photos = [
  { name: 'rail', file: 'effort-menu-xl-suprovid-zaliznuchnuh-vantashiv-dji-0010.00-07-44-14.still053-min.jpg', crop: { left: 0, top: 360, width: 440, height: 550 }, widths: [440] },
  { name: 'systems', file: 'effort-menu-xl-photo-sustema-bezpeky-1515432085503-cabf2fbcd690-min.jpg', crop: { left: 0, top: 120, width: 800, height: 500 }, widths: [400, 800] },
  { name: 'fire', file: 'effort-menu-xl-protupozezna-ohorona-efort161-min.jpg', crop: { left: 0, top: 450, width: 800, height: 500 }, widths: [400, 800] },
  { name: 'pult2', file: 'effort-service-xl-pult-centralnoi-ohoronu-photo1-efort062.2aa6cff31b71bc42954864800ae2044a14.jpg', crop: { left: 300, top: 0, width: 416, height: 520 }, widths: [416] },
  { name: 'guard', file: 'effort-menu-xl-fizuchna-ohorona-efort124-min.jpg', crop: { left: 0, top: 60, width: 800, height: 1000 }, widths: [400, 800] },
  { name: 'valuables', file: 'effort-menu-xl-suprovid-materialnyh-cinnostey-efort018-min.jpg', crop: { left: 0, top: 420, width: 800, height: 1000 }, widths: [400, 800] },
];

// ink #212121 (33) → paper #F4F3EF (~243): linear map of the grey channel
const lo = 33, hi = 243;
for (const p of photos) {
  for (const w of p.widths) {
    await sharp(SRC + p.file)
      .extract(p.crop)
      .resize({ width: w })
      .greyscale()
      .linear(1.12, -14)          // a touch more contrast before the map
      .linear((hi - lo) / 255, lo) // map black→ink, white→paper
      .webp({ quality: 74, effort: 6 })
      .toFile(`${OUT}${p.name}-${w}.webp`);
  }
  const h = Math.round(p.crop.height * (p.widths.at(-1) / p.crop.width));
  console.log(p.name, p.widths.join('/'), 'ratio', p.crop.width + 'x' + p.crop.height, 'last h', h);
}

// Client logo (real file, not redrawn)
for (const h of [48, 96]) {
  await sharp(SRC + 'logoPng.png').resize({ height: h }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}logo-${h}.webp`);
}
await sharp(SRC + 'logoPng.png').resize({ height: 192 }).png().toFile(`${OUT}logo-192.png`);
await sharp(SRC + 'favicon-32x32.png').toFile('public/favicon-32.png');

// Client logos for the dark band, monochrome
const logos = ['okko-group', 'naftogaz', 'raifaisen', 'vsbank', 'fujikura', 'hliboprom', 'tech-park', 'universal'];
for (const l of logos) {
  const m = await sharp(SRC + l + '.png').metadata();
  await sharp(SRC + l + '.png').ensureAlpha().greyscale().webp({ quality: 90, alphaQuality: 100, lossless: true }).toFile(`${OUT}client-${l}.webp`);
  console.log('logo', l, m.width + 'x' + m.height);
}
