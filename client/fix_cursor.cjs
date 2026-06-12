const fs = require('fs');
const files = [
  'src/pages/DestinationsPage.tsx',
  'src/pages/ToursPage.tsx',
];
files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/cursor:\s*'none'/g, "cursor: 'pointer'");
    c = c.replace(/cursor:\s*none\s*!important/g, "cursor: auto");
    fs.writeFileSync(f, c);
    console.log('Fixed: ' + f);
  } catch(e) { console.log('Error: ' + f + ' - ' + e.message); }
});
