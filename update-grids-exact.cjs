const fs = require('fs');

const updates = [
  {
    file: 'app/routes/department.men.jsx',
    sections: [
      { headingMatcher: 'menPageData[1].section_title', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.kids.jsx',
    sections: [
      { headingMatcher: 'kidsPageData.sections[1].title', view: 'gallery', cols: 3 },
      { headingMatcher: 'kidsPageData.sections[4].section_title', view: 'gallery', cols: 2 },
      { headingMatcher: 'kidsPageData.sections[7].section_title', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.footwear.jsx',
    sections: [
      { headingMatcher: 'footwearPageData.sections[1].title', view: 'gallery', cols: 3 },
      { headingMatcher: 'footwearPageData.sections[5].section_title', view: 'gallery', cols: 2 }
    ]
  },
  {
    file: 'app/routes/department.bags.jsx',
    sections: [
      { headingMatcher: 'bagsPageData.sections[3].section_name', view: 'gallery', cols: 3 },
      { headingMatcher: 'bagsPageData.sections[6].section_name', view: 'gallery', cols: 3 } // Assumed price point store, I will verify it's there
    ]
  }
];

updates.forEach(({file, sections}) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  sections.forEach(sec => {
    // Find heading index
    const headingIdx = content.indexOf(`heading={${sec.headingMatcher}}`);
    if (headingIdx === -1) {
       console.log('Not found:', sec.headingMatcher, 'in', file);
       return;
    }
    
    // Find the end of this DepartmentShowcase tag
    const endIdx = content.indexOf('/>', headingIdx);
    
    if (endIdx !== -1) {
       let tagContent = content.substring(headingIdx, endIdx);
       
       // Clean up old ones
       tagContent = tagContent.replace(/mobileView="[^"]*"\s*/, '');
       tagContent = tagContent.replace(/mobileCardsPerRow=\{[^}]*\}\s*/g, '');
       
       // Add new ones right before the end
       tagContent = tagContent.trimEnd() + `\n          mobileView="${sec.view}"\n          mobileCardsPerRow={${sec.cols}}\n        `;
       
       content = content.substring(0, headingIdx) + tagContent + content.substring(endIdx);
    }
  });

  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
