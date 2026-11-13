# Exercise: The Taco Truck Menu

Exercise code for the lesson **Exercise: The Taco Truck Menu** in CSS in Depth on [ask-codey.com](https://www.ask-codey.com).

Sol Taco Truck's menu page is written, and it looks like every unstyled page: black text in the browser's default font on plain white. You'll give it the truck's look in `styles.css`: a color palette, a web font for the headings, readable body text, labels and prices that stand out, each chosen with the right selector, and a chalkboard behind the truck's name. Tests check every step.

## What's here

- `index.html`: the menu page: the truck's name, today's special, tacos, burritos and drinks, with prices and *Spicy* and *New* labels. Ready to use. The only change it may need is a few link lines in its `<head>` for a Google font (step 3); a comment there marks the spot.
- `styles.css`: empty except for a comment that lists the steps and the truck's brand colors. For you to finish.
- `images/chalkboard.webp`: a chalkboard picture for the header (step 8).
- `page.test.js` and `package.json`: the tests that check your styles, and the list of what they need. You don't need to change these.

## Run it

Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. The page reloads every time you save.

## Check your work

In VS Code, open a terminal (**Terminal > New Terminal**), and run this once, to download what the tests need:

```bash
npm install
```

Then run the tests, as often as you like:

```bash
npm test
```

At first almost every test fails: that is expected. Each step you finish turns its test green. A failing test's message says what it checked and what to fix, for example: *Add a rule with the class selector .spicy.*

## What to do

1. **The page's colors.** Give `body` a text color and a background color. Write your palette in hex codes or `hsl()`: at least three of the colors in your file. The truck's brand colors are in the comment at the top of `styles.css`, or choose your own.
2. **Readable body text.** In the same `body` rule, set a `font-family` with fallbacks, ending in a generic family such as `sans-serif`; a `font-size` in `rem`, between `1rem` and `1.375rem`; and a `line-height` with no unit, between `1.3` and `1.8`.
3. **A web font for the headings.** Choose a font on Google Fonts (fonts.google.com) and put its link lines in the `<head>` of `index.html`, above the `styles.css` line. Or download a `.woff2` file into a `fonts` folder and load it with `@font-face` in `styles.css`. Then use the font as the first `font-family` of `h1` and `h2`, with a fallback after it.
4. **Section headings.** Give `h2` a color of its own, different from the body text, with a type selector.
5. **Prices.** Make every price bold, with the class selector `.price`.
6. **The spicy label.** Give `.spicy` a background color and a text color, so the label stands out from the page.
7. **Today's special.** Give the section with the id `todays-special` a background color of its own, with an id selector.
8. **The truck's chalkboard.** Put `images/chalkboard.webp` behind the `header` with `background-image` and `url()`. Under it, give `header` a dark `background-color` close to the board's, such as `#2b2f2e`, which shows while the picture loads and if it never does. Then give `header` a light text `color`, such as the cream `#fff4e0`: the tagline takes it from the header. If the truck's name is hard to read on the board, give `h1` a lighter color.

**Extras, if you like:** style the `.new` labels, cross out the old price (`.old-price`), and try `text-transform`, `letter-spacing` and `text-align` on the headings. Try `background-size: 200px` on the header, to make the chalk smudges smaller.

## The rules

- Change only `styles.css`, plus the font link lines in the `<head>` of `index.html` if you use Google Fonts. The tests read the HTML as it is.
- Keep text readable: dark text on a light background, or light on dark.
- The tests check that each step is done, not which colors or fonts you choose. How it looks is up to you.

## Tips

- Work one step at a time, save, and look at the page before you run the tests.
- A dot selects a class (`.price`), and a hash selects an id (`#todays-special`). The name after it must match the HTML exactly.
- A font's name must be spelled the same way in every place you use it: the Google Fonts link or `@font-face`, and `font-family`.
- Generic families such as `sans-serif` take no quotes.
- A path in `url()` starts from the folder `styles.css` is in, so the chalkboard is `url("images/chalkboard.webp")`. No picture? Open the developer tools' Console: a red *404 (Not Found)* line shows the path the browser tried.
- If a color doesn't show up, open the developer tools (F12, or Cmd+Option+I on a Mac): a crossed-out or flagged declaration in the Styles pane is one the browser skipped.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Page Online for Free* walks through every screen.
