const fs = require('fs');
const path = require('path');

function replaceClassNameWithClass(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceClassNameWithClass(filePath);
    } else if (filePath.endsWith('.astro')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('className=')) {
        content = content.replace(/className=/g, 'class=');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

replaceClassNameWithClass(path.join(__dirname, 'src'));
console.log('Done!');
