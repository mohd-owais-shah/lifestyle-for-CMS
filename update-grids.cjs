const fs = require('fs');

const updates = [
  {
    file: 'app/routes/department.men.jsx',
    sections: [
      { heading: 'Top Brands', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.kids.jsx',
    sections: [
      { heading: 'Top Categories', view: 'gallery', cols: 3 },
      { heading: 'Top Brands', view: 'gallery', cols: 2 },
      { heading: 'Babyshop Collection', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.footwear.jsx',
    sections: [
      { heading: 'Top Categories', view: 'gallery', cols: 3 },
      { heading: 'Featured Brands', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.bags.jsx',
    sections: [
      { heading: 'Top Categories', view: 'gallery', cols: 3 },
      { heading: 'Price Point Store', view: 'gallery', cols: 3 }
    ]
  },
  {
    file: 'app/routes/department.beauty.jsx',
    sections: [
      { heading: 'Shop By Price', view: 'gallery', cols: 2 },
      { heading: 'Hottest Deals', view: 'gallery', cols: 2 },
      { heading: 'Travel Essentials', view: 'gallery', cols: 2 },
      { heading: 'Note Worthy Collection', view: 'gallery', cols: 2 },
      { heading: 'Maybelline', view: 'gallery', cols: 2 },
      { heading: "L'Oreal", view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.homeliving.jsx',
    sections: [
      { heading: '500+ Gifting Ideas', view: 'gallery', cols: 1 },
      { heading: 'Decor Collections', view: 'gallery', cols: 2 },
      { heading: 'Furnishing Collections', view: 'gallery', cols: 2 },
      { heading: 'Kitchenware', view: 'gallery', cols: 2 },
      { heading: 'Crockery & Table Linen', view: 'gallery', cols: 2 },
      { heading: 'Bath & Laundry', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.babyshop.jsx',
    sections: [
      { heading: 'The Tee Edit', view: 'gallery', cols: 2 },
      { heading: 'Tiny Tots Essentials Collection', view: 'gallery', cols: 2 },
      { heading: 'Its Bottom Collections', view: 'gallery', cols: 2 },
      { heading: 'Shop By Brand', view: 'gallery', cols: 2 }
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
    // Escape regex characters in heading
    const headingEscaped = sec.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // We are looking for something like:
    // <DepartmentShowcase
    //   heading="Top Brands"
    //   bannerPosition="none"
    //   collections={...}
    //   desktopView="gallery"
    //   desktopCardsPerRow={6}
    // />
    
    // The regex matches <DepartmentShowcase followed by any characters until heading="...", then any characters until />
    const regex = new RegExp(`(<DepartmentShowcase[^>]*heading="${headingEscaped}"[^>]*)(/>|>)`, 'i');
    
    const match = content.match(regex);
    if (match) {
      // First, remove existing mobileView and mobileCardsPerRow if they exist
      let tagContent = match[1];
      tagContent = tagContent.replace(/mobileView="[^"]*"\s*/, '');
      tagContent = tagContent.replace(/mobileCardsPerRow=\{[^}]*\}\s*/, '');
      
      // Then append the new ones right before the closing tag
      const replacement = `${tagContent}\n        mobileView="${sec.view}"\n        mobileCardsPerRow={${sec.cols}}\n      ${match[2]}`;
      content = content.replace(match[0], replacement);
    } else {
      console.log(`Heading not found in ${file}: ${sec.heading}`);
      // Also try case-insensitive check just in case the heading has different casing in the file
      const looseRegex = new RegExp(`(<DepartmentShowcase[^>]*heading=["'][^"']*${headingEscaped}[^"']*["'][^>]*)(/>|>)`, 'i');
      const looseMatch = content.match(looseRegex);
      if (looseMatch) {
         console.log(`  Found loose match for ${sec.heading}`);
         let tagContent = looseMatch[1];
         tagContent = tagContent.replace(/mobileView="[^"]*"\s*/, '');
         tagContent = tagContent.replace(/mobileCardsPerRow=\{[^}]*\}\s*/, '');
         const replacement = `${tagContent}\n        mobileView="${sec.view}"\n        mobileCardsPerRow={${sec.cols}}\n      ${looseMatch[2]}`;
         content = content.replace(looseMatch[0], replacement);
      }
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
