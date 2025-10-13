// Script Node.js para corrigir imports da Engenharia Matricial
const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /from ['"]@\/contexts\/OSContext['"]/g, to: "from '@/contexts/engenharia-matricial/OSContext'" },
  { from: /from ['"]@\/lib\/dadosAnuais['"]/g, to: "from '@/lib/engenharia-matricial/dadosAnuais'" },
  { from: /from ['"]@\/lib\/usuarios['"]/g, to: "from '@/lib/engenharia-matricial/usuarios'" },
  { from: /from ['"]@\/components\/FinalizacaoOSModal['"]/g, to: "from '@/components/engenharia-matricial/FinalizacaoOSModal'" },
  { from: /\{ formatarCCAComCliente \} from ['"]@\/lib\/utils['"]/g, to: "{ formatarCCAComCliente } from '@/lib/engenharia-matricial/utils'" }
];

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
};

const scanDir = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  });
};

scanDir('src/pages/engenharia-matricial');
console.log('All imports fixed!');
