const fs = require('fs');
let c = fs.readFileSync('app/routes/department.beauty.jsx', 'utf8');

const headingsToUpdate = [
  'Shop By Price',
  'Hottest Deals',
  'Travel Essentials',
  'Note Worthy Collection',
  'Maybelline',
  "L'Oreal"
];

headingsToUpdate.forEach(h => {
  const regex = new RegExp('(heading=\"' + h + '\"[\\s\\S]*?mobileView=\")[^\"]+(\"[\\s\\S]*?mobileCardsPerRow=\\{)\\d+(\\})');
  c = c.replace(regex, '$1gallery$22$3');
});

fs.writeFileSync('app/routes/department.beauty.jsx', c);
