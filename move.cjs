const fs = require('fs');
const path = require('path');
const dir = 'app/routes';
const files = fs.readdirSync(dir).filter(f => f.startsWith('department.') && f.endsWith('.jsx')).map(f => path.join(dir, f));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  const annRegex = /<div className="lg:hidden">\s*<AnnouncementBar announcements=\{announcements\} \/>\s*<\/div>\s*/;
  
  if (annRegex.test(content)) {
    content = content.replace(annRegex, '');
    content = content.replace(/(<PdpMobileHeader[^>]*\/>)/, '$1\n      <div className="lg:hidden">\n        <AnnouncementBar announcements={announcements} />\n      </div>');
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  } else {
    console.log('No match in', file);
  }
});
