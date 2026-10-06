# ReMDX

Create beautiful minimalist presentations with React & MDX.

## Example Presentations

- [Building Scalable Applications](https://scalable-apps.nakazawa.dev): [source code](https://github.com/nkzw-tech/building-scalable-applications-talk)
- [Dev Velocity Presentation](https://dev-velocity.nakazawa.dev/): [source code](https://github.com/nkzw-tech/dev-velocity-talk)
- [Turn Based AI Presentation](https://turn-based-ai.nakazawa.dev/): [source code](https://github.com/nkzw-tech/turn-based-ai-talk)

## Setup

```bash
npm init remdx
curl -fsSL https://vite.plus | bash
vp install
vp dev
```

### Custom Setup

See the [Example Deck](examples/tokyo) to get started with adding ReMDX to your project:

```bash
vp add @nkzw/remdx @nkzw/vite-plugin-remdx
vp add -D @vitejs/plugin-react oxc-transform-react
```

`vite.config.ts`:

```js
import { defineConfig } from 'vite-plus';
import remdx from '@nkzw/vite-plugin-remdx';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [remdx(), react({ compiler: true })],
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

Then create your `slides.re.mdx` and start the dev server via `vp dev`.

## Usage

- Individual slides are separated by three dashes: `---`.
- Front matter blocks can be inserted at the top of a slide and separated from the slide content by two dashes: `--`. The theme can be set via `theme: <name>`, and background images can be set via `image: <url>`, referring to images in the `public/` folder.
- You can export a set of HTML and custom components using `export { Components } from './Components'`. The `Components.tsx` file should export an object with component names mapping to their implementation as default export.
- ReMDX provides a default theme, but you can leave it out and bring your own or customize styles via
- Code blocks are styled via [`shiki`](https://shiki.style/) and support syntax highlighting via [CSS variables](https://github.com/nkzw-tech/remdx/blob/main/packages/remdx/style.css).
- The inbuilt image component used for inline images via Markdown syntax (for example: `![Tokyo in the Dark](dark.jpg?height=60vh&borderRadius=20px)`) can be styled by passing CSS properties to the query string.
- If you are using ReMDX for presentations and you like it, please add a slide or note at the end saying "Made with [ReMDX](https://github.com/nkzw-tech/remdx)". If you can, share the source of your slide deck with the community.

### Slide URLs

Slides use paths such as `/slide-1` and `/slide-8`; slide numbers start at one. ReMDX keeps these paths in sync with navigation and browser back/forward. Opening the deck root selects the first slide; links beyond the deck's length select the last slide.

Old query and step links such as `?slideIndex=7&stepIndex=2` and `/slide-8/step-final` still open and are replaced with `/slide-8` without adding a history entry. Slides currently have no built-in reveal steps, so unsupported step positions normalize to zero before navigation. Decks hosted in a subdirectory keep their prefix, for example `/talk/slide-8`. Configure your host to serve the deck's `index.html` for slide paths so direct links and reloads work; Vite's SPA dev server handles this automatically.

### Presentation controls

Use Right, PageDown, or Space to advance; Left, PageUp, or Shift+Space to go back; Home and End to jump to the first and last slides. Presentation keys prevent page scrolling and leave inputs, editable content, buttons, links, and other interactive controls alone. Modified shortcuts and keys already handled by your components also keep their normal behavior.

Call `useDeck()` anywhere inside a `<Deck>`, including slide content and custom containers, to build your own navigation:

```tsx
import { useDeck } from '@nkzw/remdx';

function Navigation() {
  const { slideIndex, slideCount, previousSlide, nextSlide, goToSlide } = useDeck();
  return (
    <nav>
      <button disabled={slideIndex === 0} onClick={previousSlide}>
        Back
      </button>
      <button disabled={slideIndex === slideCount - 1} onClick={nextSlide}>
        Next
      </button>
      <button onClick={() => goToSlide(0)}>First slide</button>
    </nav>
  );
}
```

The hook also exposes navigation `direction` (`1`, `-1`, or `0`). `goToSlide()` takes a **zero-based index**, clamps indices to the deck bounds, and rejects values that are not safe integers. Custom navigation uses the same transitions and browser history as the keyboard controls.

### Slide lifecycle

Call `useSlide()` inside a slide or its custom container to control animations, media, and other work:

```tsx
import { useSlide } from '@nkzw/remdx';

function Demo() {
  const { isActive } = useSlide();
  return <Terminal running={isActive} />;
}
```

The hook returns the slide's zero-based `slideIndex`, `isActive`, `isEntering`, `isExiting`, and navigation `direction` (`1` forward, `-1` back, `0` on initial load). `isActive` becomes true as soon as the slide is selected, including during entry. The transition flags remain true only while their respective animations play; immediate switches and reduced motion leave both false. To keep a demo running through its departure, use `isActive || isExiting`.

Slides stay mounted when hidden, so pause timers, media, and rendering when inactive. Calling the hook outside a `<Slide>` throws an explanatory error.

### Directional slide animations

All transitions use the Web Animations API. Each phase has `keyframes` and optional timing `options`; keyframes can be shared or differ for forward and back navigation:

```tsx
import type { SlideTransition } from '@nkzw/remdx';

export const Transitions = {
  reveal: {
    enter: {
      keyframes: {
        forward: [
          { opacity: 0, transform: 'translateX(32px)' },
          { opacity: 1, transform: 'none' },
        ],
        back: [
          { opacity: 0, transform: 'translateX(-32px)' },
          { opacity: 1, transform: 'none' },
        ],
      },
      options: { duration: 500, easing: 'cubic-bezier(0.18, 0.8, 0.18, 1)' },
    },
    leave: {
      keyframes: [
        { opacity: 1, filter: 'blur(0)' },
        { opacity: 0, filter: 'blur(8px)' },
      ],
      options: { duration: 360, easing: 'cubic-bezier(0.4, 0, 0.7, 1)' },
    },
  },
} satisfies Record<string, SlideTransition>;
```

Export this object from your deck and select `transition: reveal` in a slide's front matter, or pass a transition directly to `<Deck>` or `<Slide>`. A slide transition replaces the deck transition completely. Use `{}` or `Transitions.none` for an immediate switch; omit a phase to skip that animation. The default timing is 500 ms with `cubic-bezier(0.18, 0.8, 0.18, 1)`. Playback uses `fill: both` and releases animated styles on completion, so keyframes should end at the slide's normal appearance.

The outgoing slide stays visible until its animation finishes. Incoming slides with an entrance animation appear above it; without an entrance animation, they appear beneath it so `leaveOnly` can reveal them. Inactive slides are hidden from assistive technology and cannot receive interaction. Navigation cancels interrupted animation; initial loading and reduced motion switch immediately, including when reduced motion is enabled during playback. Within-slide steps and transition object changes do not interrupt playback. Browser history determines direction from the destination. The built-in `default`, `transformRight`, `leaveOnly`, `opacity`, and `none` presets use this same engine.

This replaces the React Spring transition API. Move the old `from` and `enter` styles into `enter.keyframes`, and the departure styles into `leave.keyframes`. Directional keyframes belong under `keyframes.forward` and `keyframes.back`; timing belongs under each phase's `options`. The earlier nested `animation` wrapper is no longer used.

## Releasing

After updating the package versions and committing your changes on `main`, run:

```bash
vp run ship
```

This builds the three packages, runs formatting, lint, type checks, and tests, then publishes the public workspace packages to npm. The private root and example packages are skipped. Any build or check failure stops the release before publishing.

## Context & Decisions

### Prior Art

ReMDX was inspired by:

- [mdx-deck](https://github.com/jxnblk/mdx-deck)
- [Spectacle](https://github.com/FormidableLabs/spectacle)
- [Slidev](https://github.com/slidevjs/slidev/)

The core of ReMDX is a lean fork of Spectacle. `create-remdx` is based on Slidev. I'd like to thank the authors of the above tools for their awesome work.

### Why ReMDX?

All three of the above solutions fall short in some way. Some are a bit outdated, and some have too much cruft or are slow. Slidev is modern but only works with Vue instead of React. I wanted to build a fast MDX-based slide deck tool on top of Vite+ that uses React and only supports a minimal set of features.

### ReMDX does not have feature XYZ!

That's not a question. Fork it, build it, and submit a PR.

### Opinions

- **Basics:** React + Markdown together is a great way to make technical JavaScript presentations.
- **Minimal:** ReMDX has few features. If you'd like to add new features, please fork it and consider sending a Pull Request.
- **Composable:** ReMDX doesn't box you in. Bring your design system or use Tailwind to lay out your slides.
