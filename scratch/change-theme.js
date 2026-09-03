const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components')
];

const replacements = [
  // Hardcoded background colors to transparent/light panels
  { search: /bg-\[\#030810\]\/30/g, replace: 'bg-slate-100/40' },
  { search: /bg-\[\#030810\]\/40/g, replace: 'glass-panel' },
  { search: /bg-\[\#030810\]\/50/g, replace: 'bg-slate-50/60' },
  { search: /bg-\[\#030810\]\/60/g, replace: 'glass-panel' },
  { search: /bg-\[\#030810\]\/70/g, replace: 'glass-panel' },
  { search: /bg-\[\#030810\]\/75/g, replace: 'glass-panel' },
  { search: /bg-\[\#030810\]\/80/g, replace: 'glass-panel' },
  { search: /bg-\[\#030810\]/g, replace: 'bg-background' },
  { search: /bg-white\/3/g, replace: 'bg-slate-100/40' },
  { search: /bg-white\/5/g, replace: 'bg-slate-100/60' },
  
  // Borders
  { search: /border-white\/5/g, replace: 'border-slate-200/60' },
  { search: /border-white\/10/g, replace: 'border-slate-200' },
  { search: /border-white\/15/g, replace: 'border-slate-300/60' },
  
  // Text colors (muted/gray to slate)
  { search: /text-gray-300/g, replace: 'text-slate-600' },
  { search: /text-gray-400/g, replace: 'text-slate-500' },
  { search: /text-gray-500/g, replace: 'text-slate-400' },
  
  // Specific glow gradients (for dark theme, they used dark bg)
  { search: /from-accent-blue\/10 to-transparent/g, replace: 'from-accent-blue/5 to-transparent' },
  { search: /from-accent-gold\/10 to-transparent/g, replace: 'from-accent-gold/5 to-transparent' },
  { search: /opacity-25 filter blur-3xl/g, replace: 'opacity-10 filter blur-3xl' },
  { search: /opacity-15 filter blur-3xl/g, replace: 'opacity-5 filter blur-3xl' },
  { search: /opacity-20 filter blur-3xl/g, replace: 'opacity-8 filter blur-3xl' },
  { search: /opacity-10 filter blur-3xl/g, replace: 'opacity-5 filter blur-3xl' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Run replacements map
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });

  // Contextual text-white replacement in JSX:
  // Find className="..." and replace text-white with text-slate-900/text-foreground/etc.
  if (!filePath.endsWith('TipTapEditor.tsx') && !filePath.endsWith('SignOutButton.tsx')) {
    content = content.replace(/(className="[^"]*)"/g, (match, classNameVal) => {
      // If className includes a dark background class, keep text-white
      if (classNameVal.includes('bg-slate-900') || 
          classNameVal.includes('bg-slate-950') || 
          classNameVal.includes('bg-[#0a2540]') || 
          classNameVal.includes('bg-[#003b95]') ||
          classNameVal.includes('bg-accent-blue') || 
          classNameVal.includes('bg-black') ||
          classNameVal.includes('text-black') || // if it already specifies text-black on hover
          classNameVal.includes('bg-gradient-to-r from-accent-gold') ||
          classNameVal.includes('hover:text-black') ||
          classNameVal.includes('active-underline') // layout line
      ) {
        return match; // do not replace
      }
      
      // Otherwise replace text-white with text-slate-900
      return classNameVal.replace(/\btext-white\b/g, 'text-slate-900') + '"';
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      processFile(fullPath);
    }
  });
}

console.log("Starting theme transformation...");
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    traverseDirectory(dir);
  }
});
console.log("Theme transformation completed successfully!");
