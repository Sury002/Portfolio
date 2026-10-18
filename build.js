const fs = require('node:fs');
const path = require('node:path');
const Babel = require('@babel/standalone');

const root = __dirname;
const appSource = fs.readFileSync(path.join(root, 'app.jsx'), 'utf8');
const appOutput = Babel.transform(appSource, {
  presets: [['react', { runtime: 'classic' }]],
  sourceType: 'script',
  comments: false,
  compact: true,
});
fs.writeFileSync(path.join(root, 'app.js'), appOutput.code);

const vendorDirectory = path.join(root, 'Assets', 'vendor');
fs.mkdirSync(vendorDirectory, { recursive: true });
for (const [source, destination] of [
  ['react/umd/react.production.min.js', 'react.production.min.js'],
  ['react-dom/umd/react-dom.production.min.js', 'react-dom.production.min.js'],
  ['three/build/three.min.js', 'three.min.js'],
]) {
  fs.copyFileSync(
    path.join(root, 'node_modules', source),
    path.join(vendorDirectory, destination),
  );
}
