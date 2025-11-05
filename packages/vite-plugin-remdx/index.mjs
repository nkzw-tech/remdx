import { basename } from "node:path";
import { compile, nodeTypes } from "@mdx-js/mdx";
import matter from "gray-matter";
import normalizeNewline from "normalize-newline";
import rehypeRaw from "rehype-raw";
import shikiTwoslash, { setupForFile } from "remark-shiki-twoslash";

//#region lib/ColorReplacements.tsx
var ColorReplacements_default = {
	"#fffefc": "var(--sc-editor-background)",
	"#FFE792": "var(--sc-editor-findmatchbackground)",
	"#FFE79250": "var(--sc-editor-findmatchhighlightbackground)",
	"#111111": "var(--sc-editor-foreground)",
	"#C2E8FF30": "var(--sc-editor-inactiveselectionbackground)",
	"#A5A5A520": "var(--sc-editor-linehighlightbackground)",
	"#C2E8FF": "var(--sc-editor-selectionbackground)",
	"#C2E8FF50": "var(--sc-editor-selectionhighlightbackground)",
	"#284181": "var(--sc-editorbrackethighlight-foreground2)",
	"#626FC9": "var(--sc-editorbrackethighlight-foreground3)",
	"#352DE3": "var(--sc-editorbrackethighlight-foreground4)",
	"#BB28C7": "var(--sc-editorbrackethighlight-foreground5)",
	"#CD3131": "var(--sc-editorbrackethighlight-unexpectedbracket-foreground)",
	"#3B68FC": "var(--sc-editorcursor-foreground)",
	"#ADADAD": "var(--sc-editorlinenumber-foreground)",
	"#E0E0E0": "var(--sc-editorwhitespace-foreground)",
	"#3D87F5": "var(--sc-focusborder)",
	"#0066BF": "var(--sc-list-focushighlightforeground)",
	"#919191": "var(--sc-comments-fg)",
	"#BC670F": "var(--sc-comments-documentation-fg)",
	"#FFFDF7": "var(--sc-comments-documentation-bg)",
	"#FFFFFF": "var(--sc-invalid-deprecated-fg)",
	"#990000": "var(--sc-invalid-deprecated-bg)",
	"#C56E0E": "var(--sc-types-fg)",
	"#F93232": "var(--sc-exceptions-fg)",
	"#DD3C2F": "var(--sc-numbers-fg)",
	"#00A33F": "var(--sc-strings-fg)",
	"#FBE9AD44": "var(--sc-strings-escape-sequences-bg)",
	"#699D36": "var(--sc-strings-regular-expressions-fg)",
	"#E8FFD5": "var(--sc-strings-symbols-bg)",
	"#444444": "var(--sc-object-keys-fg)",
	"#434343": "var(--sc-embedded-source-fg)",
	"#7F7F7F": "var(--sc-html-doctype-declaration-fg)",
	"#0072C8": "var(--sc-html-tags-fg)",
	"#4F9FCF": "var(--sc-html-tag-punctuation-fg)",
	"#3A77BF": "var(--sc-css-selectors-fg)",
	"#43A202": "var(--sc-css-property-values-fg)",
	"#FFFFDD": "var(--sc-markup-changed-bg)",
	"#FFDDDD": "var(--sc-markup-deletion-bg)",
	"#DDFFDD": "var(--sc-markup-insertion-bg)",
	"#555555": "var(--sc-markup-prompt-fg)"
};

//#endregion
//#region index.ts
const EXPORT_DEFAULT_REGEXP = /export\sdefault\s/g;
const MODULE_REGEXP = /\\`|`(?:\\`|[^`])*`|(^(?:import|export)[^;]+;)/gm;
const compileMDX = async (content, options, development = true) => String((await compile(content, {
	...options,
	development,
	providerImportSource: "@mdx-js/react"
})).value);
const parseSlide = (text) => {
	text = text.trim();
	if (text.match(/^--$/gm)?.length === 1) text = `---\n${text}`;
	const { content, data } = matter(text.replaceAll(/^--$/gm, "---"));
	return [content, data];
};
function remdx() {
	let initialized = false;
	const isProduction = process.env.NODE_ENV === "production";
	const wrapComponent = (content, data) => `(() => {
    function MDXContentWrapper(props) {
      ${content.replaceAll(EXPORT_DEFAULT_REGEXP, "").replaceAll(MODULE_REGEXP, (value, group1) => group1 ? "" : value).trim()}
      return ${isProduction ? "_jsx" : "_jsxDEV"}(MDXContent, props);
    };
    MDXContentWrapper.isMDXComponent = true;
    return {Component: MDXContentWrapper, data: ${JSON.stringify(data)}};
    })()`;
	const transform = async (source, options = {}) => {
		let inlineModules = [];
		const slides = [];
		let start = 0;
		const compileSlides = async (content) => (await Promise.all(content.map(([content$1, data]) => compileMDX(`${inlineModules.join("\n")}\n\n${content$1}`, options, !isProduction).then((content$2) => [content$2, data])))).map(([content$1, data]) => wrapComponent(content$1, data));
		const slice = (end) => {
			if (start !== end) {
				const line = lines.slice(start, end).join("\n");
				slides.push(parseSlide(line));
				start = end + 1;
			}
		};
		const lines = normalizeNewline(source).replaceAll(MODULE_REGEXP, (value, group1) => {
			if (!group1) return value;
			inlineModules.push(value);
			return "";
		}).split(/\n/g);
		inlineModules = Array.from(new Set(inlineModules));
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trimEnd();
			if (line.match(/^---$/)) {
				slice(i);
				const next = lines[i + 1];
				if (line.match(/^---$/) && !next?.match(/^\s*$/)) {
					start = i;
					for (i += 1; i < lines.length; i++) if (lines[i].trimEnd().match(/^---$/)) break;
				}
			} else if (line.startsWith("```")) {
				for (i += 1; i < lines.length; i++) if (lines[i].startsWith("```")) break;
			}
		}
		if (start <= lines.length - 1) slice(lines.length);
		return `
      import React from 'react';
      ${isProduction ? `import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';` : `import { Fragment as _Fragment, jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime';`}
      import { useMDXComponents as _provideComponents } from "@nkzw/remdx";
      ${inlineModules.join("\n")}\n
      export default [${(await compileSlides(slides)).join(",\n")}];
    `;
	};
	const root = process.cwd();
	const shikiOptions = {
		addTryButton: false,
		paths: { themes: root },
		themes: [`${basename(root) === "remdx" ? `/packages/vite-plugin-remdx/` : `/node_modules/@nkzw/vite-plugin-remdx/`}lib/licht`],
		vfsRoot: root
	};
	const shikiTwoslashFn = shikiTwoslash.default || shikiTwoslash;
	return {
		enforce: "pre",
		name: "mdx-transform",
		async transform(code, id) {
			if (id.endsWith(".re.mdx")) {
				if (!initialized) {
					const { highlighters: [highlighter] } = await setupForFile(shikiOptions);
					highlighter?.setColorReplacements?.(ColorReplacements_default);
					initialized = true;
				}
				return await transform(code, {
					rehypePlugins: [[rehypeRaw, { passThrough: nodeTypes }]],
					remarkPlugins: [[shikiTwoslashFn, shikiOptions]]
				});
			}
		}
	};
}

//#endregion
export { remdx as default };