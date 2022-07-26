// rufflib-formulate/scripts/build-css.js

// Called by `npm run build:css` during the build process.

import fs from 'fs';
import { minify } from 'csso';

function resolveImports(path) {
    return fs.readFileSync(path).toString().split('\n').map(line => {
        const result = line.match(/@import\s+['"]([-_.\/0-9a-zA-Z]+)['"]/);
        if (! result) return line;
        return resolveImports(`${path.split('/').slice(0, -1).join('/')}/${result[1]}`);
    }).join('\n') + '\n\n';
}

const minifiedCss = minify(resolveImports('src/docs/css/style.css')).css;

let lines = [''];
for (let i=0, l=minifiedCss.length; i<l; i++) {
    const currLineIndex = lines.length - 1;
    if (minifiedCss[i] === '\n') {
        lines.push('');
    } else {
        lines[currLineIndex] += minifiedCss[i];
        if (minifiedCss[i] === '}' && lines[currLineIndex].length > 80)
            lines.push('');
    }
}

fs.mkdirSync('docs/css');
fs.writeFileSync('docs/css/style.css', lines.join('\n'));
