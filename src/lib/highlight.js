// Minimal regex highlighter for the languages used in the case studies.
// Output uses Prism-style class names so code.css can colour tokens.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const STR = /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\])*"/
const NUM = /\b\d+(?:\.\d+)?\b/
const CLASS = /\b[A-Z][A-Za-z0-9_]*\b/
const CALL = /\b[a-zA-Z_]\w*(?=\s*\()/

const JS_KW = /\b(?:const|let|var|function|return|if|else|for|while|of|in|new|class|extends|import|from|export|default|async|await|try|catch|finally|throw|null|undefined|true|false|this|typeof|switch|case|break|continue)\b/

const RULES = {
  php: [
    ['comment', /\/\/[^\n]*|#(?!\[)[^\n]*|\/\*[\s\S]*?\*\//],
    ['string', STR],
    ['keyword', /<\?php|\?>/],
    ['variable', /\$[A-Za-z_]\w*/],
    ['keyword', /\b(?:function|fn|return|if|else|elseif|foreach|for|while|as|new|class|extends|implements|public|private|protected|static|use|namespace|echo|print|null|true|false|array|match|try|catch|throw|require|require_once|include|const|isset|empty|unset|and|or|self|parent)\b/],
    ['class-name', CLASS],
    ['function', CALL],
    ['number', NUM],
  ],
  javascript: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ['string', /`(?:\\.|[^`\\])*`/],
    ['string', STR],
    ['keyword', JS_KW],
    ['class-name', CLASS],
    ['function', CALL],
    ['number', NUM],
  ],
  jsx: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ['string', /`(?:\\.|[^`\\])*`/],
    ['tag', /<\/?[A-Za-z][\w.]*|\/?>/],
    ['string', /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\\n])*'(?=\s*[,)\]};:])/],
    ['keyword', JS_KW],
    ['attr-name', /\b[a-zA-Z-]+(?==)/],
    ['class-name', CLASS],
    ['function', CALL],
    ['number', NUM],
  ],
  markup: [
    ['comment', /<!--[\s\S]*?-->|\{\{--[\s\S]*?--\}\}/],
    ['variable', /\{\{[\s\S]*?\}\}|\{!![\s\S]*?!!\}/],
    ['keyword', /@[a-zA-Z]+/],
    ['tag', /<\/?[A-Za-z][\w-]*|\/?>/],
    ['attr-name', /\b[\w:-]+(?==)/],
    ['string', /"[^"]*"|'[^']*'/],
  ],
  bash: [
    ['comment', /#[^\n]*/],
    ['string', STR],
    ['function', /^\s*[a-z][\w.-]*|(?<=&&\s*)[a-z][\w.-]*/m],
    ['attr-name', /\s--?[\w-]+/],
    ['variable', /\$\w+/],
  ],
  json: [
    ['property', /"(?:\\.|[^"\\])*"(?=\s*:)/],
    ['string', /"(?:\\.|[^"\\])*"/],
    ['number', /-?\b\d+(?:\.\d+)?\b/],
    ['keyword', /\b(?:true|false|null)\b/],
  ],
}
RULES.css = RULES.javascript
RULES.sql = RULES.php

const compiled = {}
function compile(lang) {
  if (!compiled[lang]) {
    const rules = RULES[lang] || RULES.markup
    compiled[lang] = {
      types: rules.map(([t]) => t),
      re: new RegExp(rules.map(([, r]) => `(${r.source})`).join('|'), rules.some(([, r]) => r.multiline) ? 'gm' : 'g'),
    }
  }
  return compiled[lang]
}

export function highlight(code, lang) {
  const { types, re } = compile(lang)
  let out = ''
  let last = 0
  for (const m of code.matchAll(re)) {
    if (!m[0]) continue
    out += esc(code.slice(last, m.index))
    const g = m.findIndex((v, i) => i > 0 && v !== undefined)
    out += `<span class="token ${types[g - 1]}">${esc(m[0])}</span>`
    last = m.index + m[0].length
  }
  return out + esc(code.slice(last))
}
