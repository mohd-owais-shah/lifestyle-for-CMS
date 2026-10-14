const fs = require('fs');

const updates = [
  {
    file: 'app/routes/department.men.jsx',
    sections: [
      { heading: /heading=["'][^"']*Top Brands[^"']*["']/i, view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.kids.jsx',
    sections: [
      { heading: /heading=["'][^"']*Top Categories[^"']*["']/i, view: 'gallery', cols: 3 },
      { heading: /heading=["'][^"']*Top Brands[^"']*["']/i, view: 'gallery', cols: 2 },
      { heading: /heading=["'][^"']*Babyshop Collection[^"']*["']/i, view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.footwear.jsx',
    sections: [
      { heading: /heading=["'][^"']*Top Categories[^"']*["']/i, view: 'gallery', cols: 3 },
      { heading: /heading=["'][^"']*Featured Brands[^"']*["']/i, view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.bags.jsx',
    sections: [
      { heading: /heading=["'][^"']*Top Categories[^"']*["']/i, view: 'gallery', cols: 3 },
      { heading: /heading=["'][^"']*Price Point Store[^"']*["']/i, view: 'gallery', cols: 3 }
    ]
  },
  {
    file: 'app/routes/department.beauty.jsx',
    sections: [
      { heading: /heading=["'][^"']*Note Worthy[^"']*["']/i, view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.homeliving.jsx',
    sections: [
      { heading: /heading=["'][^"']*Decor Collections?[^"']*["']/i, view: 'gallery', cols: 2 },
      { heading: /heading=["'][^"']*Furnishing Collections?[^"']*["']/i, view: 'gallery', cols: 2 },
    ]
  },
  {
    file: 'app/routes/department.babyshop.jsx',
    sections: [
      { heading: /heading=["'][^"']*Tee Edit[^"']*["']/i, view: 'gallery', cols: 2 },
      { heading: /heading=["'][^"']*Tiny Tots[^"']*["']/i, view: 'gallery', cols: 2 },
      { heading: /heading=["'][^"']*Bottom[^"']*["']/i, view: 'gallery', cols: 2 },
      { heading: /heading=["'][^"']*Shop By Brand[^"']*["']/i, view: 'gallery', cols: 2 }
    ]
  }
];

updates.forEach(({file, sections}) => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  sections.forEach(sec => {
    // Find the DepartmentShowcase that matches the heading regex
    const compRegex = new RegExp(`(<DepartmentShowcase[^>]*${sec.heading.source}[^>]*)(/>|>)`, 'i');
    const match = content.match(compRegex);
    
    if (match) {
      let tagContent = match[1];
      tagContent = tagContent.replace(/mobileView="[^"]*"\s*/, '');
      tagContent = tagContent.replace(/mobileCardsPerRow=\{[^}]*\}\s*/, '');
      
      const replacement = `${tagContent}\n        mobileView="${sec.view}"\n        mobileCardsPerRow={${sec.cols}}\n      ${match[2]}`;
      content = content.replace(match[0], replacement);
    } else {
      console.log(`Heading not found in ${file}: ${sec.heading}`);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
