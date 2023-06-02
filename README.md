# ReMDX

Create beautiful minimalist presentations with React & MDX.

## Setup

```bash
npm init remdx
```

And:

```bash
npm run dev
```

### Custom Setup

See the [Example Deck](/cpojer/remdx/tree/main/examples/tokyo) to get started with adding ReMDX to your project:

```bash
npm add @nkzw/remdx @nkzw/vite-plugin-remdx
```

`vite.config.js`:

```js
import remdx from '@nkzw/vite-plugin-remdx';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [remdx(), react()],
});
```

`index.html`:

```html
<div id="app"></div>
<script type="module">
  import '@nkzw/remdx/style.css';
  import { render } from '@nkzw/remdx';

  render(document.getElementById('app'), import('./slides.re.mdx'));
</script>
```

Then create your `slides.re.mdx` and start the dev server via `npx run vite dev`.

## Usage

- Individual slides are separated by three dashes: `---`.
- Front matter blocks can be inserted at the top of a slide and separated from the slide content by two dashes: `--`. The theme can be set via `theme: <name>`, and background images can be set via `image: <url>`, referring to images in the `public/` folder.
- You can export a set of HTML and custom components using `export { Components } from `./Components`. The `Components.tsx` file should export an object with component names mapping to their implementation as default export.
- ReMDX provides a default theme, but you can leave it out and bring your own or customize styles via
- Code blocks are styled via [`shiki-twoslash`](https://shikijs.github.io/twoslash/) and support syntax highlighting via [CSS variables](https://github.com/cpojer/remdx/blob/main/packages/remdx/style.css#L19-L74).
- The inbuilt image component used for inline images via Markdown syntax (for example: `![Tokyo in the Dark](dark.jpg?height=60vh&borderRadius=20px)`) can be styled by passing CSS properties to the query string.

## Context & Decisions

### Prior Art

ReMDX was inspired by:

- [mdx-deck](https://github.com/jxnblk/mdx-deck)
- [Spectacle](https://github.com/FormidableLabs/spectacle)
- [Slidev](https://github.com/slidevjs/slidev/)

The core of ReMDX is a lean fork of Spectacle. `create-remdx` is based on Slidev. I'd like to thank the authors of the above tools for their awesome work.

### Why ReMDX?

All three of the above solutions fall short in some way. Some are a bit outdated, and some have too much cruft or are slow. Slidev is modern but only works with Vue instead of React. I wanted to build a fast MDX-based slide deck tool on top of Vite that uses React and only supports a minimal set of features.

### ReMDX does not have feature XYZ

Fork it, build it, and submit a PR.

### Opinions

- **Basics:** React + Markdown together is a great way to make technical JavaScript presentations.
- **Minimal:** ReMDX has few features. If you'd like to add new features, please fork it and consider sending a Pull Request.
- **Composable:** ReMDX doesn't box you in. Bring your design system or use Tailwind to lay out your slides.
