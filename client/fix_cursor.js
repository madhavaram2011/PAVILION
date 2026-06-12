const fs = require('fs');
const files = [
  'client/src/pages/DestinationsPage.tsx',
  'client/src/pages/HomePage.tsx',
  'client/src/pages/ToursPage.tsx',
];
files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/cursor:\s*'none'/g, "cursor: 'pointer'");
    fs.writeFileSync(f, c);
    console.log('Fixed: ' + f);
  } catch(e) { console.log('Skip: ' + f); }
});
