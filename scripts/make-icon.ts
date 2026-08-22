import fs from 'fs';
import path from 'path';

const srcImg = 'C:\\Users\\Nick_\\.gemini\\antigravity-ide\\brain\\c66638ea-60cf-44ba-88f9-7a35e6672d33\\.user_uploaded\\media_1787366426332.jpg';
const targets = [
  'C:\\Users\\Nick_\\.gemini\\antigravity-ide\\brain\\vtuber-subtitle-app\\public\\app-icon.png',
  'C:\\Users\\Nick_\\.gemini\\antigravity-ide\\brain\\vtuber-subtitle-app\\public\\favicon.png',
  'C:\\Users\\Nick_\\.gemini\\antigravity-ide\\brain\\vtuber-subtitle-app\\dist\\ui\\app-icon.png',
  'C:\\Users\\Nick_\\.gemini\\antigravity-ide\\brain\\c66638ea-60cf-44ba-88f9-7a35e6672d33\\src-ui\\app-icon.png',
];

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(srcImg, target);
  console.log(`Copied icon to: ${target}`);
}

console.log('New app icon successfully placed!');
