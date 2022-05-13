const transformToSlug = (text: string, type?: 'curso' | 'categoria'): string => {
  if (!text) return '';

  const textFormatted = text
    ?.toLocaleLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('/', '-')
    .replaceAll(/[.,¿?!¡]/gm, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  return type === 'curso' ? `curso-${textFormatted}` : textFormatted;
};

const regexUncommonChars = (text: string) => {
  text = text.replaceAll('+', '%2B');
  text = text.replaceAll('#', '%23');

  return text;
};

const capitalizeFirst = (string: string) => string.substring(0, 1).toUpperCase() + string.substring(1);

const MarkdownItCodeBlocks = require('markdown-it-codeblocks');
const md = require('markdown-it')({
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  linkify: false, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',
}).use(MarkdownItCodeBlocks);

const textParserMd = (value: string) => {
  if (!value) return '';
  return value.includes('<', 0) ? value : md.render(value);
};

export { transformToSlug, regexUncommonChars, capitalizeFirst, textParserMd };
