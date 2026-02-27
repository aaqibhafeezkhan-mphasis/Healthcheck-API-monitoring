const fs = require('fs');
const path = require('path');

const targetExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css'];
const excludeDirs = ['node_modules', '.next', '.git'];

function stripComments(code, extension) {
    if (extension === '.css') {
        return code.replace(/\/\*[\s\S]*?\*\
    }

    
    
    
    
    
    
    
    const regex = /\/\*[\s\S]*?\*\/|\/\/.*/g;

    
    let result = '';
    let i = 0;
    let inString = null; 
    let inBlockComment = false;
    let inLineComment = false;

    while (i < code.length) {
        const char = code[i];
        const nextChar = code[i + 1];

        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                i += 2;
            } else {
                i++;
            }
            continue;
        }

        if (inLineComment) {
            if (char === '\n' || char === '\r') {
                inLineComment = false;
                
            } else {
                i++;
                continue;
            }
        }

        if (inString) {
            if (char === '\\') {
                result += char + (nextChar || '');
                i += 2;
            } else if (char === inString) {
                result += char;
                inString = null;
                i++;
            } else {
                result += char;
                i++;
            }
            continue;
        }

        
        if (char === '/' && nextChar === '*') {
            inBlockComment = true;
            i += 2;
        } else if (char === '/' && nextChar === '/') {
            inLineComment = true;
            i += 2;
        } else if (char === '"' || char === "'" || char === '`') {
            inString = char;
            result += char;
            i++;
        } else {
            result += char;
            i++;
        }
    }

    return result;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (targetExtensions.includes(ext)) {
                console.log(`Processing: ${fullPath}`);
                const content = fs.readFileSync(fullPath, 'utf8');
                const stripped = stripComments(content, ext);
                fs.writeFileSync(fullPath, stripped, 'utf8');
            }
        }
    }
}

const targetDir = process.argv[2] || process.cwd();
console.log(`🚀 Starting comment removal in: ${targetDir}`);
processDirectory(targetDir);
console.log('✅ All comments removed successfully!');
