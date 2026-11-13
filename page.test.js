// Checks the styles of Sol Taco Truck's menu: the colors, the fonts and the selectors that README.md asks for.
// It reads index.html and styles.css and works out each element's final style, as a browser would.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');

// The page, with styles.css added to it. Nothing is downloaded: a Google Fonts link is read, not loaded.
const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() });
const { document } = dom.window;
const sheet = document.createElement('style');
sheet.textContent = css;
document.head.append(sheet);

const style = (element) => dom.window.getComputedStyle(element);
const all = (selector) => [...document.querySelectorAll(selector)];
const body = document.body;

// Every style rule in styles.css, and the selectors in each one's selector list.
const rules = [...sheet.sheet.cssRules];
const styleRules = rules.filter((rule) => rule.selectorText);
const selectorsOf = (rule) => rule.selectorText.split(',').map((s) => s.trim());
const hasSelector = (match) => styleRules.some((rule) => selectorsOf(rule).some(match));

// The stylesheet's text with its comments taken out, so a color named only in a comment doesn't count.
const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

// How far apart two colors are in lightness, as the contrast ratio from 1 (the same) to 21 (black on white).
const luminance = (rgb) => {
  const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((n) => {
    const c = Number(n) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};
const GENERIC = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif',
  'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong'];

// An element's font-family as a list, each name as written (quotes and all) and as a plain name to compare.
const unquote = (name) => name.trim().replace(/^["']|["']$/g, '');
const stackOf = (element) => style(element).fontFamily.split(',')
  .map((name) => name.trim()).filter((name) => name.length > 0);
const families = (element) => stackOf(element).map((name) => unquote(name).toLowerCase());

// The font names your page loads: from Google Fonts links in index.html, @import lines and @font-face rules.
function loadedFonts() {
  const names = new Set();
  const fromGoogle = (href) => {
    const url = new URL(href, 'https://example.com/');
    if (!url.hostname.endsWith('fonts.googleapis.com')) return;
    for (const family of url.searchParams.getAll('family')) names.add(family.split(':')[0].trim().toLowerCase());
  };
  for (const link of all('link[href]')) fromGoogle(link.getAttribute('href'));
  for (const rule of rules) {
    if (rule.href) fromGoogle(rule.href);
    if (rule.constructor.name === 'CSSFontFaceRule') {
      names.add(unquote(rule.style.getPropertyValue('font-family')).toLowerCase());
    }
  }
  return names;
}

test('the page links styles.css', () => {
  assert.ok(document.querySelector('link[rel="stylesheet"][href="styles.css"]'),
    'index.html needs <link rel="stylesheet" href="styles.css"> in its <head>. It was there in the starter: put it back.');
});

test('step 1: the page has a text color and a background color', () => {
  assert.notEqual(style(body).backgroundColor, TRANSPARENT,
    'Give body a background-color, so the page is not plain white.');
  assert.notEqual(style(body).color, 'rgb(0, 0, 0)',
    'Give body a text color with the color property, so the text is not plain black.');
  assert.notEqual(style(body).color, style(body).backgroundColor,
    'The body text color and background color are the same, so the text would be invisible.');
});

test('step 1: the palette is written in hex or hsl()', () => {
  const colors = cssWithoutComments.match(/#[0-9a-f]{3,8}\b|hsla?\(/gi) ?? [];
  assert.ok(colors.length >= 3,
    `styles.css has ${colors.length} colors written as hex codes or hsl() (comments don't count). Write at least three of your colors that way, such as #3b2a1a or hsl(14 77% 54%).`);
});

test('step 2: body text has a font stack that ends in a generic family', () => {
  const stack = families(body);
  assert.ok(styleRules.some((rule) => selectorsOf(rule).includes('body') && rule.style.getPropertyValue('font-family')),
    'Give the body rule a font-family: a list of fonts, your first choice first, such as "Trebuchet MS", Verdana, sans-serif.');
  assert.ok(stack.length >= 2,
    `body's font-family is ${style(body).fontFamily}. Give it a list: your first choice, then at least one fallback.`);
  const last = stackOf(body).at(-1);
  assert.ok(GENERIC.includes(stack.at(-1)),
    `body's font-family ends with ${last}. End the list with a generic family, such as sans-serif or serif.`);
  assert.ok(!/^["']/.test(last),
    `body's font-family ends with ${last}, in quotes. A generic family takes no quotes: in quotes, the browser looks for a font with that name.`);
});

test('step 2: body text is sized in rem, with a line-height that has no unit', () => {
  const sizedInRem = styleRules.some((rule) => selectorsOf(rule).includes('body')
    && /^\d*\.?\d+rem$/.test(rule.style.getPropertyValue('font-size').trim()));
  assert.ok(sizedInRem, 'Give the body rule a font-size in rem, such as 1.125rem.');
  const size = parseFloat(style(body).fontSize);
  assert.ok(size >= 16 && size <= 22,
    `body's font-size works out to ${size}px. Body text reads well between 1rem (16px) and 1.375rem (22px).`);
  const lineHeight = style(body).lineHeight;
  assert.ok(/^\d*\.?\d+$/.test(lineHeight),
    `body's line-height is "${lineHeight}". Give it a number with no unit, such as 1.5.`);
  assert.ok(Number(lineHeight) >= 1.3 && Number(lineHeight) <= 1.8,
    `body's line-height is ${lineHeight}. Body text reads well between 1.3 and 1.8.`);
});

test('step 3: the h1 and h2 headings use a web font, with a fallback', () => {
  const loaded = loadedFonts();
  for (const heading of [document.querySelector('h1'), document.querySelector('h2')]) {
    const tag = heading.tagName.toLowerCase();
    const stack = families(heading);
    const first = unquote(stackOf(heading)[0] ?? '');
    assert.notDeepEqual(stack, families(body), `The ${tag} headings use the same fonts as the body text. Give them a font-family of their own.`);
    assert.ok(loaded.has(stack[0]),
      `The ${tag} headings' first font is "${first}", but the page doesn't load a font by that name. Add its Google Fonts link lines to index.html, or an @font-face rule to styles.css, and spell the name the same way in both places.`);
    assert.ok(stack.length >= 2, `The ${tag} headings' font-family has no fallback. Add one or more after the web font, ending with a generic family.`);
  }
});

test('step 4: the section headings have a color of their own, set with a type selector', () => {
  assert.ok(hasSelector((selector) => /(^|[\s>+~])h2$/.test(selector)),
    'Add a rule with the type selector h2 (on its own or in a selector list, such as h1, h2).');
  for (const heading of all('h2')) {
    assert.notEqual(style(heading).color, style(body).color,
      `"${heading.textContent}" is the same color as the body text. Give h2 a color of its own.`);
  }
});

test('step 5: every price is bold, styled by its class', () => {
  assert.ok(hasSelector((selector) => selector === '.price'), 'Add a rule with the class selector .price.');
  for (const price of all('.price')) {
    assert.ok(Number(style(price).fontWeight) >= 600,
      `The price ${price.textContent} has a font-weight of ${style(price).fontWeight}. Make prices bold: 700, or bold.`);
  }
});

test('step 6: the spicy label stands out, styled by its class', () => {
  assert.ok(hasSelector((selector) => selector === '.spicy'), 'Add a rule with the class selector .spicy.');
  for (const label of all('.spicy')) {
    const { color, backgroundColor } = style(label);
    assert.notEqual(backgroundColor, TRANSPARENT, 'Give .spicy a background-color, so the label stands out.');
    assert.notEqual(backgroundColor, style(body).backgroundColor, ".spicy's background-color is the same as the page's. Choose a color that stands out.");
    assert.notEqual(color, backgroundColor, ".spicy's text color and background color are the same, so the word Spicy can't be read.");
  }
});

test("step 7: today's special has a background of its own, styled by its id", () => {
  assert.ok(hasSelector((selector) => selector === '#todays-special'), 'Add a rule with the id selector #todays-special.');
  const special = style(document.getElementById('todays-special')).backgroundColor;
  assert.notEqual(special, TRANSPARENT, "Give #todays-special a background-color, so today's special stands out.");
  assert.notEqual(special, style(body).backgroundColor, "#todays-special's background-color is the same as the page's. Choose a color that stands out from it.");
});

test("step 8: the header is a chalkboard: a picture over a dark color, with words you can read", () => {
  const header = document.querySelector('header');
  assert.ok(hasSelector((selector) => selector === 'header'), 'Add a rule with the type selector header.');
  const picture = style(header).backgroundImage.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
  assert.ok(picture, 'Give header a background-image: url("images/chalkboard.webp").');
  assert.ok(existsSync(picture[1]),
    `header's background-image points at "${picture[1]}", and there's no file there. The picture is images/chalkboard.webp: the path starts from the folder styles.css is in.`);
  const board = style(header).backgroundColor;
  assert.notEqual(board, TRANSPARENT,
    "Give header a background-color too: a dark one, close to the board's, such as #2b2f2e. It shows while the picture loads, and if it never does.");
  assert.ok(contrast(board, 'rgb(255, 255, 255)') >= 7,
    `header's background-color is ${board}, too light for a chalkboard. Choose a dark color close to the board's, such as #2b2f2e, so light words read on it.`);
  const tagline = style(document.querySelector('.tagline')).color;
  assert.ok(contrast(tagline, board) >= 4.5,
    `The tagline is ${tagline} on the header's ${board}: too close in lightness to read. Give header a light text color, such as #fff4e0: the tagline takes it from the header.`);
  const name = style(document.querySelector('h1')).color;
  assert.ok(contrast(name, board) >= 3,
    `The truck's name is ${name} on the header's ${board}: too close in lightness to read. Give h1 a lighter color.`);
});
