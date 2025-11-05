#!/usr/bin/env node
import { createRequire } from "node:module";
import fs, { appendFileSync, createReadStream, createWriteStream, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ChildProcess, execFile, spawn, spawnSync } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { aborted, callbackify, debuglog, inspect, promisify, stripVTControlCharacters } from "node:util";
import process$1, { execArgv, execPath, hrtime, platform } from "node:process";
import tty from "node:tty";
import { scheduler, setImmediate, setTimeout } from "node:timers/promises";
import { constants } from "node:os";
import { EventEmitter, addAbortListener, on, once, setMaxListeners } from "node:events";
import { serialize } from "node:v8";
import { finished } from "node:stream/promises";
import { Duplex, PassThrough, Readable, Transform, Writable, getDefaultHighWaterMark } from "node:stream";
import { Buffer as Buffer$1 } from "node:buffer";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i$1 = 0, n$1 = keys.length, key; i$1 < n$1; i$1++) {
		key = keys[i$1];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ createRequire(import.meta.url);

//#endregion
//#region ../../node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/file-url.js
const safeNormalizeFileUrl = (file, name) => {
	const fileString = normalizeFileUrl(normalizeDenoExecPath(file));
	if (typeof fileString !== "string") throw new TypeError(`${name} must be a string or a file URL: ${fileString}.`);
	return fileString;
};
const normalizeDenoExecPath = (file) => isDenoExecPath(file) ? file.toString() : file;
const isDenoExecPath = (file) => typeof file !== "string" && file && Object.getPrototypeOf(file) === String.prototype;
const normalizeFileUrl = (file) => file instanceof URL ? fileURLToPath(file) : file;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/parameters.js
const normalizeParameters = (rawFile, rawArguments = [], rawOptions = {}) => {
	const filePath = safeNormalizeFileUrl(rawFile, "First argument");
	const [commandArguments, options$1] = isPlainObject(rawArguments) ? [[], rawArguments] : [rawArguments, rawOptions];
	if (!Array.isArray(commandArguments)) throw new TypeError(`Second argument must be either an array of arguments or an options object: ${commandArguments}`);
	if (commandArguments.some((commandArgument) => typeof commandArgument === "object" && commandArgument !== null)) throw new TypeError(`Second argument must be an array of strings: ${commandArguments}`);
	const normalizedArguments = commandArguments.map(String);
	const nullByteArgument = normalizedArguments.find((normalizedArgument) => normalizedArgument.includes("\0"));
	if (nullByteArgument !== void 0) throw new TypeError(`Arguments cannot contain null bytes ("\\0"): ${nullByteArgument}`);
	if (!isPlainObject(options$1)) throw new TypeError(`Last argument must be an options object: ${options$1}`);
	return [
		filePath,
		normalizedArguments,
		options$1
	];
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/utils/uint-array.js
const { toString: objectToString$1 } = Object.prototype;
const isArrayBuffer = (value) => objectToString$1.call(value) === "[object ArrayBuffer]";
const isUint8Array = (value) => objectToString$1.call(value) === "[object Uint8Array]";
const bufferToUint8Array = (buffer) => new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
const textEncoder$1 = new TextEncoder();
const stringToUint8Array = (string) => textEncoder$1.encode(string);
const textDecoder = new TextDecoder();
const uint8ArrayToString = (uint8Array) => textDecoder.decode(uint8Array);
const joinToString = (uint8ArraysOrStrings, encoding) => {
	return uint8ArraysToStrings(uint8ArraysOrStrings, encoding).join("");
};
const uint8ArraysToStrings = (uint8ArraysOrStrings, encoding) => {
	if (encoding === "utf8" && uint8ArraysOrStrings.every((uint8ArrayOrString) => typeof uint8ArrayOrString === "string")) return uint8ArraysOrStrings;
	const decoder = new StringDecoder(encoding);
	const strings = uint8ArraysOrStrings.map((uint8ArrayOrString) => typeof uint8ArrayOrString === "string" ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString).map((uint8Array) => decoder.write(uint8Array));
	const finalString = decoder.end();
	return finalString === "" ? strings : [...strings, finalString];
};
const joinToUint8Array = (uint8ArraysOrStrings) => {
	if (uint8ArraysOrStrings.length === 1 && isUint8Array(uint8ArraysOrStrings[0])) return uint8ArraysOrStrings[0];
	return concatUint8Arrays(stringsToUint8Arrays(uint8ArraysOrStrings));
};
const stringsToUint8Arrays = (uint8ArraysOrStrings) => uint8ArraysOrStrings.map((uint8ArrayOrString) => typeof uint8ArrayOrString === "string" ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString);
const concatUint8Arrays = (uint8Arrays) => {
	const result = new Uint8Array(getJoinLength(uint8Arrays));
	let index = 0;
	for (const uint8Array of uint8Arrays) {
		result.set(uint8Array, index);
		index += uint8Array.length;
	}
	return result;
};
const getJoinLength = (uint8Arrays) => {
	let joinLength = 0;
	for (const uint8Array of uint8Arrays) joinLength += uint8Array.length;
	return joinLength;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/template.js
const isTemplateString = (templates) => Array.isArray(templates) && Array.isArray(templates.raw);
const parseTemplates = (templates, expressions) => {
	let tokens = [];
	for (const [index, template] of templates.entries()) tokens = parseTemplate({
		templates,
		expressions,
		tokens,
		index,
		template
	});
	if (tokens.length === 0) throw new TypeError("Template script must not be empty");
	const [file, ...commandArguments] = tokens;
	return [
		file,
		commandArguments,
		{}
	];
};
const parseTemplate = ({ templates, expressions, tokens, index, template }) => {
	if (template === void 0) throw new TypeError(`Invalid backslash sequence: ${templates.raw[index]}`);
	const { nextTokens, leadingWhitespaces, trailingWhitespaces } = splitByWhitespaces(template, templates.raw[index]);
	const newTokens = concatTokens(tokens, nextTokens, leadingWhitespaces);
	if (index === expressions.length) return newTokens;
	const expression = expressions[index];
	return concatTokens(newTokens, Array.isArray(expression) ? expression.map((expression$1) => parseExpression(expression$1)) : [parseExpression(expression)], trailingWhitespaces);
};
const splitByWhitespaces = (template, rawTemplate) => {
	if (rawTemplate.length === 0) return {
		nextTokens: [],
		leadingWhitespaces: false,
		trailingWhitespaces: false
	};
	const nextTokens = [];
	let templateStart = 0;
	const leadingWhitespaces = DELIMITERS.has(rawTemplate[0]);
	for (let templateIndex = 0, rawIndex = 0; templateIndex < template.length; templateIndex += 1, rawIndex += 1) {
		const rawCharacter = rawTemplate[rawIndex];
		if (DELIMITERS.has(rawCharacter)) {
			if (templateStart !== templateIndex) nextTokens.push(template.slice(templateStart, templateIndex));
			templateStart = templateIndex + 1;
		} else if (rawCharacter === "\\") {
			const nextRawCharacter = rawTemplate[rawIndex + 1];
			if (nextRawCharacter === "\n") {
				templateIndex -= 1;
				rawIndex += 1;
			} else if (nextRawCharacter === "u" && rawTemplate[rawIndex + 2] === "{") rawIndex = rawTemplate.indexOf("}", rawIndex + 3);
			else rawIndex += ESCAPE_LENGTH[nextRawCharacter] ?? 1;
		}
	}
	const trailingWhitespaces = templateStart === template.length;
	if (!trailingWhitespaces) nextTokens.push(template.slice(templateStart));
	return {
		nextTokens,
		leadingWhitespaces,
		trailingWhitespaces
	};
};
const DELIMITERS = new Set([
	" ",
	"	",
	"\r",
	"\n"
]);
const ESCAPE_LENGTH = {
	x: 3,
	u: 5
};
const concatTokens = (tokens, nextTokens, isSeparated) => isSeparated || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
	...tokens.slice(0, -1),
	`${tokens.at(-1)}${nextTokens[0]}`,
	...nextTokens.slice(1)
];
const parseExpression = (expression) => {
	const typeOfExpression = typeof expression;
	if (typeOfExpression === "string") return expression;
	if (typeOfExpression === "number") return String(expression);
	if (isPlainObject(expression) && ("stdout" in expression || "isMaxBuffer" in expression)) return getSubprocessResult(expression);
	if (expression instanceof ChildProcess || Object.prototype.toString.call(expression) === "[object Promise]") throw new TypeError("Unexpected subprocess in template expression. Please use ${await subprocess} instead of ${subprocess}.");
	throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};
const getSubprocessResult = ({ stdout }) => {
	if (typeof stdout === "string") return stdout;
	if (isUint8Array(stdout)) return uint8ArrayToString(stdout);
	if (stdout === void 0) throw new TypeError("Missing result.stdout in template expression. This is probably due to the previous subprocess' \"stdout\" option.");
	throw new TypeError(`Unexpected "${typeof stdout}" stdout in template expression`);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/utils/standard-stream.js
const isStandardStream = (stream) => STANDARD_STREAMS.includes(stream);
const STANDARD_STREAMS = [
	process$1.stdin,
	process$1.stdout,
	process$1.stderr
];
const STANDARD_STREAMS_ALIASES = [
	"stdin",
	"stdout",
	"stderr"
];
const getStreamName = (fdNumber) => STANDARD_STREAMS_ALIASES[fdNumber] ?? `stdio[${fdNumber}]`;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/specific.js
const normalizeFdSpecificOptions = (options$1) => {
	const optionsCopy = { ...options$1 };
	for (const optionName of FD_SPECIFIC_OPTIONS) optionsCopy[optionName] = normalizeFdSpecificOption(options$1, optionName);
	return optionsCopy;
};
const normalizeFdSpecificOption = (options$1, optionName) => {
	const optionBaseArray = Array.from({ length: getStdioLength(options$1) + 1 });
	return addDefaultValue$1(normalizeFdSpecificValue(options$1[optionName], optionBaseArray, optionName), optionName);
};
const getStdioLength = ({ stdio }) => Array.isArray(stdio) ? Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length) : STANDARD_STREAMS_ALIASES.length;
const normalizeFdSpecificValue = (optionValue, optionArray, optionName) => isPlainObject(optionValue) ? normalizeOptionObject(optionValue, optionArray, optionName) : optionArray.fill(optionValue);
const normalizeOptionObject = (optionValue, optionArray, optionName) => {
	for (const fdName of Object.keys(optionValue).sort(compareFdName)) for (const fdNumber of parseFdName(fdName, optionName, optionArray)) optionArray[fdNumber] = optionValue[fdName];
	return optionArray;
};
const compareFdName = (fdNameA, fdNameB) => getFdNameOrder(fdNameA) < getFdNameOrder(fdNameB) ? 1 : -1;
const getFdNameOrder = (fdName) => {
	if (fdName === "stdout" || fdName === "stderr") return 0;
	return fdName === "all" ? 2 : 1;
};
const parseFdName = (fdName, optionName, optionArray) => {
	if (fdName === "ipc") return [optionArray.length - 1];
	const fdNumber = parseFd(fdName);
	if (fdNumber === void 0 || fdNumber === 0) throw new TypeError(`"${optionName}.${fdName}" is invalid.
It must be "${optionName}.stdout", "${optionName}.stderr", "${optionName}.all", "${optionName}.ipc", or "${optionName}.fd3", "${optionName}.fd4" (and so on).`);
	if (fdNumber >= optionArray.length) throw new TypeError(`"${optionName}.${fdName}" is invalid: that file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
	return fdNumber === "all" ? [1, 2] : [fdNumber];
};
const parseFd = (fdName) => {
	if (fdName === "all") return fdName;
	if (STANDARD_STREAMS_ALIASES.includes(fdName)) return STANDARD_STREAMS_ALIASES.indexOf(fdName);
	const regexpResult = FD_REGEXP.exec(fdName);
	if (regexpResult !== null) return Number(regexpResult[1]);
};
const FD_REGEXP = /^fd(\d+)$/;
const addDefaultValue$1 = (optionArray, optionName) => optionArray.map((optionValue) => optionValue === void 0 ? DEFAULT_OPTIONS[optionName] : optionValue);
const DEFAULT_OPTIONS = {
	lines: false,
	buffer: true,
	maxBuffer: 1e3 * 1e3 * 100,
	verbose: debuglog("execa").enabled ? "full" : "none",
	stripFinalNewline: true
};
const FD_SPECIFIC_OPTIONS = [
	"lines",
	"buffer",
	"maxBuffer",
	"verbose",
	"stripFinalNewline"
];
const getFdSpecificValue = (optionArray, fdNumber) => fdNumber === "ipc" ? optionArray.at(-1) : optionArray[fdNumber];

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/values.js
const isVerbose = ({ verbose }, fdNumber) => getFdVerbose(verbose, fdNumber) !== "none";
const isFullVerbose = ({ verbose }, fdNumber) => !["none", "short"].includes(getFdVerbose(verbose, fdNumber));
const getVerboseFunction = ({ verbose }, fdNumber) => {
	const fdVerbose = getFdVerbose(verbose, fdNumber);
	return isVerboseFunction(fdVerbose) ? fdVerbose : void 0;
};
const getFdVerbose = (verbose, fdNumber) => fdNumber === void 0 ? getFdGenericVerbose(verbose) : getFdSpecificValue(verbose, fdNumber);
const getFdGenericVerbose = (verbose) => verbose.find((fdVerbose) => isVerboseFunction(fdVerbose)) ?? VERBOSE_VALUES.findLast((fdVerbose) => verbose.includes(fdVerbose));
const isVerboseFunction = (fdVerbose) => typeof fdVerbose === "function";
const VERBOSE_VALUES = [
	"none",
	"short",
	"full"
];

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/escape.js
const joinCommand = (filePath, rawArguments) => {
	const fileAndArguments = [filePath, ...rawArguments];
	return {
		command: fileAndArguments.join(" "),
		escapedCommand: fileAndArguments.map((fileAndArgument) => quoteString(escapeControlCharacters(fileAndArgument))).join(" ")
	};
};
const escapeLines = (lines$4) => stripVTControlCharacters(lines$4).split("\n").map((line) => escapeControlCharacters(line)).join("\n");
const escapeControlCharacters = (line) => line.replaceAll(SPECIAL_CHAR_REGEXP, (character) => escapeControlCharacter(character));
const escapeControlCharacter = (character) => {
	const commonEscape = COMMON_ESCAPES[character];
	if (commonEscape !== void 0) return commonEscape;
	const codepoint = character.codePointAt(0);
	const codepointHex = codepoint.toString(16);
	return codepoint <= ASTRAL_START ? `\\u${codepointHex.padStart(4, "0")}` : `\\U${codepointHex}`;
};
const getSpecialCharRegExp = () => {
	try {
		return new RegExp("\\p{Separator}|\\p{Other}", "gu");
	} catch {
		return /[\s\u0000-\u001F\u007F-\u009F\u00AD]/g;
	}
};
const SPECIAL_CHAR_REGEXP = getSpecialCharRegExp();
const COMMON_ESCAPES = {
	" ": " ",
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
};
const ASTRAL_START = 65535;
const quoteString = (escapedArgument) => {
	if (NO_ESCAPE_REGEXP.test(escapedArgument)) return escapedArgument;
	return platform === "win32" ? `"${escapedArgument.replaceAll("\"", "\"\"")}"` : `'${escapedArgument.replaceAll("'", "'\\''")}'`;
};
const NO_ESCAPE_REGEXP = /^[\w./-]+$/;

//#endregion
//#region ../../node_modules/.pnpm/is-unicode-supported@2.1.0/node_modules/is-unicode-supported/index.js
function isUnicodeSupported() {
	const { env } = process$1;
	const { TERM: TERM$1, TERM_PROGRAM } = env;
	if (process$1.platform !== "win32") return TERM$1 !== "linux";
	return Boolean(env.WT_SESSION) || Boolean(env.TERMINUS_SUBLIME) || env.ConEmuTask === "{cmd::Cmder}" || TERM_PROGRAM === "Terminus-Sublime" || TERM_PROGRAM === "vscode" || TERM$1 === "xterm-256color" || TERM$1 === "alacritty" || TERM$1 === "rxvt-unicode" || TERM$1 === "rxvt-unicode-256color" || env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}

//#endregion
//#region ../../node_modules/.pnpm/figures@6.1.0/node_modules/figures/index.js
const common = {
	circleQuestionMark: "(?)",
	questionMarkPrefix: "(?)",
	square: "█",
	squareDarkShade: "▓",
	squareMediumShade: "▒",
	squareLightShade: "░",
	squareTop: "▀",
	squareBottom: "▄",
	squareLeft: "▌",
	squareRight: "▐",
	squareCenter: "■",
	bullet: "●",
	dot: "․",
	ellipsis: "…",
	pointerSmall: "›",
	triangleUp: "▲",
	triangleUpSmall: "▴",
	triangleDown: "▼",
	triangleDownSmall: "▾",
	triangleLeftSmall: "◂",
	triangleRightSmall: "▸",
	home: "⌂",
	heart: "♥",
	musicNote: "♪",
	musicNoteBeamed: "♫",
	arrowUp: "↑",
	arrowDown: "↓",
	arrowLeft: "←",
	arrowRight: "→",
	arrowLeftRight: "↔",
	arrowUpDown: "↕",
	almostEqual: "≈",
	notEqual: "≠",
	lessOrEqual: "≤",
	greaterOrEqual: "≥",
	identical: "≡",
	infinity: "∞",
	subscriptZero: "₀",
	subscriptOne: "₁",
	subscriptTwo: "₂",
	subscriptThree: "₃",
	subscriptFour: "₄",
	subscriptFive: "₅",
	subscriptSix: "₆",
	subscriptSeven: "₇",
	subscriptEight: "₈",
	subscriptNine: "₉",
	oneHalf: "½",
	oneThird: "⅓",
	oneQuarter: "¼",
	oneFifth: "⅕",
	oneSixth: "⅙",
	oneEighth: "⅛",
	twoThirds: "⅔",
	twoFifths: "⅖",
	threeQuarters: "¾",
	threeFifths: "⅗",
	threeEighths: "⅜",
	fourFifths: "⅘",
	fiveSixths: "⅚",
	fiveEighths: "⅝",
	sevenEighths: "⅞",
	line: "─",
	lineBold: "━",
	lineDouble: "═",
	lineDashed0: "┄",
	lineDashed1: "┅",
	lineDashed2: "┈",
	lineDashed3: "┉",
	lineDashed4: "╌",
	lineDashed5: "╍",
	lineDashed6: "╴",
	lineDashed7: "╶",
	lineDashed8: "╸",
	lineDashed9: "╺",
	lineDashed10: "╼",
	lineDashed11: "╾",
	lineDashed12: "−",
	lineDashed13: "–",
	lineDashed14: "‐",
	lineDashed15: "⁃",
	lineVertical: "│",
	lineVerticalBold: "┃",
	lineVerticalDouble: "║",
	lineVerticalDashed0: "┆",
	lineVerticalDashed1: "┇",
	lineVerticalDashed2: "┊",
	lineVerticalDashed3: "┋",
	lineVerticalDashed4: "╎",
	lineVerticalDashed5: "╏",
	lineVerticalDashed6: "╵",
	lineVerticalDashed7: "╷",
	lineVerticalDashed8: "╹",
	lineVerticalDashed9: "╻",
	lineVerticalDashed10: "╽",
	lineVerticalDashed11: "╿",
	lineDownLeft: "┐",
	lineDownLeftArc: "╮",
	lineDownBoldLeftBold: "┓",
	lineDownBoldLeft: "┒",
	lineDownLeftBold: "┑",
	lineDownDoubleLeftDouble: "╗",
	lineDownDoubleLeft: "╖",
	lineDownLeftDouble: "╕",
	lineDownRight: "┌",
	lineDownRightArc: "╭",
	lineDownBoldRightBold: "┏",
	lineDownBoldRight: "┎",
	lineDownRightBold: "┍",
	lineDownDoubleRightDouble: "╔",
	lineDownDoubleRight: "╓",
	lineDownRightDouble: "╒",
	lineUpLeft: "┘",
	lineUpLeftArc: "╯",
	lineUpBoldLeftBold: "┛",
	lineUpBoldLeft: "┚",
	lineUpLeftBold: "┙",
	lineUpDoubleLeftDouble: "╝",
	lineUpDoubleLeft: "╜",
	lineUpLeftDouble: "╛",
	lineUpRight: "└",
	lineUpRightArc: "╰",
	lineUpBoldRightBold: "┗",
	lineUpBoldRight: "┖",
	lineUpRightBold: "┕",
	lineUpDoubleRightDouble: "╚",
	lineUpDoubleRight: "╙",
	lineUpRightDouble: "╘",
	lineUpDownLeft: "┤",
	lineUpBoldDownBoldLeftBold: "┫",
	lineUpBoldDownBoldLeft: "┨",
	lineUpDownLeftBold: "┥",
	lineUpBoldDownLeftBold: "┩",
	lineUpDownBoldLeftBold: "┪",
	lineUpDownBoldLeft: "┧",
	lineUpBoldDownLeft: "┦",
	lineUpDoubleDownDoubleLeftDouble: "╣",
	lineUpDoubleDownDoubleLeft: "╢",
	lineUpDownLeftDouble: "╡",
	lineUpDownRight: "├",
	lineUpBoldDownBoldRightBold: "┣",
	lineUpBoldDownBoldRight: "┠",
	lineUpDownRightBold: "┝",
	lineUpBoldDownRightBold: "┡",
	lineUpDownBoldRightBold: "┢",
	lineUpDownBoldRight: "┟",
	lineUpBoldDownRight: "┞",
	lineUpDoubleDownDoubleRightDouble: "╠",
	lineUpDoubleDownDoubleRight: "╟",
	lineUpDownRightDouble: "╞",
	lineDownLeftRight: "┬",
	lineDownBoldLeftBoldRightBold: "┳",
	lineDownLeftBoldRightBold: "┯",
	lineDownBoldLeftRight: "┰",
	lineDownBoldLeftBoldRight: "┱",
	lineDownBoldLeftRightBold: "┲",
	lineDownLeftRightBold: "┮",
	lineDownLeftBoldRight: "┭",
	lineDownDoubleLeftDoubleRightDouble: "╦",
	lineDownDoubleLeftRight: "╥",
	lineDownLeftDoubleRightDouble: "╤",
	lineUpLeftRight: "┴",
	lineUpBoldLeftBoldRightBold: "┻",
	lineUpLeftBoldRightBold: "┷",
	lineUpBoldLeftRight: "┸",
	lineUpBoldLeftBoldRight: "┹",
	lineUpBoldLeftRightBold: "┺",
	lineUpLeftRightBold: "┶",
	lineUpLeftBoldRight: "┵",
	lineUpDoubleLeftDoubleRightDouble: "╩",
	lineUpDoubleLeftRight: "╨",
	lineUpLeftDoubleRightDouble: "╧",
	lineUpDownLeftRight: "┼",
	lineUpBoldDownBoldLeftBoldRightBold: "╋",
	lineUpDownBoldLeftBoldRightBold: "╈",
	lineUpBoldDownLeftBoldRightBold: "╇",
	lineUpBoldDownBoldLeftRightBold: "╊",
	lineUpBoldDownBoldLeftBoldRight: "╉",
	lineUpBoldDownLeftRight: "╀",
	lineUpDownBoldLeftRight: "╁",
	lineUpDownLeftBoldRight: "┽",
	lineUpDownLeftRightBold: "┾",
	lineUpBoldDownBoldLeftRight: "╂",
	lineUpDownLeftBoldRightBold: "┿",
	lineUpBoldDownLeftBoldRight: "╃",
	lineUpBoldDownLeftRightBold: "╄",
	lineUpDownBoldLeftBoldRight: "╅",
	lineUpDownBoldLeftRightBold: "╆",
	lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
	lineUpDoubleDownDoubleLeftRight: "╫",
	lineUpDownLeftDoubleRightDouble: "╪",
	lineCross: "╳",
	lineBackslash: "╲",
	lineSlash: "╱"
};
const specialMainSymbols = {
	tick: "✔",
	info: "ℹ",
	warning: "⚠",
	cross: "✘",
	squareSmall: "◻",
	squareSmallFilled: "◼",
	circle: "◯",
	circleFilled: "◉",
	circleDotted: "◌",
	circleDouble: "◎",
	circleCircle: "ⓞ",
	circleCross: "ⓧ",
	circlePipe: "Ⓘ",
	radioOn: "◉",
	radioOff: "◯",
	checkboxOn: "☒",
	checkboxOff: "☐",
	checkboxCircleOn: "ⓧ",
	checkboxCircleOff: "Ⓘ",
	pointer: "❯",
	triangleUpOutline: "△",
	triangleLeft: "◀",
	triangleRight: "▶",
	lozenge: "◆",
	lozengeOutline: "◇",
	hamburger: "☰",
	smiley: "㋡",
	mustache: "෴",
	star: "★",
	play: "▶",
	nodejs: "⬢",
	oneSeventh: "⅐",
	oneNinth: "⅑",
	oneTenth: "⅒"
};
const specialFallbackSymbols = {
	tick: "√",
	info: "i",
	warning: "‼",
	cross: "×",
	squareSmall: "□",
	squareSmallFilled: "■",
	circle: "( )",
	circleFilled: "(*)",
	circleDotted: "( )",
	circleDouble: "( )",
	circleCircle: "(○)",
	circleCross: "(×)",
	circlePipe: "(│)",
	radioOn: "(*)",
	radioOff: "( )",
	checkboxOn: "[×]",
	checkboxOff: "[ ]",
	checkboxCircleOn: "(×)",
	checkboxCircleOff: "( )",
	pointer: ">",
	triangleUpOutline: "∆",
	triangleLeft: "◄",
	triangleRight: "►",
	lozenge: "♦",
	lozengeOutline: "◊",
	hamburger: "≡",
	smiley: "☺",
	mustache: "┌─┐",
	star: "✶",
	play: "►",
	nodejs: "♦",
	oneSeventh: "1/7",
	oneNinth: "1/9",
	oneTenth: "1/10"
};
const mainSymbols = {
	...common,
	...specialMainSymbols
};
const fallbackSymbols = {
	...common,
	...specialFallbackSymbols
};
const shouldUseMain = isUnicodeSupported();
const figures$18 = shouldUseMain ? mainSymbols : fallbackSymbols;
var figures_default = figures$18;
const replacements = Object.entries(specialMainSymbols);

//#endregion
//#region ../../node_modules/.pnpm/yoctocolors@2.1.2/node_modules/yoctocolors/base.js
const hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;
const format = (open, close) => {
	if (!hasColors) return (input) => input;
	const openCode = `\u001B[${open}m`;
	const closeCode = `\u001B[${close}m`;
	return (input) => {
		const string = input + "";
		let index = string.indexOf(closeCode);
		if (index === -1) return openCode + string + closeCode;
		let result = openCode;
		let lastIndex = 0;
		const replaceCode = (close === 22 ? closeCode : "") + openCode;
		while (index !== -1) {
			result += string.slice(lastIndex, index) + replaceCode;
			lastIndex = index + closeCode.length;
			index = string.indexOf(closeCode, lastIndex);
		}
		result += string.slice(lastIndex) + closeCode;
		return result;
	};
};
const reset$1 = format(0, 0);
const bold$1 = format(1, 22);
const dim$1 = format(2, 22);
const italic$1 = format(3, 23);
const underline$1 = format(4, 24);
const overline = format(53, 55);
const inverse$1 = format(7, 27);
const hidden$1 = format(8, 28);
const strikethrough$1 = format(9, 29);
const black$1 = format(30, 39);
const red$1 = format(31, 39);
const green$1 = format(32, 39);
const yellow$1 = format(33, 39);
const blue$1 = format(34, 39);
const magenta$1 = format(35, 39);
const cyan$1 = format(36, 39);
const white$1 = format(37, 39);
const gray$1 = format(90, 39);
const bgBlack$1 = format(40, 49);
const bgRed$1 = format(41, 49);
const bgGreen$1 = format(42, 49);
const bgYellow$1 = format(43, 49);
const bgBlue$1 = format(44, 49);
const bgMagenta$1 = format(45, 49);
const bgCyan$1 = format(46, 49);
const bgWhite$1 = format(47, 49);
const bgGray$1 = format(100, 49);
const redBright = format(91, 39);
const greenBright = format(92, 39);
const yellowBright = format(93, 39);
const blueBright = format(94, 39);
const magentaBright = format(95, 39);
const cyanBright = format(96, 39);
const whiteBright = format(97, 39);
const bgRedBright = format(101, 49);
const bgGreenBright = format(102, 49);
const bgYellowBright = format(103, 49);
const bgBlueBright = format(104, 49);
const bgMagentaBright = format(105, 49);
const bgCyanBright = format(106, 49);
const bgWhiteBright = format(107, 49);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/default.js
const defaultVerboseFunction = ({ type, message, timestamp, piped, commandId, result: { failed = false } = {}, options: { reject = true } }) => {
	const timestampString = serializeTimestamp(timestamp);
	const icon = ICONS[type]({
		failed,
		reject,
		piped
	});
	const color$20 = COLORS[type]({ reject });
	return `${gray$1(`[${timestampString}]`)} ${gray$1(`[${commandId}]`)} ${color$20(icon)} ${color$20(message)}`;
};
const serializeTimestamp = (timestamp) => `${padField(timestamp.getHours(), 2)}:${padField(timestamp.getMinutes(), 2)}:${padField(timestamp.getSeconds(), 2)}.${padField(timestamp.getMilliseconds(), 3)}`;
const padField = (field, padding) => String(field).padStart(padding, "0");
const getFinalIcon = ({ failed, reject }) => {
	if (!failed) return figures_default.tick;
	return reject ? figures_default.cross : figures_default.warning;
};
const ICONS = {
	command: ({ piped }) => piped ? "|" : "$",
	output: () => " ",
	ipc: () => "*",
	error: getFinalIcon,
	duration: getFinalIcon
};
const identity$1 = (string) => string;
const COLORS = {
	command: () => bold$1,
	output: () => identity$1,
	ipc: () => identity$1,
	error: ({ reject }) => reject ? redBright : yellowBright,
	duration: () => gray$1
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/custom.js
const applyVerboseOnLines = (printedLines, verboseInfo, fdNumber) => {
	const verboseFunction = getVerboseFunction(verboseInfo, fdNumber);
	return printedLines.map(({ verboseLine, verboseObject }) => applyVerboseFunction(verboseLine, verboseObject, verboseFunction)).filter((printedLine) => printedLine !== void 0).map((printedLine) => appendNewline(printedLine)).join("");
};
const applyVerboseFunction = (verboseLine, verboseObject, verboseFunction) => {
	if (verboseFunction === void 0) return verboseLine;
	const printedLine = verboseFunction(verboseLine, verboseObject);
	if (typeof printedLine === "string") return printedLine;
};
const appendNewline = (printedLine) => printedLine.endsWith("\n") ? printedLine : `${printedLine}\n`;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/log.js
const verboseLog = ({ type, verboseMessage, fdNumber, verboseInfo, result }) => {
	const finalLines = applyVerboseOnLines(getPrintedLines(verboseMessage, getVerboseObject({
		type,
		result,
		verboseInfo
	})), verboseInfo, fdNumber);
	if (finalLines !== "") console.warn(finalLines.slice(0, -1));
};
const getVerboseObject = ({ type, result, verboseInfo: { escapedCommand, commandId, rawOptions: { piped = false,...options$1 } } }) => ({
	type,
	escapedCommand,
	commandId: `${commandId}`,
	timestamp: /* @__PURE__ */ new Date(),
	piped,
	result,
	options: options$1
});
const getPrintedLines = (verboseMessage, verboseObject) => verboseMessage.split("\n").map((message) => getPrintedLine({
	...verboseObject,
	message
}));
const getPrintedLine = (verboseObject) => {
	return {
		verboseLine: defaultVerboseFunction(verboseObject),
		verboseObject
	};
};
const serializeVerboseMessage = (message) => {
	return escapeLines(typeof message === "string" ? message : inspect(message)).replaceAll("	", " ".repeat(TAB_SIZE));
};
const TAB_SIZE = 2;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/start.js
const logCommand = (escapedCommand, verboseInfo) => {
	if (!isVerbose(verboseInfo)) return;
	verboseLog({
		type: "command",
		verboseMessage: escapedCommand,
		verboseInfo
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/info.js
const getVerboseInfo = (verbose, escapedCommand, rawOptions) => {
	validateVerbose(verbose);
	return {
		verbose,
		escapedCommand,
		commandId: getCommandId(verbose),
		rawOptions
	};
};
const getCommandId = (verbose) => isVerbose({ verbose }) ? COMMAND_ID++ : void 0;
let COMMAND_ID = 0n;
const validateVerbose = (verbose) => {
	for (const fdVerbose of verbose) {
		if (fdVerbose === false) throw new TypeError("The \"verbose: false\" option was renamed to \"verbose: 'none'\".");
		if (fdVerbose === true) throw new TypeError("The \"verbose: true\" option was renamed to \"verbose: 'short'\".");
		if (!VERBOSE_VALUES.includes(fdVerbose) && !isVerboseFunction(fdVerbose)) {
			const allowedValues = VERBOSE_VALUES.map((allowedValue) => `'${allowedValue}'`).join(", ");
			throw new TypeError(`The "verbose" option must not be ${fdVerbose}. Allowed values are: ${allowedValues} or a function.`);
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/duration.js
const getStartTime = () => hrtime.bigint();
const getDurationMs = (startTime) => Number(hrtime.bigint() - startTime) / 1e6;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/command.js
const handleCommand = (filePath, rawArguments, rawOptions) => {
	const startTime = getStartTime();
	const { command, escapedCommand } = joinCommand(filePath, rawArguments);
	const verboseInfo = getVerboseInfo(normalizeFdSpecificOption(rawOptions, "verbose"), escapedCommand, { ...rawOptions });
	logCommand(escapedCommand, verboseInfo);
	return {
		command,
		escapedCommand,
		startTime,
		verboseInfo
	};
};

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js": ((exports, module) => {
	module.exports = isexe$3;
	isexe$3.sync = sync$2;
	var fs$3 = __require("fs");
	function checkPathExt(path$4, options$1) {
		var pathext = options$1.pathExt !== void 0 ? options$1.pathExt : process.env.PATHEXT;
		if (!pathext) return true;
		pathext = pathext.split(";");
		if (pathext.indexOf("") !== -1) return true;
		for (var i$1 = 0; i$1 < pathext.length; i$1++) {
			var p = pathext[i$1].toLowerCase();
			if (p && path$4.substr(-p.length).toLowerCase() === p) return true;
		}
		return false;
	}
	function checkStat$1(stat, path$4, options$1) {
		if (!stat.isSymbolicLink() && !stat.isFile()) return false;
		return checkPathExt(path$4, options$1);
	}
	function isexe$3(path$4, options$1, cb) {
		fs$3.stat(path$4, function(er, stat) {
			cb(er, er ? false : checkStat$1(stat, path$4, options$1));
		});
	}
	function sync$2(path$4, options$1) {
		return checkStat$1(fs$3.statSync(path$4), path$4, options$1);
	}
}) });

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js": ((exports, module) => {
	module.exports = isexe$2;
	isexe$2.sync = sync$1;
	var fs$2 = __require("fs");
	function isexe$2(path$4, options$1, cb) {
		fs$2.stat(path$4, function(er, stat) {
			cb(er, er ? false : checkStat(stat, options$1));
		});
	}
	function sync$1(path$4, options$1) {
		return checkStat(fs$2.statSync(path$4), options$1);
	}
	function checkStat(stat, options$1) {
		return stat.isFile() && checkMode(stat, options$1);
	}
	function checkMode(stat, options$1) {
		var mod = stat.mode;
		var uid = stat.uid;
		var gid = stat.gid;
		var myUid = options$1.uid !== void 0 ? options$1.uid : process.getuid && process.getuid();
		var myGid = options$1.gid !== void 0 ? options$1.gid : process.getgid && process.getgid();
		var u$1 = parseInt("100", 8);
		var g = parseInt("010", 8);
		var o$1 = parseInt("001", 8);
		var ug = u$1 | g;
		return mod & o$1 || mod & g && gid === myGid || mod & u$1 && uid === myUid || mod & ug && myUid === 0;
	}
}) });

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js": ((exports, module) => {
	__require("fs");
	var core;
	if (process.platform === "win32" || global.TESTING_WINDOWS) core = require_windows();
	else core = require_mode();
	module.exports = isexe$1;
	isexe$1.sync = sync;
	function isexe$1(path$4, options$1, cb) {
		if (typeof options$1 === "function") {
			cb = options$1;
			options$1 = {};
		}
		if (!cb) {
			if (typeof Promise !== "function") throw new TypeError("callback not provided");
			return new Promise(function(resolve, reject) {
				isexe$1(path$4, options$1 || {}, function(er, is) {
					if (er) reject(er);
					else resolve(is);
				});
			});
		}
		core(path$4, options$1 || {}, function(er, is) {
			if (er) {
				if (er.code === "EACCES" || options$1 && options$1.ignoreErrors) {
					er = null;
					is = false;
				}
			}
			cb(er, is);
		});
	}
	function sync(path$4, options$1) {
		try {
			return core.sync(path$4, options$1 || {});
		} catch (er) {
			if (options$1 && options$1.ignoreErrors || er.code === "EACCES") return false;
			else throw er;
		}
	}
}) });

//#endregion
//#region ../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js
var require_which = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js": ((exports, module) => {
	const isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
	const path$3 = __require("path");
	const COLON = isWindows ? ";" : ":";
	const isexe = require_isexe();
	const getNotFoundError = (cmd) => Object.assign(/* @__PURE__ */ new Error(`not found: ${cmd}`), { code: "ENOENT" });
	const getPathInfo = (cmd, opt) => {
		const colon = opt.colon || COLON;
		const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [...isWindows ? [process.cwd()] : [], ...(opt.path || process.env.PATH || "").split(colon)];
		const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
		const pathExt = isWindows ? pathExtExe.split(colon) : [""];
		if (isWindows) {
			if (cmd.indexOf(".") !== -1 && pathExt[0] !== "") pathExt.unshift("");
		}
		return {
			pathEnv,
			pathExt,
			pathExtExe
		};
	};
	const which$1 = (cmd, opt, cb) => {
		if (typeof opt === "function") {
			cb = opt;
			opt = {};
		}
		if (!opt) opt = {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		const step = (i$1) => new Promise((resolve, reject) => {
			if (i$1 === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
			const ppRaw = pathEnv[i$1];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$3.join(pathPart, cmd);
			resolve(subStep(!pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd, i$1, 0));
		});
		const subStep = (p, i$1, ii) => new Promise((resolve, reject) => {
			if (ii === pathExt.length) return resolve(step(i$1 + 1));
			const ext = pathExt[ii];
			isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
				if (!er && is) if (opt.all) found.push(p + ext);
				else return resolve(p + ext);
				return resolve(subStep(p, i$1, ii + 1));
			});
		});
		return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
	};
	const whichSync = (cmd, opt) => {
		opt = opt || {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		for (let i$1 = 0; i$1 < pathEnv.length; i$1++) {
			const ppRaw = pathEnv[i$1];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$3.join(pathPart, cmd);
			const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
			for (let j = 0; j < pathExt.length; j++) {
				const cur = p + pathExt[j];
				try {
					if (isexe.sync(cur, { pathExt: pathExtExe })) if (opt.all) found.push(cur);
					else return cur;
				} catch (ex) {}
			}
		}
		if (opt.all && found.length) return found;
		if (opt.nothrow) return null;
		throw getNotFoundError(cmd);
	};
	module.exports = which$1;
	which$1.sync = whichSync;
}) });

//#endregion
//#region ../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js": ((exports, module) => {
	const pathKey$1 = (options$1 = {}) => {
		const environment = options$1.env || process.env;
		if ((options$1.platform || process.platform) !== "win32") return "PATH";
		return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
	};
	module.exports = pathKey$1;
	module.exports.default = pathKey$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js": ((exports, module) => {
	const path$2 = __require("path");
	const which = require_which();
	const getPathKey = require_path_key();
	function resolveCommandAttempt(parsed, withoutPathExt) {
		const env = parsed.options.env || process.env;
		const cwd$1 = process.cwd();
		const hasCustomCwd = parsed.options.cwd != null;
		const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
		if (shouldSwitchCwd) try {
			process.chdir(parsed.options.cwd);
		} catch (err) {}
		let resolved;
		try {
			resolved = which.sync(parsed.command, {
				path: env[getPathKey({ env })],
				pathExt: withoutPathExt ? path$2.delimiter : void 0
			});
		} catch (e) {} finally {
			if (shouldSwitchCwd) process.chdir(cwd$1);
		}
		if (resolved) resolved = path$2.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
		return resolved;
	}
	function resolveCommand$1(parsed) {
		return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
	}
	module.exports = resolveCommand$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js
var require_escape = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js": ((exports, module) => {
	const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
	function escapeCommand(arg) {
		arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	function escapeArgument(arg, doubleEscapeMetaChars) {
		arg = `${arg}`;
		arg = arg.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\"");
		arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
		arg = `"${arg}"`;
		arg = arg.replace(metaCharsRegExp, "^$1");
		if (doubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	module.exports.command = escapeCommand;
	module.exports.argument = escapeArgument;
}) });

//#endregion
//#region ../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js": ((exports, module) => {
	module.exports = /^#!(.*)/;
}) });

//#endregion
//#region ../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js": ((exports, module) => {
	const shebangRegex = require_shebang_regex();
	module.exports = (string = "") => {
		const match = string.match(shebangRegex);
		if (!match) return null;
		const [path$4, argument] = match[0].replace(/#! ?/, "").split(" ");
		const binary = path$4.split("/").pop();
		if (binary === "env") return argument;
		return argument ? `${binary} ${argument}` : binary;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js": ((exports, module) => {
	const fs$1 = __require("fs");
	const shebangCommand = require_shebang_command();
	function readShebang$1(command) {
		const size = 150;
		const buffer = Buffer.alloc(size);
		let fd;
		try {
			fd = fs$1.openSync(command, "r");
			fs$1.readSync(fd, buffer, 0, size, 0);
			fs$1.closeSync(fd);
		} catch (e) {}
		return shebangCommand(buffer.toString());
	}
	module.exports = readShebang$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js": ((exports, module) => {
	const path$1 = __require("path");
	const resolveCommand = require_resolveCommand();
	const escape = require_escape();
	const readShebang = require_readShebang();
	const isWin$1 = process.platform === "win32";
	const isExecutableRegExp = /\.(?:com|exe)$/i;
	const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
	function detectShebang(parsed) {
		parsed.file = resolveCommand(parsed);
		const shebang = parsed.file && readShebang(parsed.file);
		if (shebang) {
			parsed.args.unshift(parsed.file);
			parsed.command = shebang;
			return resolveCommand(parsed);
		}
		return parsed.file;
	}
	function parseNonShell(parsed) {
		if (!isWin$1) return parsed;
		const commandFile = detectShebang(parsed);
		const needsShell = !isExecutableRegExp.test(commandFile);
		if (parsed.options.forceShell || needsShell) {
			const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
			parsed.command = path$1.normalize(parsed.command);
			parsed.command = escape.command(parsed.command);
			parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
			parsed.args = [
				"/d",
				"/s",
				"/c",
				`"${[parsed.command].concat(parsed.args).join(" ")}"`
			];
			parsed.command = process.env.comspec || "cmd.exe";
			parsed.options.windowsVerbatimArguments = true;
		}
		return parsed;
	}
	function parse$1(command, args, options$1) {
		if (args && !Array.isArray(args)) {
			options$1 = args;
			args = null;
		}
		args = args ? args.slice(0) : [];
		options$1 = Object.assign({}, options$1);
		const parsed = {
			command,
			args,
			options: options$1,
			file: void 0,
			original: {
				command,
				args
			}
		};
		return options$1.shell ? parsed : parseNonShell(parsed);
	}
	module.exports = parse$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js
var require_enoent = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js": ((exports, module) => {
	const isWin = process.platform === "win32";
	function notFoundError(original, syscall) {
		return Object.assign(/* @__PURE__ */ new Error(`${syscall} ${original.command} ENOENT`), {
			code: "ENOENT",
			errno: "ENOENT",
			syscall: `${syscall} ${original.command}`,
			path: original.command,
			spawnargs: original.args
		});
	}
	function hookChildProcess(cp$1, parsed) {
		if (!isWin) return;
		const originalEmit = cp$1.emit;
		cp$1.emit = function(name, arg1) {
			if (name === "exit") {
				const err = verifyENOENT(arg1, parsed);
				if (err) return originalEmit.call(cp$1, "error", err);
			}
			return originalEmit.apply(cp$1, arguments);
		};
	}
	function verifyENOENT(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawn");
		return null;
	}
	function verifyENOENTSync(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawnSync");
		return null;
	}
	module.exports = {
		hookChildProcess,
		verifyENOENT,
		verifyENOENTSync,
		notFoundError
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js
var require_cross_spawn = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js": ((exports, module) => {
	const cp = __require("child_process");
	const parse = require_parse();
	const enoent = require_enoent();
	function spawn$1(command, args, options$1) {
		const parsed = parse(command, args, options$1);
		const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
		enoent.hookChildProcess(spawned, parsed);
		return spawned;
	}
	function spawnSync$1(command, args, options$1) {
		const parsed = parse(command, args, options$1);
		const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
		result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
		return result;
	}
	module.exports = spawn$1;
	module.exports.spawn = spawn$1;
	module.exports.sync = spawnSync$1;
	module.exports._parse = parse;
	module.exports._enoent = enoent;
}) });

//#endregion
//#region ../../node_modules/.pnpm/path-key@4.0.0/node_modules/path-key/index.js
var import_cross_spawn = /* @__PURE__ */ __toESM(require_cross_spawn(), 1);
function pathKey(options$1 = {}) {
	const { env = process.env, platform: platform$1 = process.platform } = options$1;
	if (platform$1 !== "win32") return "PATH";
	return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

//#endregion
//#region ../../node_modules/.pnpm/unicorn-magic@0.3.0/node_modules/unicorn-magic/node.js
const execFileOriginal = promisify(execFile);
function toPath(urlOrPath) {
	return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}
function traversePathUp(startPath) {
	return { *[Symbol.iterator]() {
		let currentPath = path.resolve(toPath(startPath));
		let previousPath;
		while (previousPath !== currentPath) {
			yield currentPath;
			previousPath = currentPath;
			currentPath = path.resolve(currentPath, "..");
		}
	} };
}
const TEN_MEGABYTES_IN_BYTES = 10 * 1024 * 1024;

//#endregion
//#region ../../node_modules/.pnpm/npm-run-path@6.0.0/node_modules/npm-run-path/index.js
const npmRunPath = ({ cwd: cwd$1 = process$1.cwd(), path: pathOption = process$1.env[pathKey()], preferLocal = true, execPath: execPath$1 = process$1.execPath, addExecPath = true } = {}) => {
	const cwdPath = path.resolve(toPath(cwd$1));
	const result = [];
	const pathParts = pathOption.split(path.delimiter);
	if (preferLocal) applyPreferLocal(result, pathParts, cwdPath);
	if (addExecPath) applyExecPath(result, pathParts, execPath$1, cwdPath);
	return pathOption === "" || pathOption === path.delimiter ? `${result.join(path.delimiter)}${pathOption}` : [...result, pathOption].join(path.delimiter);
};
const applyPreferLocal = (result, pathParts, cwdPath) => {
	for (const directory of traversePathUp(cwdPath)) {
		const pathPart = path.join(directory, "node_modules/.bin");
		if (!pathParts.includes(pathPart)) result.push(pathPart);
	}
};
const applyExecPath = (result, pathParts, execPath$1, cwdPath) => {
	const pathPart = path.resolve(cwdPath, toPath(execPath$1), "..");
	if (!pathParts.includes(pathPart)) result.push(pathPart);
};
const npmRunPathEnv = ({ env = process$1.env,...options$1 } = {}) => {
	env = { ...env };
	const pathName = pathKey({ env });
	options$1.path = env[pathName];
	env[pathName] = npmRunPath(options$1);
	return env;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/final-error.js
const getFinalError = (originalError, message, isSync) => {
	return new (isSync ? ExecaSyncError : ExecaError)(message, originalError instanceof DiscardedError ? {} : { cause: originalError });
};
var DiscardedError = class extends Error {};
const setErrorName = (ErrorClass, value) => {
	Object.defineProperty(ErrorClass.prototype, "name", {
		value,
		writable: true,
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ErrorClass.prototype, execaErrorSymbol, {
		value: true,
		writable: false,
		enumerable: false,
		configurable: false
	});
};
const isExecaError = (error) => isErrorInstance(error) && execaErrorSymbol in error;
const execaErrorSymbol = Symbol("isExecaError");
const isErrorInstance = (value) => Object.prototype.toString.call(value) === "[object Error]";
var ExecaError = class extends Error {};
setErrorName(ExecaError, ExecaError.name);
var ExecaSyncError = class extends Error {};
setErrorName(ExecaSyncError, ExecaSyncError.name);

//#endregion
//#region ../../node_modules/.pnpm/human-signals@8.0.1/node_modules/human-signals/build/src/realtime.js
const getRealtimeSignals = () => {
	const length = SIGRTMAX - SIGRTMIN + 1;
	return Array.from({ length }, getRealtimeSignal);
};
const getRealtimeSignal = (value, index) => ({
	name: `SIGRT${index + 1}`,
	number: SIGRTMIN + index,
	action: "terminate",
	description: "Application-specific signal (realtime)",
	standard: "posix"
});
const SIGRTMIN = 34;
const SIGRTMAX = 64;

//#endregion
//#region ../../node_modules/.pnpm/human-signals@8.0.1/node_modules/human-signals/build/src/core.js
const SIGNALS = [
	{
		name: "SIGHUP",
		number: 1,
		action: "terminate",
		description: "Terminal closed",
		standard: "posix"
	},
	{
		name: "SIGINT",
		number: 2,
		action: "terminate",
		description: "User interruption with CTRL-C",
		standard: "ansi"
	},
	{
		name: "SIGQUIT",
		number: 3,
		action: "core",
		description: "User interruption with CTRL-\\",
		standard: "posix"
	},
	{
		name: "SIGILL",
		number: 4,
		action: "core",
		description: "Invalid machine instruction",
		standard: "ansi"
	},
	{
		name: "SIGTRAP",
		number: 5,
		action: "core",
		description: "Debugger breakpoint",
		standard: "posix"
	},
	{
		name: "SIGABRT",
		number: 6,
		action: "core",
		description: "Aborted",
		standard: "ansi"
	},
	{
		name: "SIGIOT",
		number: 6,
		action: "core",
		description: "Aborted",
		standard: "bsd"
	},
	{
		name: "SIGBUS",
		number: 7,
		action: "core",
		description: "Bus error due to misaligned, non-existing address or paging error",
		standard: "bsd"
	},
	{
		name: "SIGEMT",
		number: 7,
		action: "terminate",
		description: "Command should be emulated but is not implemented",
		standard: "other"
	},
	{
		name: "SIGFPE",
		number: 8,
		action: "core",
		description: "Floating point arithmetic error",
		standard: "ansi"
	},
	{
		name: "SIGKILL",
		number: 9,
		action: "terminate",
		description: "Forced termination",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGUSR1",
		number: 10,
		action: "terminate",
		description: "Application-specific signal",
		standard: "posix"
	},
	{
		name: "SIGSEGV",
		number: 11,
		action: "core",
		description: "Segmentation fault",
		standard: "ansi"
	},
	{
		name: "SIGUSR2",
		number: 12,
		action: "terminate",
		description: "Application-specific signal",
		standard: "posix"
	},
	{
		name: "SIGPIPE",
		number: 13,
		action: "terminate",
		description: "Broken pipe or socket",
		standard: "posix"
	},
	{
		name: "SIGALRM",
		number: 14,
		action: "terminate",
		description: "Timeout or timer",
		standard: "posix"
	},
	{
		name: "SIGTERM",
		number: 15,
		action: "terminate",
		description: "Termination",
		standard: "ansi"
	},
	{
		name: "SIGSTKFLT",
		number: 16,
		action: "terminate",
		description: "Stack is empty or overflowed",
		standard: "other"
	},
	{
		name: "SIGCHLD",
		number: 17,
		action: "ignore",
		description: "Child process terminated, paused or unpaused",
		standard: "posix"
	},
	{
		name: "SIGCLD",
		number: 17,
		action: "ignore",
		description: "Child process terminated, paused or unpaused",
		standard: "other"
	},
	{
		name: "SIGCONT",
		number: 18,
		action: "unpause",
		description: "Unpaused",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGSTOP",
		number: 19,
		action: "pause",
		description: "Paused",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGTSTP",
		number: 20,
		action: "pause",
		description: "Paused using CTRL-Z or \"suspend\"",
		standard: "posix"
	},
	{
		name: "SIGTTIN",
		number: 21,
		action: "pause",
		description: "Background process cannot read terminal input",
		standard: "posix"
	},
	{
		name: "SIGBREAK",
		number: 21,
		action: "terminate",
		description: "User interruption with CTRL-BREAK",
		standard: "other"
	},
	{
		name: "SIGTTOU",
		number: 22,
		action: "pause",
		description: "Background process cannot write to terminal output",
		standard: "posix"
	},
	{
		name: "SIGURG",
		number: 23,
		action: "ignore",
		description: "Socket received out-of-band data",
		standard: "bsd"
	},
	{
		name: "SIGXCPU",
		number: 24,
		action: "core",
		description: "Process timed out",
		standard: "bsd"
	},
	{
		name: "SIGXFSZ",
		number: 25,
		action: "core",
		description: "File too big",
		standard: "bsd"
	},
	{
		name: "SIGVTALRM",
		number: 26,
		action: "terminate",
		description: "Timeout or timer",
		standard: "bsd"
	},
	{
		name: "SIGPROF",
		number: 27,
		action: "terminate",
		description: "Timeout or timer",
		standard: "bsd"
	},
	{
		name: "SIGWINCH",
		number: 28,
		action: "ignore",
		description: "Terminal window size changed",
		standard: "bsd"
	},
	{
		name: "SIGIO",
		number: 29,
		action: "terminate",
		description: "I/O is available",
		standard: "other"
	},
	{
		name: "SIGPOLL",
		number: 29,
		action: "terminate",
		description: "Watched event",
		standard: "other"
	},
	{
		name: "SIGINFO",
		number: 29,
		action: "ignore",
		description: "Request for process information",
		standard: "other"
	},
	{
		name: "SIGPWR",
		number: 30,
		action: "terminate",
		description: "Device running out of power",
		standard: "systemv"
	},
	{
		name: "SIGSYS",
		number: 31,
		action: "core",
		description: "Invalid system call",
		standard: "other"
	},
	{
		name: "SIGUNUSED",
		number: 31,
		action: "terminate",
		description: "Invalid system call",
		standard: "other"
	}
];

//#endregion
//#region ../../node_modules/.pnpm/human-signals@8.0.1/node_modules/human-signals/build/src/signals.js
const getSignals = () => {
	const realtimeSignals = getRealtimeSignals();
	return [...SIGNALS, ...realtimeSignals].map(normalizeSignal$1);
};
const normalizeSignal$1 = ({ name, number: defaultNumber, description, action: action$2, forced = false, standard }) => {
	const { signals: { [name]: constantSignal } } = constants;
	const supported = constantSignal !== void 0;
	return {
		name,
		number: supported ? constantSignal : defaultNumber,
		description,
		supported,
		action: action$2,
		forced,
		standard
	};
};

//#endregion
//#region ../../node_modules/.pnpm/human-signals@8.0.1/node_modules/human-signals/build/src/main.js
const getSignalsByName = () => {
	const signals$1 = getSignals();
	return Object.fromEntries(signals$1.map(getSignalByName));
};
const getSignalByName = ({ name, number, description, supported, action: action$2, forced, standard }) => [name, {
	name,
	number,
	description,
	supported,
	action: action$2,
	forced,
	standard
}];
const signalsByName = getSignalsByName();
const getSignalsByNumber = () => {
	const signals$1 = getSignals();
	const length = SIGRTMAX + 1;
	const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals$1));
	return Object.assign({}, ...signalsA);
};
const getSignalByNumber = (number, signals$1) => {
	const signal = findSignalByNumber(number, signals$1);
	if (signal === void 0) return {};
	const { name, description, supported, action: action$2, forced, standard } = signal;
	return { [number]: {
		name,
		number,
		description,
		supported,
		action: action$2,
		forced,
		standard
	} };
};
const findSignalByNumber = (number, signals$1) => {
	const signal = signals$1.find(({ name }) => constants.signals[name] === number);
	if (signal !== void 0) return signal;
	return signals$1.find((signalA) => signalA.number === number);
};
const signalsByNumber = getSignalsByNumber();

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/signal.js
const normalizeKillSignal = (killSignal) => {
	const optionName = "option `killSignal`";
	if (killSignal === 0) throw new TypeError(`Invalid ${optionName}: 0 cannot be used.`);
	return normalizeSignal(killSignal, optionName);
};
const normalizeSignalArgument = (signal) => signal === 0 ? signal : normalizeSignal(signal, "`subprocess.kill()`'s argument");
const normalizeSignal = (signalNameOrInteger, optionName) => {
	if (Number.isInteger(signalNameOrInteger)) return normalizeSignalInteger(signalNameOrInteger, optionName);
	if (typeof signalNameOrInteger === "string") return normalizeSignalName(signalNameOrInteger, optionName);
	throw new TypeError(`Invalid ${optionName} ${String(signalNameOrInteger)}: it must be a string or an integer.\n${getAvailableSignals()}`);
};
const normalizeSignalInteger = (signalInteger, optionName) => {
	if (signalsIntegerToName.has(signalInteger)) return signalsIntegerToName.get(signalInteger);
	throw new TypeError(`Invalid ${optionName} ${signalInteger}: this signal integer does not exist.\n${getAvailableSignals()}`);
};
const getSignalsIntegerToName = () => new Map(Object.entries(constants.signals).reverse().map(([signalName, signalInteger]) => [signalInteger, signalName]));
const signalsIntegerToName = getSignalsIntegerToName();
const normalizeSignalName = (signalName, optionName) => {
	if (signalName in constants.signals) return signalName;
	if (signalName.toUpperCase() in constants.signals) throw new TypeError(`Invalid ${optionName} '${signalName}': please rename it to '${signalName.toUpperCase()}'.`);
	throw new TypeError(`Invalid ${optionName} '${signalName}': this signal name does not exist.\n${getAvailableSignals()}`);
};
const getAvailableSignals = () => `Available signal names: ${getAvailableSignalNames()}.
Available signal numbers: ${getAvailableSignalIntegers()}.`;
const getAvailableSignalNames = () => Object.keys(constants.signals).sort().map((signalName) => `'${signalName}'`).join(", ");
const getAvailableSignalIntegers = () => [...new Set(Object.values(constants.signals).sort((signalInteger, signalIntegerTwo) => signalInteger - signalIntegerTwo))].join(", ");
const getSignalDescription = (signal) => signalsByName[signal].description;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/kill.js
const normalizeForceKillAfterDelay = (forceKillAfterDelay) => {
	if (forceKillAfterDelay === false) return forceKillAfterDelay;
	if (forceKillAfterDelay === true) return DEFAULT_FORCE_KILL_TIMEOUT;
	if (!Number.isFinite(forceKillAfterDelay) || forceKillAfterDelay < 0) throw new TypeError(`Expected the \`forceKillAfterDelay\` option to be a non-negative integer, got \`${forceKillAfterDelay}\` (${typeof forceKillAfterDelay})`);
	return forceKillAfterDelay;
};
const DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
const subprocessKill = ({ kill, options: { forceKillAfterDelay, killSignal }, onInternalError, context, controller }, signalOrError, errorArgument) => {
	const { signal, error } = parseKillArguments(signalOrError, errorArgument, killSignal);
	emitKillError(error, onInternalError);
	const killResult = kill(signal);
	setKillTimeout({
		kill,
		signal,
		forceKillAfterDelay,
		killSignal,
		killResult,
		context,
		controller
	});
	return killResult;
};
const parseKillArguments = (signalOrError, errorArgument, killSignal) => {
	const [signal = killSignal, error] = isErrorInstance(signalOrError) ? [void 0, signalOrError] : [signalOrError, errorArgument];
	if (typeof signal !== "string" && !Number.isInteger(signal)) throw new TypeError(`The first argument must be an error instance or a signal name string/integer: ${String(signal)}`);
	if (error !== void 0 && !isErrorInstance(error)) throw new TypeError(`The second argument is optional. If specified, it must be an error instance: ${error}`);
	return {
		signal: normalizeSignalArgument(signal),
		error
	};
};
const emitKillError = (error, onInternalError) => {
	if (error !== void 0) onInternalError.reject(error);
};
const setKillTimeout = async ({ kill, signal, forceKillAfterDelay, killSignal, killResult, context, controller }) => {
	if (signal === killSignal && killResult) killOnTimeout({
		kill,
		forceKillAfterDelay,
		context,
		controllerSignal: controller.signal
	});
};
const killOnTimeout = async ({ kill, forceKillAfterDelay, context, controllerSignal }) => {
	if (forceKillAfterDelay === false) return;
	try {
		await setTimeout(forceKillAfterDelay, void 0, { signal: controllerSignal });
		if (kill("SIGKILL")) context.isForcefullyTerminated ??= true;
	} catch {}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/utils/abort-signal.js
const onAbortedSignal = async (mainSignal, stopSignal) => {
	if (!mainSignal.aborted) await once(mainSignal, "abort", { signal: stopSignal });
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/cancel.js
const validateCancelSignal = ({ cancelSignal }) => {
	if (cancelSignal !== void 0 && Object.prototype.toString.call(cancelSignal) !== "[object AbortSignal]") throw new Error(`The \`cancelSignal\` option must be an AbortSignal: ${String(cancelSignal)}`);
};
const throwOnCancel = ({ subprocess, cancelSignal, gracefulCancel, context, controller }) => cancelSignal === void 0 || gracefulCancel ? [] : [terminateOnCancel(subprocess, cancelSignal, context, controller)];
const terminateOnCancel = async (subprocess, cancelSignal, context, { signal }) => {
	await onAbortedSignal(cancelSignal, signal);
	context.terminationReason ??= "cancel";
	subprocess.kill();
	throw cancelSignal.reason;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/validation.js
const validateIpcMethod = ({ methodName, isSubprocess, ipc, isConnected: isConnected$1 }) => {
	validateIpcOption(methodName, isSubprocess, ipc);
	validateConnection(methodName, isSubprocess, isConnected$1);
};
const validateIpcOption = (methodName, isSubprocess, ipc) => {
	if (!ipc) throw new Error(`${getMethodName(methodName, isSubprocess)} can only be used if the \`ipc\` option is \`true\`.`);
};
const validateConnection = (methodName, isSubprocess, isConnected$1) => {
	if (!isConnected$1) throw new Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} has already exited or disconnected.`);
};
const throwOnEarlyDisconnect = (isSubprocess) => {
	throw new Error(`${getMethodName("getOneMessage", isSubprocess)} could not complete: the ${getOtherProcessName(isSubprocess)} exited or disconnected.`);
};
const throwOnStrictDeadlockError = (isSubprocess) => {
	throw new Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is sending a message too, instead of listening to incoming messages.
This can be fixed by both sending a message and listening to incoming messages at the same time:

const [receivedMessage] = await Promise.all([
	${getMethodName("getOneMessage", isSubprocess)},
	${getMethodName("sendMessage", isSubprocess, "message, {strict: true}")},
]);`);
};
const getStrictResponseError = (error, isSubprocess) => new Error(`${getMethodName("sendMessage", isSubprocess)} failed when sending an acknowledgment response to the ${getOtherProcessName(isSubprocess)}.`, { cause: error });
const throwOnMissingStrict = (isSubprocess) => {
	throw new Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is not listening to incoming messages.`);
};
const throwOnStrictDisconnect = (isSubprocess) => {
	throw new Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} exited without listening to incoming messages.`);
};
const getAbortDisconnectError = () => /* @__PURE__ */ new Error(`\`cancelSignal\` aborted: the ${getOtherProcessName(true)} disconnected.`);
const throwOnMissingParent = () => {
	throw new Error("`getCancelSignal()` cannot be used without setting the `cancelSignal` subprocess option.");
};
const handleEpipeError = ({ error, methodName, isSubprocess }) => {
	if (error.code === "EPIPE") throw new Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} is disconnecting.`, { cause: error });
};
const handleSerializationError = ({ error, methodName, isSubprocess, message }) => {
	if (isSerializationError(error)) throw new Error(`${getMethodName(methodName, isSubprocess)}'s argument type is invalid: the message cannot be serialized: ${String(message)}.`, { cause: error });
};
const isSerializationError = ({ code, message }) => SERIALIZATION_ERROR_CODES.has(code) || SERIALIZATION_ERROR_MESSAGES.some((serializationErrorMessage) => message.includes(serializationErrorMessage));
const SERIALIZATION_ERROR_CODES = new Set(["ERR_MISSING_ARGS", "ERR_INVALID_ARG_TYPE"]);
const SERIALIZATION_ERROR_MESSAGES = [
	"could not be cloned",
	"circular structure",
	"call stack size exceeded"
];
const getMethodName = (methodName, isSubprocess, parameters = "") => methodName === "cancelSignal" ? "`cancelSignal`'s `controller.abort()`" : `${getNamespaceName(isSubprocess)}${methodName}(${parameters})`;
const getNamespaceName = (isSubprocess) => isSubprocess ? "" : "subprocess.";
const getOtherProcessName = (isSubprocess) => isSubprocess ? "parent process" : "subprocess";
const disconnect = (anyProcess) => {
	if (anyProcess.connected) anyProcess.disconnect();
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/utils/deferred.js
const createDeferred = () => {
	const methods = {};
	const promise = new Promise((resolve, reject) => {
		Object.assign(methods, {
			resolve,
			reject
		});
	});
	return Object.assign(promise, methods);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/fd-options.js
const getToStream = (destination, to = "stdin") => {
	const isWritable = true;
	const { options: options$1, fileDescriptors } = SUBPROCESS_OPTIONS.get(destination);
	const fdNumber = getFdNumber(fileDescriptors, to, isWritable);
	const destinationStream = destination.stdio[fdNumber];
	if (destinationStream === null) throw new TypeError(getInvalidStdioOptionMessage(fdNumber, to, options$1, isWritable));
	return destinationStream;
};
const getFromStream = (source, from = "stdout") => {
	const isWritable = false;
	const { options: options$1, fileDescriptors } = SUBPROCESS_OPTIONS.get(source);
	const fdNumber = getFdNumber(fileDescriptors, from, isWritable);
	const sourceStream = fdNumber === "all" ? source.all : source.stdio[fdNumber];
	if (sourceStream === null || sourceStream === void 0) throw new TypeError(getInvalidStdioOptionMessage(fdNumber, from, options$1, isWritable));
	return sourceStream;
};
const SUBPROCESS_OPTIONS = /* @__PURE__ */ new WeakMap();
const getFdNumber = (fileDescriptors, fdName, isWritable) => {
	const fdNumber = parseFdNumber(fdName, isWritable);
	validateFdNumber(fdNumber, fdName, isWritable, fileDescriptors);
	return fdNumber;
};
const parseFdNumber = (fdName, isWritable) => {
	const fdNumber = parseFd(fdName);
	if (fdNumber !== void 0) return fdNumber;
	const { validOptions, defaultValue } = isWritable ? {
		validOptions: "\"stdin\"",
		defaultValue: "stdin"
	} : {
		validOptions: "\"stdout\", \"stderr\", \"all\"",
		defaultValue: "stdout"
	};
	throw new TypeError(`"${getOptionName(isWritable)}" must not be "${fdName}".
It must be ${validOptions} or "fd3", "fd4" (and so on).
It is optional and defaults to "${defaultValue}".`);
};
const validateFdNumber = (fdNumber, fdName, isWritable, fileDescriptors) => {
	const fileDescriptor = fileDescriptors[getUsedDescriptor(fdNumber)];
	if (fileDescriptor === void 0) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. That file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
	if (fileDescriptor.direction === "input" && !isWritable) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a readable stream, not writable.`);
	if (fileDescriptor.direction !== "input" && isWritable) throw new TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a writable stream, not readable.`);
};
const getInvalidStdioOptionMessage = (fdNumber, fdName, options$1, isWritable) => {
	if (fdNumber === "all" && !options$1.all) return "The \"all\" option must be true to use \"from: 'all'\".";
	const { optionName, optionValue } = getInvalidStdioOption(fdNumber, options$1);
	return `The "${optionName}: ${serializeOptionValue(optionValue)}" option is incompatible with using "${getOptionName(isWritable)}: ${serializeOptionValue(fdName)}".
Please set this option with "pipe" instead.`;
};
const getInvalidStdioOption = (fdNumber, { stdin, stdout, stderr, stdio }) => {
	const usedDescriptor = getUsedDescriptor(fdNumber);
	if (usedDescriptor === 0 && stdin !== void 0) return {
		optionName: "stdin",
		optionValue: stdin
	};
	if (usedDescriptor === 1 && stdout !== void 0) return {
		optionName: "stdout",
		optionValue: stdout
	};
	if (usedDescriptor === 2 && stderr !== void 0) return {
		optionName: "stderr",
		optionValue: stderr
	};
	return {
		optionName: `stdio[${usedDescriptor}]`,
		optionValue: stdio[usedDescriptor]
	};
};
const getUsedDescriptor = (fdNumber) => fdNumber === "all" ? 1 : fdNumber;
const getOptionName = (isWritable) => isWritable ? "to" : "from";
const serializeOptionValue = (value) => {
	if (typeof value === "string") return `'${value}'`;
	return typeof value === "number" ? `${value}` : "Stream";
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/utils/max-listeners.js
const incrementMaxListeners = (eventEmitter, maxListenersIncrement, signal) => {
	const maxListeners = eventEmitter.getMaxListeners();
	if (maxListeners === 0 || maxListeners === Number.POSITIVE_INFINITY) return;
	eventEmitter.setMaxListeners(maxListeners + maxListenersIncrement);
	addAbortListener(signal, () => {
		eventEmitter.setMaxListeners(eventEmitter.getMaxListeners() - maxListenersIncrement);
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/reference.js
const addReference = (channel, reference) => {
	if (reference) addReferenceCount(channel);
};
const addReferenceCount = (channel) => {
	channel.refCounted();
};
const removeReference = (channel, reference) => {
	if (reference) removeReferenceCount(channel);
};
const removeReferenceCount = (channel) => {
	channel.unrefCounted();
};
const undoAddedReferences = (channel, isSubprocess) => {
	if (isSubprocess) {
		removeReferenceCount(channel);
		removeReferenceCount(channel);
	}
};
const redoAddedReferences = (channel, isSubprocess) => {
	if (isSubprocess) {
		addReferenceCount(channel);
		addReferenceCount(channel);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/incoming.js
const onMessage = async ({ anyProcess, channel, isSubprocess, ipcEmitter }, wrappedMessage) => {
	if (handleStrictResponse(wrappedMessage) || handleAbort(wrappedMessage)) return;
	if (!INCOMING_MESSAGES.has(anyProcess)) INCOMING_MESSAGES.set(anyProcess, []);
	const incomingMessages = INCOMING_MESSAGES.get(anyProcess);
	incomingMessages.push(wrappedMessage);
	if (incomingMessages.length > 1) return;
	while (incomingMessages.length > 0) {
		await waitForOutgoingMessages(anyProcess, ipcEmitter, wrappedMessage);
		await scheduler.yield();
		const message = await handleStrictRequest({
			wrappedMessage: incomingMessages[0],
			anyProcess,
			channel,
			isSubprocess,
			ipcEmitter
		});
		incomingMessages.shift();
		ipcEmitter.emit("message", message);
		ipcEmitter.emit("message:done");
	}
};
const onDisconnect = async ({ anyProcess, channel, isSubprocess, ipcEmitter, boundOnMessage }) => {
	abortOnDisconnect();
	const incomingMessages = INCOMING_MESSAGES.get(anyProcess);
	while (incomingMessages?.length > 0) await once(ipcEmitter, "message:done");
	anyProcess.removeListener("message", boundOnMessage);
	redoAddedReferences(channel, isSubprocess);
	ipcEmitter.connected = false;
	ipcEmitter.emit("disconnect");
};
const INCOMING_MESSAGES = /* @__PURE__ */ new WeakMap();

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/forward.js
const getIpcEmitter = (anyProcess, channel, isSubprocess) => {
	if (IPC_EMITTERS.has(anyProcess)) return IPC_EMITTERS.get(anyProcess);
	const ipcEmitter = new EventEmitter();
	ipcEmitter.connected = true;
	IPC_EMITTERS.set(anyProcess, ipcEmitter);
	forwardEvents({
		ipcEmitter,
		anyProcess,
		channel,
		isSubprocess
	});
	return ipcEmitter;
};
const IPC_EMITTERS = /* @__PURE__ */ new WeakMap();
const forwardEvents = ({ ipcEmitter, anyProcess, channel, isSubprocess }) => {
	const boundOnMessage = onMessage.bind(void 0, {
		anyProcess,
		channel,
		isSubprocess,
		ipcEmitter
	});
	anyProcess.on("message", boundOnMessage);
	anyProcess.once("disconnect", onDisconnect.bind(void 0, {
		anyProcess,
		channel,
		isSubprocess,
		ipcEmitter,
		boundOnMessage
	}));
	undoAddedReferences(channel, isSubprocess);
};
const isConnected = (anyProcess) => {
	const ipcEmitter = IPC_EMITTERS.get(anyProcess);
	return ipcEmitter === void 0 ? anyProcess.channel !== null : ipcEmitter.connected;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/strict.js
const handleSendStrict = ({ anyProcess, channel, isSubprocess, message, strict }) => {
	if (!strict) return message;
	const hasListeners = hasMessageListeners(anyProcess, getIpcEmitter(anyProcess, channel, isSubprocess));
	return {
		id: count++,
		type: REQUEST_TYPE,
		message,
		hasListeners
	};
};
let count = 0n;
const validateStrictDeadlock = (outgoingMessages, wrappedMessage) => {
	if (wrappedMessage?.type !== REQUEST_TYPE || wrappedMessage.hasListeners) return;
	for (const { id } of outgoingMessages) if (id !== void 0) STRICT_RESPONSES[id].resolve({
		isDeadlock: true,
		hasListeners: false
	});
};
const handleStrictRequest = async ({ wrappedMessage, anyProcess, channel, isSubprocess, ipcEmitter }) => {
	if (wrappedMessage?.type !== REQUEST_TYPE || !anyProcess.connected) return wrappedMessage;
	const { id, message } = wrappedMessage;
	const response = {
		id,
		type: RESPONSE_TYPE,
		message: hasMessageListeners(anyProcess, ipcEmitter)
	};
	try {
		await sendMessage$1({
			anyProcess,
			channel,
			isSubprocess,
			ipc: true
		}, response);
	} catch (error) {
		ipcEmitter.emit("strict:error", error);
	}
	return message;
};
const handleStrictResponse = (wrappedMessage) => {
	if (wrappedMessage?.type !== RESPONSE_TYPE) return false;
	const { id, message: hasListeners } = wrappedMessage;
	STRICT_RESPONSES[id]?.resolve({
		isDeadlock: false,
		hasListeners
	});
	return true;
};
const waitForStrictResponse = async (wrappedMessage, anyProcess, isSubprocess) => {
	if (wrappedMessage?.type !== REQUEST_TYPE) return;
	const deferred = createDeferred();
	STRICT_RESPONSES[wrappedMessage.id] = deferred;
	const controller = new AbortController();
	try {
		const { isDeadlock, hasListeners } = await Promise.race([deferred, throwOnDisconnect$1(anyProcess, isSubprocess, controller)]);
		if (isDeadlock) throwOnStrictDeadlockError(isSubprocess);
		if (!hasListeners) throwOnMissingStrict(isSubprocess);
	} finally {
		controller.abort();
		delete STRICT_RESPONSES[wrappedMessage.id];
	}
};
const STRICT_RESPONSES = {};
const throwOnDisconnect$1 = async (anyProcess, isSubprocess, { signal }) => {
	incrementMaxListeners(anyProcess, 1, signal);
	await once(anyProcess, "disconnect", { signal });
	throwOnStrictDisconnect(isSubprocess);
};
const REQUEST_TYPE = "execa:ipc:request";
const RESPONSE_TYPE = "execa:ipc:response";

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/outgoing.js
const startSendMessage = (anyProcess, wrappedMessage, strict) => {
	if (!OUTGOING_MESSAGES.has(anyProcess)) OUTGOING_MESSAGES.set(anyProcess, /* @__PURE__ */ new Set());
	const outgoingMessages = OUTGOING_MESSAGES.get(anyProcess);
	const outgoingMessage = {
		onMessageSent: createDeferred(),
		id: strict ? wrappedMessage.id : void 0
	};
	outgoingMessages.add(outgoingMessage);
	return {
		outgoingMessages,
		outgoingMessage
	};
};
const endSendMessage = ({ outgoingMessages, outgoingMessage }) => {
	outgoingMessages.delete(outgoingMessage);
	outgoingMessage.onMessageSent.resolve();
};
const waitForOutgoingMessages = async (anyProcess, ipcEmitter, wrappedMessage) => {
	while (!hasMessageListeners(anyProcess, ipcEmitter) && OUTGOING_MESSAGES.get(anyProcess)?.size > 0) {
		const outgoingMessages = [...OUTGOING_MESSAGES.get(anyProcess)];
		validateStrictDeadlock(outgoingMessages, wrappedMessage);
		await Promise.all(outgoingMessages.map(({ onMessageSent }) => onMessageSent));
	}
};
const OUTGOING_MESSAGES = /* @__PURE__ */ new WeakMap();
const hasMessageListeners = (anyProcess, ipcEmitter) => ipcEmitter.listenerCount("message") > getMinListenerCount(anyProcess);
const getMinListenerCount = (anyProcess) => SUBPROCESS_OPTIONS.has(anyProcess) && !getFdSpecificValue(SUBPROCESS_OPTIONS.get(anyProcess).options.buffer, "ipc") ? 1 : 0;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/send.js
const sendMessage$1 = ({ anyProcess, channel, isSubprocess, ipc }, message, { strict = false } = {}) => {
	const methodName = "sendMessage";
	validateIpcMethod({
		methodName,
		isSubprocess,
		ipc,
		isConnected: anyProcess.connected
	});
	return sendMessageAsync({
		anyProcess,
		channel,
		methodName,
		isSubprocess,
		message,
		strict
	});
};
const sendMessageAsync = async ({ anyProcess, channel, methodName, isSubprocess, message, strict }) => {
	const wrappedMessage = handleSendStrict({
		anyProcess,
		channel,
		isSubprocess,
		message,
		strict
	});
	const outgoingMessagesState = startSendMessage(anyProcess, wrappedMessage, strict);
	try {
		await sendOneMessage({
			anyProcess,
			methodName,
			isSubprocess,
			wrappedMessage,
			message
		});
	} catch (error) {
		disconnect(anyProcess);
		throw error;
	} finally {
		endSendMessage(outgoingMessagesState);
	}
};
const sendOneMessage = async ({ anyProcess, methodName, isSubprocess, wrappedMessage, message }) => {
	const sendMethod = getSendMethod(anyProcess);
	try {
		await Promise.all([waitForStrictResponse(wrappedMessage, anyProcess, isSubprocess), sendMethod(wrappedMessage)]);
	} catch (error) {
		handleEpipeError({
			error,
			methodName,
			isSubprocess
		});
		handleSerializationError({
			error,
			methodName,
			isSubprocess,
			message
		});
		throw error;
	}
};
const getSendMethod = (anyProcess) => {
	if (PROCESS_SEND_METHODS.has(anyProcess)) return PROCESS_SEND_METHODS.get(anyProcess);
	const sendMethod = promisify(anyProcess.send.bind(anyProcess));
	PROCESS_SEND_METHODS.set(anyProcess, sendMethod);
	return sendMethod;
};
const PROCESS_SEND_METHODS = /* @__PURE__ */ new WeakMap();

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/graceful.js
const sendAbort = (subprocess, message) => {
	const methodName = "cancelSignal";
	validateConnection(methodName, false, subprocess.connected);
	return sendOneMessage({
		anyProcess: subprocess,
		methodName,
		isSubprocess: false,
		wrappedMessage: {
			type: GRACEFUL_CANCEL_TYPE,
			message
		},
		message
	});
};
const getCancelSignal$1 = async ({ anyProcess, channel, isSubprocess, ipc }) => {
	await startIpc({
		anyProcess,
		channel,
		isSubprocess,
		ipc
	});
	return cancelController.signal;
};
const startIpc = async ({ anyProcess, channel, isSubprocess, ipc }) => {
	if (cancelListening) return;
	cancelListening = true;
	if (!ipc) {
		throwOnMissingParent();
		return;
	}
	if (channel === null) {
		abortOnDisconnect();
		return;
	}
	getIpcEmitter(anyProcess, channel, isSubprocess);
	await scheduler.yield();
};
let cancelListening = false;
const handleAbort = (wrappedMessage) => {
	if (wrappedMessage?.type !== GRACEFUL_CANCEL_TYPE) return false;
	cancelController.abort(wrappedMessage.message);
	return true;
};
const GRACEFUL_CANCEL_TYPE = "execa:ipc:cancel";
const abortOnDisconnect = () => {
	cancelController.abort(getAbortDisconnectError());
};
const cancelController = new AbortController();

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/graceful.js
const validateGracefulCancel = ({ gracefulCancel, cancelSignal, ipc, serialization }) => {
	if (!gracefulCancel) return;
	if (cancelSignal === void 0) throw new Error("The `cancelSignal` option must be defined when setting the `gracefulCancel` option.");
	if (!ipc) throw new Error("The `ipc` option cannot be false when setting the `gracefulCancel` option.");
	if (serialization === "json") throw new Error("The `serialization` option cannot be 'json' when setting the `gracefulCancel` option.");
};
const throwOnGracefulCancel = ({ subprocess, cancelSignal, gracefulCancel, forceKillAfterDelay, context, controller }) => gracefulCancel ? [sendOnAbort({
	subprocess,
	cancelSignal,
	forceKillAfterDelay,
	context,
	controller
})] : [];
const sendOnAbort = async ({ subprocess, cancelSignal, forceKillAfterDelay, context, controller: { signal } }) => {
	await onAbortedSignal(cancelSignal, signal);
	await sendAbort(subprocess, getReason(cancelSignal));
	killOnTimeout({
		kill: subprocess.kill,
		forceKillAfterDelay,
		context,
		controllerSignal: signal
	});
	context.terminationReason ??= "gracefulCancel";
	throw cancelSignal.reason;
};
const getReason = ({ reason }) => {
	if (!(reason instanceof DOMException)) return reason;
	const error = new Error(reason.message);
	Object.defineProperty(error, "stack", {
		value: reason.stack,
		enumerable: false,
		configurable: true,
		writable: true
	});
	return error;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/timeout.js
const validateTimeout = ({ timeout }) => {
	if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
};
const throwOnTimeout = (subprocess, timeout, context, controller) => timeout === 0 || timeout === void 0 ? [] : [killAfterTimeout(subprocess, timeout, context, controller)];
const killAfterTimeout = async (subprocess, timeout, context, { signal }) => {
	await setTimeout(timeout, void 0, { signal });
	context.terminationReason ??= "timeout";
	subprocess.kill();
	throw new DiscardedError();
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/node.js
const mapNode = ({ options: options$1 }) => {
	if (options$1.node === false) throw new TypeError("The \"node\" option cannot be false with `execaNode()`.");
	return { options: {
		...options$1,
		node: true
	} };
};
const handleNodeOption = (file, commandArguments, { node: shouldHandleNode = false, nodePath = execPath, nodeOptions = execArgv.filter((nodeOption) => !nodeOption.startsWith("--inspect")), cwd: cwd$1, execPath: formerNodePath,...options$1 }) => {
	if (formerNodePath !== void 0) throw new TypeError("The \"execPath\" option has been removed. Please use the \"nodePath\" option instead.");
	const normalizedNodePath = safeNormalizeFileUrl(nodePath, "The \"nodePath\" option");
	const resolvedNodePath = path.resolve(cwd$1, normalizedNodePath);
	const newOptions = {
		...options$1,
		nodePath: resolvedNodePath,
		node: shouldHandleNode,
		cwd: cwd$1
	};
	if (!shouldHandleNode) return [
		file,
		commandArguments,
		newOptions
	];
	if (path.basename(file, ".exe") === "node") throw new TypeError("When the \"node\" option is true, the first argument does not need to be \"node\".");
	return [
		resolvedNodePath,
		[
			...nodeOptions,
			file,
			...commandArguments
		],
		{
			ipc: true,
			...newOptions,
			shell: false
		}
	];
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/ipc-input.js
const validateIpcInputOption = ({ ipcInput, ipc, serialization }) => {
	if (ipcInput === void 0) return;
	if (!ipc) throw new Error("The `ipcInput` option cannot be set unless the `ipc` option is `true`.");
	validateIpcInput[serialization](ipcInput);
};
const validateAdvancedInput = (ipcInput) => {
	try {
		serialize(ipcInput);
	} catch (error) {
		throw new Error("The `ipcInput` option is not serializable with a structured clone.", { cause: error });
	}
};
const validateJsonInput = (ipcInput) => {
	try {
		JSON.stringify(ipcInput);
	} catch (error) {
		throw new Error("The `ipcInput` option is not serializable with JSON.", { cause: error });
	}
};
const validateIpcInput = {
	advanced: validateAdvancedInput,
	json: validateJsonInput
};
const sendIpcInput = async (subprocess, ipcInput) => {
	if (ipcInput === void 0) return;
	await subprocess.sendMessage(ipcInput);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/encoding-option.js
const validateEncoding = ({ encoding }) => {
	if (ENCODINGS.has(encoding)) return;
	const correctEncoding = getCorrectEncoding(encoding);
	if (correctEncoding !== void 0) throw new TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to ${serializeEncoding(correctEncoding)}.`);
	const correctEncodings = [...ENCODINGS].map((correctEncoding$1) => serializeEncoding(correctEncoding$1)).join(", ");
	throw new TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to one of: ${correctEncodings}.`);
};
const TEXT_ENCODINGS = new Set(["utf8", "utf16le"]);
const BINARY_ENCODINGS = new Set([
	"buffer",
	"hex",
	"base64",
	"base64url",
	"latin1",
	"ascii"
]);
const ENCODINGS = new Set([...TEXT_ENCODINGS, ...BINARY_ENCODINGS]);
const getCorrectEncoding = (encoding) => {
	if (encoding === null) return "buffer";
	if (typeof encoding !== "string") return;
	const lowerEncoding = encoding.toLowerCase();
	if (lowerEncoding in ENCODING_ALIASES) return ENCODING_ALIASES[lowerEncoding];
	if (ENCODINGS.has(lowerEncoding)) return lowerEncoding;
};
const ENCODING_ALIASES = {
	"utf-8": "utf8",
	"utf-16le": "utf16le",
	"ucs-2": "utf16le",
	ucs2: "utf16le",
	binary: "latin1"
};
const serializeEncoding = (encoding) => typeof encoding === "string" ? `"${encoding}"` : String(encoding);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/cwd.js
const normalizeCwd = (cwd$1 = getDefaultCwd()) => {
	const cwdString = safeNormalizeFileUrl(cwd$1, "The \"cwd\" option");
	return path.resolve(cwdString);
};
const getDefaultCwd = () => {
	try {
		return process$1.cwd();
	} catch (error) {
		error.message = `The current directory does not exist.\n${error.message}`;
		throw error;
	}
};
const fixCwdError = (originalMessage, cwd$1) => {
	if (cwd$1 === getDefaultCwd()) return originalMessage;
	let cwdStat;
	try {
		cwdStat = statSync(cwd$1);
	} catch (error) {
		return `The "cwd" option is invalid: ${cwd$1}.\n${error.message}\n${originalMessage}`;
	}
	if (!cwdStat.isDirectory()) return `The "cwd" option is not a directory: ${cwd$1}.\n${originalMessage}`;
	return originalMessage;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/options.js
const normalizeOptions = (filePath, rawArguments, rawOptions) => {
	rawOptions.cwd = normalizeCwd(rawOptions.cwd);
	const [processedFile, processedArguments, processedOptions] = handleNodeOption(filePath, rawArguments, rawOptions);
	const { command: file, args: commandArguments, options: initialOptions } = import_cross_spawn.default._parse(processedFile, processedArguments, processedOptions);
	const options$1 = addDefaultOptions(normalizeFdSpecificOptions(initialOptions));
	validateTimeout(options$1);
	validateEncoding(options$1);
	validateIpcInputOption(options$1);
	validateCancelSignal(options$1);
	validateGracefulCancel(options$1);
	options$1.shell = normalizeFileUrl(options$1.shell);
	options$1.env = getEnv(options$1);
	options$1.killSignal = normalizeKillSignal(options$1.killSignal);
	options$1.forceKillAfterDelay = normalizeForceKillAfterDelay(options$1.forceKillAfterDelay);
	options$1.lines = options$1.lines.map((lines$4, fdNumber) => lines$4 && !BINARY_ENCODINGS.has(options$1.encoding) && options$1.buffer[fdNumber]);
	if (process$1.platform === "win32" && path.basename(file, ".exe") === "cmd") commandArguments.unshift("/q");
	return {
		file,
		commandArguments,
		options: options$1
	};
};
const addDefaultOptions = ({ extendEnv = true, preferLocal = false, cwd: cwd$1, localDir: localDirectory = cwd$1, encoding = "utf8", reject = true, cleanup = true, all = false, windowsHide = true, killSignal = "SIGTERM", forceKillAfterDelay = true, gracefulCancel = false, ipcInput, ipc = ipcInput !== void 0 || gracefulCancel, serialization = "advanced",...options$1 }) => ({
	...options$1,
	extendEnv,
	preferLocal,
	cwd: cwd$1,
	localDirectory,
	encoding,
	reject,
	cleanup,
	all,
	windowsHide,
	killSignal,
	forceKillAfterDelay,
	gracefulCancel,
	ipcInput,
	ipc,
	serialization
});
const getEnv = ({ env: envOption, extendEnv, preferLocal, node, localDirectory, nodePath }) => {
	const env = extendEnv ? {
		...process$1.env,
		...envOption
	} : envOption;
	if (preferLocal || node) return npmRunPathEnv({
		env,
		cwd: localDirectory,
		execPath: nodePath,
		preferLocal,
		addExecPath: node
	});
	return env;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/arguments/shell.js
const concatenateShell = (file, commandArguments, options$1) => options$1.shell && commandArguments.length > 0 ? [
	[file, ...commandArguments].join(" "),
	[],
	options$1
] : [
	file,
	commandArguments,
	options$1
];

//#endregion
//#region ../../node_modules/.pnpm/strip-final-newline@4.0.0/node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
	if (typeof input === "string") return stripFinalNewlineString(input);
	if (!(ArrayBuffer.isView(input) && input.BYTES_PER_ELEMENT === 1)) throw new Error("Input must be a string or a Uint8Array");
	return stripFinalNewlineBinary(input);
}
const stripFinalNewlineString = (input) => input.at(-1) === LF ? input.slice(0, input.at(-2) === CR ? -2 : -1) : input;
const stripFinalNewlineBinary = (input) => input.at(-1) === LF_BINARY ? input.subarray(0, input.at(-2) === CR_BINARY ? -2 : -1) : input;
const LF = "\n";
const LF_BINARY = LF.codePointAt(0);
const CR = "\r";
const CR_BINARY = CR.codePointAt(0);

//#endregion
//#region ../../node_modules/.pnpm/is-stream@4.0.1/node_modules/is-stream/index.js
function isStream(stream, { checkOpen = true } = {}) {
	return stream !== null && typeof stream === "object" && (stream.writable || stream.readable || !checkOpen || stream.writable === void 0 && stream.readable === void 0) && typeof stream.pipe === "function";
}
function isWritableStream(stream, { checkOpen = true } = {}) {
	return isStream(stream, { checkOpen }) && (stream.writable || !checkOpen) && typeof stream.write === "function" && typeof stream.end === "function" && typeof stream.writable === "boolean" && typeof stream.writableObjectMode === "boolean" && typeof stream.destroy === "function" && typeof stream.destroyed === "boolean";
}
function isReadableStream(stream, { checkOpen = true } = {}) {
	return isStream(stream, { checkOpen }) && (stream.readable || !checkOpen) && typeof stream.read === "function" && typeof stream.readable === "boolean" && typeof stream.readableObjectMode === "boolean" && typeof stream.destroy === "function" && typeof stream.destroyed === "boolean";
}
function isDuplexStream(stream, options$1) {
	return isWritableStream(stream, options$1) && isReadableStream(stream, options$1);
}

//#endregion
//#region ../../node_modules/.pnpm/@sec-ant+readable-stream@0.4.1/node_modules/@sec-ant/readable-stream/dist/ponyfill/asyncIterator.js
const a = Object.getPrototypeOf(Object.getPrototypeOf(
	/* istanbul ignore next */
	async function* () {}
).prototype);
var c$2 = class {
	#t;
	#n;
	#r = !1;
	#e = void 0;
	constructor(e, t) {
		this.#t = e, this.#n = t;
	}
	next() {
		const e = () => this.#s();
		return this.#e = this.#e ? this.#e.then(e, e) : e(), this.#e;
	}
	return(e) {
		const t = () => this.#i(e);
		return this.#e ? this.#e.then(t, t) : t();
	}
	async #s() {
		if (this.#r) return {
			done: !0,
			value: void 0
		};
		let e;
		try {
			e = await this.#t.read();
		} catch (t) {
			throw this.#e = void 0, this.#r = !0, this.#t.releaseLock(), t;
		}
		return e.done && (this.#e = void 0, this.#r = !0, this.#t.releaseLock()), e;
	}
	async #i(e) {
		if (this.#r) return {
			done: !0,
			value: e
		};
		if (this.#r = !0, !this.#n) {
			const t = this.#t.cancel(e);
			return this.#t.releaseLock(), await t, {
				done: !0,
				value: e
			};
		}
		return this.#t.releaseLock(), {
			done: !0,
			value: e
		};
	}
};
const n = Symbol();
function i() {
	return this[n].next();
}
Object.defineProperty(i, "name", { value: "next" });
function o(r) {
	return this[n].return(r);
}
Object.defineProperty(o, "name", { value: "return" });
const u = Object.create(a, {
	next: {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: i
	},
	return: {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: o
	}
});
function h({ preventCancel: r = !1 } = {}) {
	const t = new c$2(this.getReader(), r), s = Object.create(u);
	return s[n] = t, s;
}

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/stream.js
const getAsyncIterable = (stream) => {
	if (isReadableStream(stream, { checkOpen: false }) && nodeImports.on !== void 0) return getStreamIterable(stream);
	if (typeof stream?.[Symbol.asyncIterator] === "function") return stream;
	if (toString.call(stream) === "[object ReadableStream]") return h.call(stream);
	throw new TypeError("The first argument must be a Readable, a ReadableStream, or an async iterable.");
};
const { toString } = Object.prototype;
const getStreamIterable = async function* (stream) {
	const controller = new AbortController();
	const state = {};
	handleStreamEnd(stream, controller, state);
	try {
		for await (const [chunk] of nodeImports.on(stream, "data", { signal: controller.signal })) yield chunk;
	} catch (error) {
		if (state.error !== void 0) throw state.error;
		else if (!controller.signal.aborted) throw error;
	} finally {
		stream.destroy();
	}
};
const handleStreamEnd = async (stream, controller, state) => {
	try {
		await nodeImports.finished(stream, {
			cleanup: true,
			readable: true,
			writable: false,
			error: false
		});
	} catch (error) {
		state.error = error;
	} finally {
		controller.abort();
	}
};
const nodeImports = {};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/contents.js
const getStreamContents$1 = async (stream, { init: init$1, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
	const asyncIterable = getAsyncIterable(stream);
	const state = init$1();
	state.length = 0;
	try {
		for await (const chunk of asyncIterable) appendChunk({
			convertedChunk: convertChunk[getChunkType(chunk)](chunk, state),
			state,
			getSize,
			truncateChunk,
			addChunk,
			maxBuffer
		});
		appendFinalChunk({
			state,
			convertChunk,
			getSize,
			truncateChunk,
			addChunk,
			getFinalChunk,
			maxBuffer
		});
		return finalize(state);
	} catch (error) {
		const normalizedError = typeof error === "object" && error !== null ? error : new Error(error);
		normalizedError.bufferedData = finalize(state);
		throw normalizedError;
	}
};
const appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
	const convertedChunk = getFinalChunk(state);
	if (convertedChunk !== void 0) appendChunk({
		convertedChunk,
		state,
		getSize,
		truncateChunk,
		addChunk,
		maxBuffer
	});
};
const appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
	const chunkSize = getSize(convertedChunk);
	const newLength = state.length + chunkSize;
	if (newLength <= maxBuffer) {
		addNewChunk(convertedChunk, state, addChunk, newLength);
		return;
	}
	const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
	if (truncatedChunk !== void 0) addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
	throw new MaxBufferError();
};
const addNewChunk = (convertedChunk, state, addChunk, newLength) => {
	state.contents = addChunk(convertedChunk, state, newLength);
	state.length = newLength;
};
const getChunkType = (chunk) => {
	const typeOfChunk = typeof chunk;
	if (typeOfChunk === "string") return "string";
	if (typeOfChunk !== "object" || chunk === null) return "others";
	if (globalThis.Buffer?.isBuffer(chunk)) return "buffer";
	const prototypeName = objectToString.call(chunk);
	if (prototypeName === "[object ArrayBuffer]") return "arrayBuffer";
	if (prototypeName === "[object DataView]") return "dataView";
	if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString.call(chunk.buffer) === "[object ArrayBuffer]") return "typedArray";
	return "others";
};
const { toString: objectToString } = Object.prototype;
var MaxBufferError = class extends Error {
	name = "MaxBufferError";
	constructor() {
		super("maxBuffer exceeded");
	}
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/utils.js
const identity = (value) => value;
const noop$5 = () => void 0;
const getContentsProperty = ({ contents }) => contents;
const throwObjectStream = (chunk) => {
	throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};
const getLengthProperty = (convertedChunk) => convertedChunk.length;

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/array.js
async function getStreamAsArray(stream, options$1) {
	return getStreamContents$1(stream, arrayMethods, options$1);
}
const initArray = () => ({ contents: [] });
const increment = () => 1;
const addArrayChunk = (convertedChunk, { contents }) => {
	contents.push(convertedChunk);
	return contents;
};
const arrayMethods = {
	init: initArray,
	convertChunk: {
		string: identity,
		buffer: identity,
		arrayBuffer: identity,
		dataView: identity,
		typedArray: identity,
		others: identity
	},
	getSize: increment,
	truncateChunk: noop$5,
	addChunk: addArrayChunk,
	getFinalChunk: noop$5,
	finalize: getContentsProperty
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/array-buffer.js
async function getStreamAsArrayBuffer(stream, options$1) {
	return getStreamContents$1(stream, arrayBufferMethods, options$1);
}
const initArrayBuffer = () => ({ contents: /* @__PURE__ */ new ArrayBuffer(0) });
const useTextEncoder = (chunk) => textEncoder.encode(chunk);
const textEncoder = new TextEncoder();
const useUint8Array = (chunk) => new Uint8Array(chunk);
const useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
const truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
const addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
	const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
	new Uint8Array(newContents).set(convertedChunk, previousLength);
	return newContents;
};
const resizeArrayBufferSlow = (contents, length) => {
	if (length <= contents.byteLength) return contents;
	const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
const resizeArrayBuffer = (contents, length) => {
	if (length <= contents.maxByteLength) {
		contents.resize(length);
		return contents;
	}
	const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
const getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
const SCALE_FACTOR = 2;
const finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length);
const hasArrayBufferResize = () => "resize" in ArrayBuffer.prototype;
const arrayBufferMethods = {
	init: initArrayBuffer,
	convertChunk: {
		string: useTextEncoder,
		buffer: useUint8Array,
		arrayBuffer: useUint8Array,
		dataView: useUint8ArrayWithOffset,
		typedArray: useUint8ArrayWithOffset,
		others: throwObjectStream
	},
	getSize: getLengthProperty,
	truncateChunk: truncateArrayBufferChunk,
	addChunk: addArrayBufferChunk,
	getFinalChunk: noop$5,
	finalize: finalizeArrayBuffer
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/string.js
async function getStreamAsString(stream, options$1) {
	return getStreamContents$1(stream, stringMethods, options$1);
}
const initString = () => ({
	contents: "",
	textDecoder: new TextDecoder()
});
const useTextDecoder = (chunk, { textDecoder: textDecoder$1 }) => textDecoder$1.decode(chunk, { stream: true });
const addStringChunk = (convertedChunk, { contents }) => contents + convertedChunk;
const truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
const getFinalStringChunk = ({ textDecoder: textDecoder$1 }) => {
	const finalChunk = textDecoder$1.decode();
	return finalChunk === "" ? void 0 : finalChunk;
};
const stringMethods = {
	init: initString,
	convertChunk: {
		string: identity,
		buffer: useTextDecoder,
		arrayBuffer: useTextDecoder,
		dataView: useTextDecoder,
		typedArray: useTextDecoder,
		others: throwObjectStream
	},
	getSize: getLengthProperty,
	truncateChunk: truncateStringChunk,
	addChunk: addStringChunk,
	getFinalChunk: getFinalStringChunk,
	finalize: getContentsProperty
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/max-buffer.js
const handleMaxBuffer = ({ error, stream, readableObjectMode, lines: lines$4, encoding, fdNumber }) => {
	if (!(error instanceof MaxBufferError)) throw error;
	if (fdNumber === "all") return error;
	error.maxBufferInfo = {
		fdNumber,
		unit: getMaxBufferUnit(readableObjectMode, lines$4, encoding)
	};
	stream.destroy();
	throw error;
};
const getMaxBufferUnit = (readableObjectMode, lines$4, encoding) => {
	if (readableObjectMode) return "objects";
	if (lines$4) return "lines";
	if (encoding === "buffer") return "bytes";
	return "characters";
};
const checkIpcMaxBuffer = (subprocess, ipcOutput, maxBuffer) => {
	if (ipcOutput.length !== maxBuffer) return;
	const error = new MaxBufferError();
	error.maxBufferInfo = { fdNumber: "ipc" };
	throw error;
};
const getMaxBufferMessage = (error, maxBuffer) => {
	const { streamName, threshold, unit } = getMaxBufferInfo(error, maxBuffer);
	return `Command's ${streamName} was larger than ${threshold} ${unit}`;
};
const getMaxBufferInfo = (error, maxBuffer) => {
	if (error?.maxBufferInfo === void 0) return {
		streamName: "output",
		threshold: maxBuffer[1],
		unit: "bytes"
	};
	const { maxBufferInfo: { fdNumber, unit } } = error;
	delete error.maxBufferInfo;
	const threshold = getFdSpecificValue(maxBuffer, fdNumber);
	if (fdNumber === "ipc") return {
		streamName: "IPC output",
		threshold,
		unit: "messages"
	};
	return {
		streamName: getStreamName(fdNumber),
		threshold,
		unit
	};
};
const isMaxBufferSync = (resultError, output, maxBuffer) => resultError?.code === "ENOBUFS" && output !== null && output.some((result) => result !== null && result.length > getMaxBufferSync(maxBuffer));
const truncateMaxBufferSync = (result, isMaxBuffer, maxBuffer) => {
	if (!isMaxBuffer) return result;
	const maxBufferValue = getMaxBufferSync(maxBuffer);
	return result.length > maxBufferValue ? result.slice(0, maxBufferValue) : result;
};
const getMaxBufferSync = ([, stdoutMaxBuffer]) => stdoutMaxBuffer;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/message.js
const createMessages = ({ stdio, all, ipcOutput, originalError, signal, signalDescription, exitCode, escapedCommand, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, forceKillAfterDelay, killSignal, maxBuffer, timeout, cwd: cwd$1 }) => {
	const errorCode = originalError?.code;
	const prefix = getErrorPrefix({
		originalError,
		timedOut,
		timeout,
		isMaxBuffer,
		maxBuffer,
		errorCode,
		signal,
		signalDescription,
		exitCode,
		isCanceled,
		isGracefullyCanceled,
		isForcefullyTerminated,
		forceKillAfterDelay,
		killSignal
	});
	const originalMessage = getOriginalMessage(originalError, cwd$1);
	const shortMessage = `${prefix}: ${escapedCommand}${originalMessage === void 0 ? "" : `\n${originalMessage}`}`;
	return {
		originalMessage,
		shortMessage,
		message: [
			shortMessage,
			...all === void 0 ? [stdio[2], stdio[1]] : [all],
			...stdio.slice(3),
			ipcOutput.map((ipcMessage) => serializeIpcMessage(ipcMessage)).join("\n")
		].map((messagePart) => escapeLines(stripFinalNewline(serializeMessagePart(messagePart)))).filter(Boolean).join("\n\n")
	};
};
const getErrorPrefix = ({ originalError, timedOut, timeout, isMaxBuffer, maxBuffer, errorCode, signal, signalDescription, exitCode, isCanceled, isGracefullyCanceled, isForcefullyTerminated, forceKillAfterDelay, killSignal }) => {
	const forcefulSuffix = getForcefulSuffix(isForcefullyTerminated, forceKillAfterDelay);
	if (timedOut) return `Command timed out after ${timeout} milliseconds${forcefulSuffix}`;
	if (isGracefullyCanceled) {
		if (signal === void 0) return `Command was gracefully canceled with exit code ${exitCode}`;
		return isForcefullyTerminated ? `Command was gracefully canceled${forcefulSuffix}` : `Command was gracefully canceled with ${signal} (${signalDescription})`;
	}
	if (isCanceled) return `Command was canceled${forcefulSuffix}`;
	if (isMaxBuffer) return `${getMaxBufferMessage(originalError, maxBuffer)}${forcefulSuffix}`;
	if (errorCode !== void 0) return `Command failed with ${errorCode}${forcefulSuffix}`;
	if (isForcefullyTerminated) return `Command was killed with ${killSignal} (${getSignalDescription(killSignal)})${forcefulSuffix}`;
	if (signal !== void 0) return `Command was killed with ${signal} (${signalDescription})`;
	if (exitCode !== void 0) return `Command failed with exit code ${exitCode}`;
	return "Command failed";
};
const getForcefulSuffix = (isForcefullyTerminated, forceKillAfterDelay) => isForcefullyTerminated ? ` and was forcefully terminated after ${forceKillAfterDelay} milliseconds` : "";
const getOriginalMessage = (originalError, cwd$1) => {
	if (originalError instanceof DiscardedError) return;
	const escapedOriginalMessage = escapeLines(fixCwdError(isExecaError(originalError) ? originalError.originalMessage : String(originalError?.message ?? originalError), cwd$1));
	return escapedOriginalMessage === "" ? void 0 : escapedOriginalMessage;
};
const serializeIpcMessage = (ipcMessage) => typeof ipcMessage === "string" ? ipcMessage : inspect(ipcMessage);
const serializeMessagePart = (messagePart) => Array.isArray(messagePart) ? messagePart.map((messageItem) => stripFinalNewline(serializeMessageItem(messageItem))).filter(Boolean).join("\n") : serializeMessageItem(messagePart);
const serializeMessageItem = (messageItem) => {
	if (typeof messageItem === "string") return messageItem;
	if (isUint8Array(messageItem)) return uint8ArrayToString(messageItem);
	return "";
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/result.js
const makeSuccessResult = ({ command, escapedCommand, stdio, all, ipcOutput, options: { cwd: cwd$1 }, startTime }) => omitUndefinedProperties({
	command,
	escapedCommand,
	cwd: cwd$1,
	durationMs: getDurationMs(startTime),
	failed: false,
	timedOut: false,
	isCanceled: false,
	isGracefullyCanceled: false,
	isTerminated: false,
	isMaxBuffer: false,
	isForcefullyTerminated: false,
	exitCode: 0,
	stdout: stdio[1],
	stderr: stdio[2],
	all,
	stdio,
	ipcOutput,
	pipedFrom: []
});
const makeEarlyError = ({ error, command, escapedCommand, fileDescriptors, options: options$1, startTime, isSync }) => makeError({
	error,
	command,
	escapedCommand,
	startTime,
	timedOut: false,
	isCanceled: false,
	isGracefullyCanceled: false,
	isMaxBuffer: false,
	isForcefullyTerminated: false,
	stdio: Array.from({ length: fileDescriptors.length }),
	ipcOutput: [],
	options: options$1,
	isSync
});
const makeError = ({ error: originalError, command, escapedCommand, startTime, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, exitCode: rawExitCode, signal: rawSignal, stdio, all, ipcOutput, options: { timeoutDuration, timeout = timeoutDuration, forceKillAfterDelay, killSignal, cwd: cwd$1, maxBuffer }, isSync }) => {
	const { exitCode, signal, signalDescription } = normalizeExitPayload(rawExitCode, rawSignal);
	const { originalMessage, shortMessage, message } = createMessages({
		stdio,
		all,
		ipcOutput,
		originalError,
		signal,
		signalDescription,
		exitCode,
		escapedCommand,
		timedOut,
		isCanceled,
		isGracefullyCanceled,
		isMaxBuffer,
		isForcefullyTerminated,
		forceKillAfterDelay,
		killSignal,
		maxBuffer,
		timeout,
		cwd: cwd$1
	});
	const error = getFinalError(originalError, message, isSync);
	Object.assign(error, getErrorProperties({
		error,
		command,
		escapedCommand,
		startTime,
		timedOut,
		isCanceled,
		isGracefullyCanceled,
		isMaxBuffer,
		isForcefullyTerminated,
		exitCode,
		signal,
		signalDescription,
		stdio,
		all,
		ipcOutput,
		cwd: cwd$1,
		originalMessage,
		shortMessage
	}));
	return error;
};
const getErrorProperties = ({ error, command, escapedCommand, startTime, timedOut, isCanceled, isGracefullyCanceled, isMaxBuffer, isForcefullyTerminated, exitCode, signal, signalDescription, stdio, all, ipcOutput, cwd: cwd$1, originalMessage, shortMessage }) => omitUndefinedProperties({
	shortMessage,
	originalMessage,
	command,
	escapedCommand,
	cwd: cwd$1,
	durationMs: getDurationMs(startTime),
	failed: true,
	timedOut,
	isCanceled,
	isGracefullyCanceled,
	isTerminated: signal !== void 0,
	isMaxBuffer,
	isForcefullyTerminated,
	exitCode,
	signal,
	signalDescription,
	code: error.cause?.code,
	stdout: stdio[1],
	stderr: stdio[2],
	all,
	stdio,
	ipcOutput,
	pipedFrom: []
});
const omitUndefinedProperties = (result) => Object.fromEntries(Object.entries(result).filter(([, value]) => value !== void 0));
const normalizeExitPayload = (rawExitCode, rawSignal) => {
	const exitCode = rawExitCode === null ? void 0 : rawExitCode;
	const signal = rawSignal === null ? void 0 : rawSignal;
	return {
		exitCode,
		signal,
		signalDescription: signal === void 0 ? void 0 : getSignalDescription(rawSignal)
	};
};

//#endregion
//#region ../../node_modules/.pnpm/parse-ms@4.0.0/node_modules/parse-ms/index.js
const toZeroIfInfinity = (value) => Number.isFinite(value) ? value : 0;
function parseNumber(milliseconds) {
	return {
		days: Math.trunc(milliseconds / 864e5),
		hours: Math.trunc(milliseconds / 36e5 % 24),
		minutes: Math.trunc(milliseconds / 6e4 % 60),
		seconds: Math.trunc(milliseconds / 1e3 % 60),
		milliseconds: Math.trunc(milliseconds % 1e3),
		microseconds: Math.trunc(toZeroIfInfinity(milliseconds * 1e3) % 1e3),
		nanoseconds: Math.trunc(toZeroIfInfinity(milliseconds * 1e6) % 1e3)
	};
}
function parseBigint(milliseconds) {
	return {
		days: milliseconds / 86400000n,
		hours: milliseconds / 3600000n % 24n,
		minutes: milliseconds / 60000n % 60n,
		seconds: milliseconds / 1000n % 60n,
		milliseconds: milliseconds % 1000n,
		microseconds: 0n,
		nanoseconds: 0n
	};
}
function parseMilliseconds(milliseconds) {
	switch (typeof milliseconds) {
		case "number":
			if (Number.isFinite(milliseconds)) return parseNumber(milliseconds);
			break;
		case "bigint": return parseBigint(milliseconds);
	}
	throw new TypeError("Expected a finite number or bigint");
}

//#endregion
//#region ../../node_modules/.pnpm/pretty-ms@9.3.0/node_modules/pretty-ms/index.js
const isZero = (value) => value === 0 || value === 0n;
const pluralize = (word, count$1) => count$1 === 1 || count$1 === 1n ? word : `${word}s`;
const SECOND_ROUNDING_EPSILON = 1e-7;
const ONE_DAY_IN_MILLISECONDS = 24n * 60n * 60n * 1000n;
function prettyMilliseconds(milliseconds, options$1) {
	const isBigInt = typeof milliseconds === "bigint";
	if (!isBigInt && !Number.isFinite(milliseconds)) throw new TypeError("Expected a finite number or bigint");
	options$1 = { ...options$1 };
	const sign = milliseconds < 0 ? "-" : "";
	milliseconds = milliseconds < 0 ? -milliseconds : milliseconds;
	if (options$1.colonNotation) {
		options$1.compact = false;
		options$1.formatSubMilliseconds = false;
		options$1.separateMilliseconds = false;
		options$1.verbose = false;
	}
	if (options$1.compact) {
		options$1.unitCount = 1;
		options$1.secondsDecimalDigits = 0;
		options$1.millisecondsDecimalDigits = 0;
	}
	let result = [];
	const floorDecimals = (value, decimalDigits) => {
		const flooredInterimValue = Math.floor(value * 10 ** decimalDigits + SECOND_ROUNDING_EPSILON);
		return (Math.round(flooredInterimValue) / 10 ** decimalDigits).toFixed(decimalDigits);
	};
	const add = (value, long, short, valueString) => {
		if ((result.length === 0 || !options$1.colonNotation) && isZero(value) && !(options$1.colonNotation && short === "m")) return;
		valueString ??= String(value);
		if (options$1.colonNotation) {
			const wholeDigits = valueString.includes(".") ? valueString.split(".")[0].length : valueString.length;
			const minLength = result.length > 0 ? 2 : 1;
			valueString = "0".repeat(Math.max(0, minLength - wholeDigits)) + valueString;
		} else valueString += options$1.verbose ? " " + pluralize(long, value) : short;
		result.push(valueString);
	};
	const parsed = parseMilliseconds(milliseconds);
	const days = BigInt(parsed.days);
	if (options$1.hideYearAndDays) add(BigInt(days) * 24n + BigInt(parsed.hours), "hour", "h");
	else {
		if (options$1.hideYear) add(days, "day", "d");
		else {
			add(days / 365n, "year", "y");
			add(days % 365n, "day", "d");
		}
		add(Number(parsed.hours), "hour", "h");
	}
	add(Number(parsed.minutes), "minute", "m");
	if (!options$1.hideSeconds) if (options$1.separateMilliseconds || options$1.formatSubMilliseconds || !options$1.colonNotation && milliseconds < 1e3 && !options$1.subSecondsAsDecimals) {
		const seconds = Number(parsed.seconds);
		const milliseconds$1 = Number(parsed.milliseconds);
		const microseconds = Number(parsed.microseconds);
		const nanoseconds = Number(parsed.nanoseconds);
		add(seconds, "second", "s");
		if (options$1.formatSubMilliseconds) {
			add(milliseconds$1, "millisecond", "ms");
			add(microseconds, "microsecond", "µs");
			add(nanoseconds, "nanosecond", "ns");
		} else {
			const millisecondsAndBelow = milliseconds$1 + microseconds / 1e3 + nanoseconds / 1e6;
			const millisecondsDecimalDigits = typeof options$1.millisecondsDecimalDigits === "number" ? options$1.millisecondsDecimalDigits : 0;
			const millisecondsString = millisecondsDecimalDigits ? millisecondsAndBelow.toFixed(millisecondsDecimalDigits) : millisecondsAndBelow >= 1 ? Math.round(millisecondsAndBelow) : Math.ceil(millisecondsAndBelow);
			add(Number.parseFloat(millisecondsString), "millisecond", "ms", millisecondsString);
		}
	} else {
		const secondsFixed = floorDecimals((isBigInt ? Number(milliseconds % ONE_DAY_IN_MILLISECONDS) : milliseconds) / 1e3 % 60, typeof options$1.secondsDecimalDigits === "number" ? options$1.secondsDecimalDigits : 1);
		const secondsString = options$1.keepDecimalsOnWholeSeconds ? secondsFixed : secondsFixed.replace(/\.0+$/, "");
		add(Number.parseFloat(secondsString), "second", "s", secondsString);
	}
	if (result.length === 0) return sign + "0" + (options$1.verbose ? " milliseconds" : "ms");
	const separator = options$1.colonNotation ? ":" : " ";
	if (typeof options$1.unitCount === "number") result = result.slice(0, Math.max(options$1.unitCount, 1));
	return sign + result.join(separator);
}

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/error.js
const logError = (result, verboseInfo) => {
	if (result.failed) verboseLog({
		type: "error",
		verboseMessage: result.shortMessage,
		verboseInfo,
		result
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/complete.js
const logResult = (result, verboseInfo) => {
	if (!isVerbose(verboseInfo)) return;
	logError(result, verboseInfo);
	logDuration(result, verboseInfo);
};
const logDuration = (result, verboseInfo) => {
	verboseLog({
		type: "duration",
		verboseMessage: `(done in ${prettyMilliseconds(result.durationMs)})`,
		verboseInfo,
		result
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/reject.js
const handleResult = (result, verboseInfo, { reject }) => {
	logResult(result, verboseInfo);
	if (result.failed && reject) throw result;
	return result;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/type.js
const getStdioItemType = (value, optionName) => {
	if (isAsyncGenerator(value)) return "asyncGenerator";
	if (isSyncGenerator(value)) return "generator";
	if (isUrl(value)) return "fileUrl";
	if (isFilePathObject(value)) return "filePath";
	if (isWebStream(value)) return "webStream";
	if (isStream(value, { checkOpen: false })) return "native";
	if (isUint8Array(value)) return "uint8Array";
	if (isAsyncIterableObject(value)) return "asyncIterable";
	if (isIterableObject(value)) return "iterable";
	if (isTransformStream(value)) return getTransformStreamType({ transform: value }, optionName);
	if (isTransformOptions(value)) return getTransformObjectType(value, optionName);
	return "native";
};
const getTransformObjectType = (value, optionName) => {
	if (isDuplexStream(value.transform, { checkOpen: false })) return getDuplexType(value, optionName);
	if (isTransformStream(value.transform)) return getTransformStreamType(value, optionName);
	return getGeneratorObjectType(value, optionName);
};
const getDuplexType = (value, optionName) => {
	validateNonGeneratorType(value, optionName, "Duplex stream");
	return "duplex";
};
const getTransformStreamType = (value, optionName) => {
	validateNonGeneratorType(value, optionName, "web TransformStream");
	return "webTransform";
};
const validateNonGeneratorType = ({ final, binary, objectMode }, optionName, typeName) => {
	checkUndefinedOption(final, `${optionName}.final`, typeName);
	checkUndefinedOption(binary, `${optionName}.binary`, typeName);
	checkBooleanOption(objectMode, `${optionName}.objectMode`);
};
const checkUndefinedOption = (value, optionName, typeName) => {
	if (value !== void 0) throw new TypeError(`The \`${optionName}\` option can only be defined when using a generator, not a ${typeName}.`);
};
const getGeneratorObjectType = ({ transform, final, binary, objectMode }, optionName) => {
	if (transform !== void 0 && !isGenerator(transform)) throw new TypeError(`The \`${optionName}.transform\` option must be a generator, a Duplex stream or a web TransformStream.`);
	if (isDuplexStream(final, { checkOpen: false })) throw new TypeError(`The \`${optionName}.final\` option must not be a Duplex stream.`);
	if (isTransformStream(final)) throw new TypeError(`The \`${optionName}.final\` option must not be a web TransformStream.`);
	if (final !== void 0 && !isGenerator(final)) throw new TypeError(`The \`${optionName}.final\` option must be a generator.`);
	checkBooleanOption(binary, `${optionName}.binary`);
	checkBooleanOption(objectMode, `${optionName}.objectMode`);
	return isAsyncGenerator(transform) || isAsyncGenerator(final) ? "asyncGenerator" : "generator";
};
const checkBooleanOption = (value, optionName) => {
	if (value !== void 0 && typeof value !== "boolean") throw new TypeError(`The \`${optionName}\` option must use a boolean.`);
};
const isGenerator = (value) => isAsyncGenerator(value) || isSyncGenerator(value);
const isAsyncGenerator = (value) => Object.prototype.toString.call(value) === "[object AsyncGeneratorFunction]";
const isSyncGenerator = (value) => Object.prototype.toString.call(value) === "[object GeneratorFunction]";
const isTransformOptions = (value) => isPlainObject(value) && (value.transform !== void 0 || value.final !== void 0);
const isUrl = (value) => Object.prototype.toString.call(value) === "[object URL]";
const isRegularUrl = (value) => isUrl(value) && value.protocol !== "file:";
const isFilePathObject = (value) => isPlainObject(value) && Object.keys(value).length > 0 && Object.keys(value).every((key) => FILE_PATH_KEYS.has(key)) && isFilePathString(value.file);
const FILE_PATH_KEYS = new Set(["file", "append"]);
const isFilePathString = (file) => typeof file === "string";
const isUnknownStdioString = (type, value) => type === "native" && typeof value === "string" && !KNOWN_STDIO_STRINGS.has(value);
const KNOWN_STDIO_STRINGS = new Set([
	"ipc",
	"ignore",
	"inherit",
	"overlapped",
	"pipe"
]);
const isReadableStream$1 = (value) => Object.prototype.toString.call(value) === "[object ReadableStream]";
const isWritableStream$1 = (value) => Object.prototype.toString.call(value) === "[object WritableStream]";
const isWebStream = (value) => isReadableStream$1(value) || isWritableStream$1(value);
const isTransformStream = (value) => isReadableStream$1(value?.readable) && isWritableStream$1(value?.writable);
const isAsyncIterableObject = (value) => isObject(value) && typeof value[Symbol.asyncIterator] === "function";
const isIterableObject = (value) => isObject(value) && typeof value[Symbol.iterator] === "function";
const isObject = (value) => typeof value === "object" && value !== null;
const TRANSFORM_TYPES = new Set([
	"generator",
	"asyncGenerator",
	"duplex",
	"webTransform"
]);
const FILE_TYPES = new Set([
	"fileUrl",
	"filePath",
	"fileNumber"
]);
const SPECIAL_DUPLICATE_TYPES_SYNC = new Set(["fileUrl", "filePath"]);
const SPECIAL_DUPLICATE_TYPES = new Set([
	...SPECIAL_DUPLICATE_TYPES_SYNC,
	"webStream",
	"nodeStream"
]);
const FORBID_DUPLICATE_TYPES = new Set(["webTransform", "duplex"]);
const TYPE_TO_MESSAGE = {
	generator: "a generator",
	asyncGenerator: "an async generator",
	fileUrl: "a file URL",
	filePath: "a file path string",
	fileNumber: "a file descriptor number",
	webStream: "a web stream",
	nodeStream: "a Node.js stream",
	webTransform: "a web TransformStream",
	duplex: "a Duplex stream",
	native: "any value",
	iterable: "an iterable",
	asyncIterable: "an async iterable",
	string: "a string",
	uint8Array: "a Uint8Array"
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/object-mode.js
const getTransformObjectModes = (objectMode, index, newTransforms, direction) => direction === "output" ? getOutputObjectModes(objectMode, index, newTransforms) : getInputObjectModes(objectMode, index, newTransforms);
const getOutputObjectModes = (objectMode, index, newTransforms) => {
	const writableObjectMode = index !== 0 && newTransforms[index - 1].value.readableObjectMode;
	return {
		writableObjectMode,
		readableObjectMode: objectMode ?? writableObjectMode
	};
};
const getInputObjectModes = (objectMode, index, newTransforms) => {
	const writableObjectMode = index === 0 ? objectMode === true : newTransforms[index - 1].value.readableObjectMode;
	return {
		writableObjectMode,
		readableObjectMode: index !== newTransforms.length - 1 && (objectMode ?? writableObjectMode)
	};
};
const getFdObjectMode = (stdioItems, direction) => {
	const lastTransform = stdioItems.findLast(({ type }) => TRANSFORM_TYPES.has(type));
	if (lastTransform === void 0) return false;
	return direction === "input" ? lastTransform.value.writableObjectMode : lastTransform.value.readableObjectMode;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/normalize.js
const normalizeTransforms = (stdioItems, optionName, direction, options$1) => [...stdioItems.filter(({ type }) => !TRANSFORM_TYPES.has(type)), ...getTransforms(stdioItems, optionName, direction, options$1)];
const getTransforms = (stdioItems, optionName, direction, { encoding }) => {
	const transforms = stdioItems.filter(({ type }) => TRANSFORM_TYPES.has(type));
	const newTransforms = Array.from({ length: transforms.length });
	for (const [index, stdioItem] of Object.entries(transforms)) newTransforms[index] = normalizeTransform({
		stdioItem,
		index: Number(index),
		newTransforms,
		optionName,
		direction,
		encoding
	});
	return sortTransforms(newTransforms, direction);
};
const normalizeTransform = ({ stdioItem, stdioItem: { type }, index, newTransforms, optionName, direction, encoding }) => {
	if (type === "duplex") return normalizeDuplex({
		stdioItem,
		optionName
	});
	if (type === "webTransform") return normalizeTransformStream({
		stdioItem,
		index,
		newTransforms,
		direction
	});
	return normalizeGenerator({
		stdioItem,
		index,
		newTransforms,
		direction,
		encoding
	});
};
const normalizeDuplex = ({ stdioItem, stdioItem: { value: { transform, transform: { writableObjectMode, readableObjectMode }, objectMode = readableObjectMode } }, optionName }) => {
	if (objectMode && !readableObjectMode) throw new TypeError(`The \`${optionName}.objectMode\` option can only be \`true\` if \`new Duplex({objectMode: true})\` is used.`);
	if (!objectMode && readableObjectMode) throw new TypeError(`The \`${optionName}.objectMode\` option cannot be \`false\` if \`new Duplex({objectMode: true})\` is used.`);
	return {
		...stdioItem,
		value: {
			transform,
			writableObjectMode,
			readableObjectMode
		}
	};
};
const normalizeTransformStream = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction }) => {
	const { transform, objectMode } = isPlainObject(value) ? value : { transform: value };
	const { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
	return {
		...stdioItem,
		value: {
			transform,
			writableObjectMode,
			readableObjectMode
		}
	};
};
const normalizeGenerator = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction, encoding }) => {
	const { transform, final, binary: binaryOption = false, preserveNewlines = false, objectMode } = isPlainObject(value) ? value : { transform: value };
	const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
	const { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
	return {
		...stdioItem,
		value: {
			transform,
			final,
			binary,
			preserveNewlines,
			writableObjectMode,
			readableObjectMode
		}
	};
};
const sortTransforms = (newTransforms, direction) => direction === "input" ? newTransforms.reverse() : newTransforms;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/direction.js
const getStreamDirection = (stdioItems, fdNumber, optionName) => {
	const directions = stdioItems.map((stdioItem) => getStdioItemDirection(stdioItem, fdNumber));
	if (directions.includes("input") && directions.includes("output")) throw new TypeError(`The \`${optionName}\` option must not be an array of both readable and writable values.`);
	return directions.find(Boolean) ?? DEFAULT_DIRECTION;
};
const getStdioItemDirection = ({ type, value }, fdNumber) => KNOWN_DIRECTIONS[fdNumber] ?? guessStreamDirection[type](value);
const KNOWN_DIRECTIONS = [
	"input",
	"output",
	"output"
];
const anyDirection = () => void 0;
const alwaysInput = () => "input";
const guessStreamDirection = {
	generator: anyDirection,
	asyncGenerator: anyDirection,
	fileUrl: anyDirection,
	filePath: anyDirection,
	iterable: alwaysInput,
	asyncIterable: alwaysInput,
	uint8Array: alwaysInput,
	webStream: (value) => isWritableStream$1(value) ? "output" : "input",
	nodeStream(value) {
		if (!isReadableStream(value, { checkOpen: false })) return "output";
		return isWritableStream(value, { checkOpen: false }) ? void 0 : "input";
	},
	webTransform: anyDirection,
	duplex: anyDirection,
	native(value) {
		const standardStreamDirection = getStandardStreamDirection(value);
		if (standardStreamDirection !== void 0) return standardStreamDirection;
		if (isStream(value, { checkOpen: false })) return guessStreamDirection.nodeStream(value);
	}
};
const getStandardStreamDirection = (value) => {
	if ([0, process$1.stdin].includes(value)) return "input";
	if ([
		1,
		2,
		process$1.stdout,
		process$1.stderr
	].includes(value)) return "output";
};
const DEFAULT_DIRECTION = "output";

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/array.js
const normalizeIpcStdioArray = (stdioArray, ipc) => ipc && !stdioArray.includes("ipc") ? [...stdioArray, "ipc"] : stdioArray;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/stdio-option.js
const normalizeStdioOption = ({ stdio, ipc, buffer,...options$1 }, verboseInfo, isSync) => {
	const stdioArray = getStdioArray(stdio, options$1).map((stdioOption, fdNumber) => addDefaultValue(stdioOption, fdNumber));
	return isSync ? normalizeStdioSync(stdioArray, buffer, verboseInfo) : normalizeIpcStdioArray(stdioArray, ipc);
};
const getStdioArray = (stdio, options$1) => {
	if (stdio === void 0) return STANDARD_STREAMS_ALIASES.map((alias) => options$1[alias]);
	if (hasAlias(options$1)) throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${STANDARD_STREAMS_ALIASES.map((alias) => `\`${alias}\``).join(", ")}`);
	if (typeof stdio === "string") return [
		stdio,
		stdio,
		stdio
	];
	if (!Array.isArray(stdio)) throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	const length = Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length);
	return Array.from({ length }, (_, fdNumber) => stdio[fdNumber]);
};
const hasAlias = (options$1) => STANDARD_STREAMS_ALIASES.some((alias) => options$1[alias] !== void 0);
const addDefaultValue = (stdioOption, fdNumber) => {
	if (Array.isArray(stdioOption)) return stdioOption.map((item$2) => addDefaultValue(item$2, fdNumber));
	if (stdioOption === null || stdioOption === void 0) return fdNumber >= STANDARD_STREAMS_ALIASES.length ? "ignore" : "pipe";
	return stdioOption;
};
const normalizeStdioSync = (stdioArray, buffer, verboseInfo) => stdioArray.map((stdioOption, fdNumber) => !buffer[fdNumber] && fdNumber !== 0 && !isFullVerbose(verboseInfo, fdNumber) && isOutputPipeOnly(stdioOption) ? "ignore" : stdioOption);
const isOutputPipeOnly = (stdioOption) => stdioOption === "pipe" || Array.isArray(stdioOption) && stdioOption.every((item$2) => item$2 === "pipe");

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/native.js
const handleNativeStream = ({ stdioItem, stdioItem: { type }, isStdioArray, fdNumber, direction, isSync }) => {
	if (!isStdioArray || type !== "native") return stdioItem;
	return isSync ? handleNativeStreamSync({
		stdioItem,
		fdNumber,
		direction
	}) : handleNativeStreamAsync({
		stdioItem,
		fdNumber
	});
};
const handleNativeStreamSync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber, direction }) => {
	const targetFd = getTargetFd({
		value,
		optionName,
		fdNumber,
		direction
	});
	if (targetFd !== void 0) return targetFd;
	if (isStream(value, { checkOpen: false })) throw new TypeError(`The \`${optionName}: Stream\` option cannot both be an array and include a stream with synchronous methods.`);
	return stdioItem;
};
const getTargetFd = ({ value, optionName, fdNumber, direction }) => {
	const targetFdNumber = getTargetFdNumber(value, fdNumber);
	if (targetFdNumber === void 0) return;
	if (direction === "output") return {
		type: "fileNumber",
		value: targetFdNumber,
		optionName
	};
	if (tty.isatty(targetFdNumber)) throw new TypeError(`The \`${optionName}: ${serializeOptionValue(value)}\` option is invalid: it cannot be a TTY with synchronous methods.`);
	return {
		type: "uint8Array",
		value: bufferToUint8Array(readFileSync(targetFdNumber)),
		optionName
	};
};
const getTargetFdNumber = (value, fdNumber) => {
	if (value === "inherit") return fdNumber;
	if (typeof value === "number") return value;
	const standardStreamIndex = STANDARD_STREAMS.indexOf(value);
	if (standardStreamIndex !== -1) return standardStreamIndex;
};
const handleNativeStreamAsync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber }) => {
	if (value === "inherit") return {
		type: "nodeStream",
		value: getStandardStream(fdNumber, value, optionName),
		optionName
	};
	if (typeof value === "number") return {
		type: "nodeStream",
		value: getStandardStream(value, value, optionName),
		optionName
	};
	if (isStream(value, { checkOpen: false })) return {
		type: "nodeStream",
		value,
		optionName
	};
	return stdioItem;
};
const getStandardStream = (fdNumber, value, optionName) => {
	const standardStream = STANDARD_STREAMS[fdNumber];
	if (standardStream === void 0) throw new TypeError(`The \`${optionName}: ${value}\` option is invalid: no such standard stream.`);
	return standardStream;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/input-option.js
const handleInputOptions = ({ input, inputFile }, fdNumber) => fdNumber === 0 ? [...handleInputOption(input), ...handleInputFileOption(inputFile)] : [];
const handleInputOption = (input) => input === void 0 ? [] : [{
	type: getInputType(input),
	value: input,
	optionName: "input"
}];
const getInputType = (input) => {
	if (isReadableStream(input, { checkOpen: false })) return "nodeStream";
	if (typeof input === "string") return "string";
	if (isUint8Array(input)) return "uint8Array";
	throw new Error("The `input` option must be a string, a Uint8Array or a Node.js Readable stream.");
};
const handleInputFileOption = (inputFile) => inputFile === void 0 ? [] : [{
	...getInputFileType(inputFile),
	optionName: "inputFile"
}];
const getInputFileType = (inputFile) => {
	if (isUrl(inputFile)) return {
		type: "fileUrl",
		value: inputFile
	};
	if (isFilePathString(inputFile)) return {
		type: "filePath",
		value: { file: inputFile }
	};
	throw new Error("The `inputFile` option must be a file path string or a file URL.");
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/duplicate.js
const filterDuplicates = (stdioItems) => stdioItems.filter((stdioItemOne, indexOne) => stdioItems.every((stdioItemTwo, indexTwo) => stdioItemOne.value !== stdioItemTwo.value || indexOne >= indexTwo || stdioItemOne.type === "generator" || stdioItemOne.type === "asyncGenerator"));
const getDuplicateStream = ({ stdioItem: { type, value, optionName }, direction, fileDescriptors, isSync }) => {
	const otherStdioItems = getOtherStdioItems(fileDescriptors, type);
	if (otherStdioItems.length === 0) return;
	if (isSync) {
		validateDuplicateStreamSync({
			otherStdioItems,
			type,
			value,
			optionName,
			direction
		});
		return;
	}
	if (SPECIAL_DUPLICATE_TYPES.has(type)) return getDuplicateStreamInstance({
		otherStdioItems,
		type,
		value,
		optionName,
		direction
	});
	if (FORBID_DUPLICATE_TYPES.has(type)) validateDuplicateTransform({
		otherStdioItems,
		type,
		value,
		optionName
	});
};
const getOtherStdioItems = (fileDescriptors, type) => fileDescriptors.flatMap(({ direction, stdioItems }) => stdioItems.filter((stdioItem) => stdioItem.type === type).map(((stdioItem) => ({
	...stdioItem,
	direction
}))));
const validateDuplicateStreamSync = ({ otherStdioItems, type, value, optionName, direction }) => {
	if (SPECIAL_DUPLICATE_TYPES_SYNC.has(type)) getDuplicateStreamInstance({
		otherStdioItems,
		type,
		value,
		optionName,
		direction
	});
};
const getDuplicateStreamInstance = ({ otherStdioItems, type, value, optionName, direction }) => {
	const duplicateStdioItems = otherStdioItems.filter((stdioItem) => hasSameValue(stdioItem, value));
	if (duplicateStdioItems.length === 0) return;
	throwOnDuplicateStream(duplicateStdioItems.find((stdioItem) => stdioItem.direction !== direction), optionName, type);
	return direction === "output" ? duplicateStdioItems[0].stream : void 0;
};
const hasSameValue = ({ type, value }, secondValue) => {
	if (type === "filePath") return value.file === secondValue.file;
	if (type === "fileUrl") return value.href === secondValue.href;
	return value === secondValue;
};
const validateDuplicateTransform = ({ otherStdioItems, type, value, optionName }) => {
	throwOnDuplicateStream(otherStdioItems.find(({ value: { transform } }) => transform === value.transform), optionName, type);
};
const throwOnDuplicateStream = (stdioItem, optionName, type) => {
	if (stdioItem !== void 0) throw new TypeError(`The \`${stdioItem.optionName}\` and \`${optionName}\` options must not target ${TYPE_TO_MESSAGE[type]} that is the same.`);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/handle.js
const handleStdio = (addProperties$2, options$1, verboseInfo, isSync) => {
	const fileDescriptors = getFinalFileDescriptors({
		initialFileDescriptors: normalizeStdioOption(options$1, verboseInfo, isSync).map((stdioOption, fdNumber) => getFileDescriptor({
			stdioOption,
			fdNumber,
			options: options$1,
			isSync
		})),
		addProperties: addProperties$2,
		options: options$1,
		isSync
	});
	options$1.stdio = fileDescriptors.map(({ stdioItems }) => forwardStdio(stdioItems));
	return fileDescriptors;
};
const getFileDescriptor = ({ stdioOption, fdNumber, options: options$1, isSync }) => {
	const optionName = getStreamName(fdNumber);
	const { stdioItems: initialStdioItems, isStdioArray } = initializeStdioItems({
		stdioOption,
		fdNumber,
		options: options$1,
		optionName
	});
	const direction = getStreamDirection(initialStdioItems, fdNumber, optionName);
	const normalizedStdioItems = normalizeTransforms(initialStdioItems.map((stdioItem) => handleNativeStream({
		stdioItem,
		isStdioArray,
		fdNumber,
		direction,
		isSync
	})), optionName, direction, options$1);
	const objectMode = getFdObjectMode(normalizedStdioItems, direction);
	validateFileObjectMode(normalizedStdioItems, objectMode);
	return {
		direction,
		objectMode,
		stdioItems: normalizedStdioItems
	};
};
const initializeStdioItems = ({ stdioOption, fdNumber, options: options$1, optionName }) => {
	const stdioItems = filterDuplicates([...(Array.isArray(stdioOption) ? stdioOption : [stdioOption]).map((value) => initializeStdioItem(value, optionName)), ...handleInputOptions(options$1, fdNumber)]);
	const isStdioArray = stdioItems.length > 1;
	validateStdioArray(stdioItems, isStdioArray, optionName);
	validateStreams(stdioItems);
	return {
		stdioItems,
		isStdioArray
	};
};
const initializeStdioItem = (value, optionName) => ({
	type: getStdioItemType(value, optionName),
	value,
	optionName
});
const validateStdioArray = (stdioItems, isStdioArray, optionName) => {
	if (stdioItems.length === 0) throw new TypeError(`The \`${optionName}\` option must not be an empty array.`);
	if (!isStdioArray) return;
	for (const { value, optionName: optionName$1 } of stdioItems) if (INVALID_STDIO_ARRAY_OPTIONS.has(value)) throw new Error(`The \`${optionName$1}\` option must not include \`${value}\`.`);
};
const INVALID_STDIO_ARRAY_OPTIONS = new Set(["ignore", "ipc"]);
const validateStreams = (stdioItems) => {
	for (const stdioItem of stdioItems) validateFileStdio(stdioItem);
};
const validateFileStdio = ({ type, value, optionName }) => {
	if (isRegularUrl(value)) throw new TypeError(`The \`${optionName}: URL\` option must use the \`file:\` scheme.
For example, you can use the \`pathToFileURL()\` method of the \`url\` core module.`);
	if (isUnknownStdioString(type, value)) throw new TypeError(`The \`${optionName}: { file: '...' }\` option must be used instead of \`${optionName}: '...'\`.`);
};
const validateFileObjectMode = (stdioItems, objectMode) => {
	if (!objectMode) return;
	const fileStdioItem = stdioItems.find(({ type }) => FILE_TYPES.has(type));
	if (fileStdioItem !== void 0) throw new TypeError(`The \`${fileStdioItem.optionName}\` option cannot use both files and transforms in objectMode.`);
};
const getFinalFileDescriptors = ({ initialFileDescriptors, addProperties: addProperties$2, options: options$1, isSync }) => {
	const fileDescriptors = [];
	try {
		for (const fileDescriptor of initialFileDescriptors) fileDescriptors.push(getFinalFileDescriptor({
			fileDescriptor,
			fileDescriptors,
			addProperties: addProperties$2,
			options: options$1,
			isSync
		}));
		return fileDescriptors;
	} catch (error) {
		cleanupCustomStreams(fileDescriptors);
		throw error;
	}
};
const getFinalFileDescriptor = ({ fileDescriptor: { direction, objectMode, stdioItems }, fileDescriptors, addProperties: addProperties$2, options: options$1, isSync }) => {
	return {
		direction,
		objectMode,
		stdioItems: stdioItems.map((stdioItem) => addStreamProperties({
			stdioItem,
			addProperties: addProperties$2,
			direction,
			options: options$1,
			fileDescriptors,
			isSync
		}))
	};
};
const addStreamProperties = ({ stdioItem, addProperties: addProperties$2, direction, options: options$1, fileDescriptors, isSync }) => {
	const duplicateStream = getDuplicateStream({
		stdioItem,
		direction,
		fileDescriptors,
		isSync
	});
	if (duplicateStream !== void 0) return {
		...stdioItem,
		stream: duplicateStream
	};
	return {
		...stdioItem,
		...addProperties$2[direction][stdioItem.type](stdioItem, options$1)
	};
};
const cleanupCustomStreams = (fileDescriptors) => {
	for (const { stdioItems } of fileDescriptors) for (const { stream } of stdioItems) if (stream !== void 0 && !isStandardStream(stream)) stream.destroy();
};
const forwardStdio = (stdioItems) => {
	if (stdioItems.length > 1) return stdioItems.some(({ value: value$1 }) => value$1 === "overlapped") ? "overlapped" : "pipe";
	const [{ type, value }] = stdioItems;
	return type === "native" ? value : "pipe";
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/handle-sync.js
const handleStdioSync = (options$1, verboseInfo) => handleStdio(addPropertiesSync, options$1, verboseInfo, true);
const forbiddenIfSync = ({ type, optionName }) => {
	throwInvalidSyncValue(optionName, TYPE_TO_MESSAGE[type]);
};
const forbiddenNativeIfSync = ({ optionName, value }) => {
	if (value === "ipc" || value === "overlapped") throwInvalidSyncValue(optionName, `"${value}"`);
	return {};
};
const throwInvalidSyncValue = (optionName, value) => {
	throw new TypeError(`The \`${optionName}\` option cannot be ${value} with synchronous methods.`);
};
const addProperties$1 = {
	generator() {},
	asyncGenerator: forbiddenIfSync,
	webStream: forbiddenIfSync,
	nodeStream: forbiddenIfSync,
	webTransform: forbiddenIfSync,
	duplex: forbiddenIfSync,
	asyncIterable: forbiddenIfSync,
	native: forbiddenNativeIfSync
};
const addPropertiesSync = {
	input: {
		...addProperties$1,
		fileUrl: ({ value }) => ({ contents: [bufferToUint8Array(readFileSync(value))] }),
		filePath: ({ value: { file } }) => ({ contents: [bufferToUint8Array(readFileSync(file))] }),
		fileNumber: forbiddenIfSync,
		iterable: ({ value }) => ({ contents: [...value] }),
		string: ({ value }) => ({ contents: [value] }),
		uint8Array: ({ value }) => ({ contents: [value] })
	},
	output: {
		...addProperties$1,
		fileUrl: ({ value }) => ({ path: value }),
		filePath: ({ value: { file, append } }) => ({
			path: file,
			append
		}),
		fileNumber: ({ value }) => ({ path: value }),
		iterable: forbiddenIfSync,
		string: forbiddenIfSync,
		uint8Array: forbiddenIfSync
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/strip-newline.js
const stripNewline = (value, { stripFinalNewline: stripFinalNewline$1 }, fdNumber) => getStripFinalNewline(stripFinalNewline$1, fdNumber) && value !== void 0 && !Array.isArray(value) ? stripFinalNewline(value) : value;
const getStripFinalNewline = (stripFinalNewline$1, fdNumber) => fdNumber === "all" ? stripFinalNewline$1[1] || stripFinalNewline$1[2] : stripFinalNewline$1[fdNumber];

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/split.js
const getSplitLinesGenerator = (binary, preserveNewlines, skipped, state) => binary || skipped ? void 0 : initializeSplitLines(preserveNewlines, state);
const splitLinesSync = (chunk, preserveNewlines, objectMode) => objectMode ? chunk.flatMap((item$2) => splitLinesItemSync(item$2, preserveNewlines)) : splitLinesItemSync(chunk, preserveNewlines);
const splitLinesItemSync = (chunk, preserveNewlines) => {
	const { transform, final } = initializeSplitLines(preserveNewlines, {});
	return [...transform(chunk), ...final()];
};
const initializeSplitLines = (preserveNewlines, state) => {
	state.previousChunks = "";
	return {
		transform: splitGenerator.bind(void 0, state, preserveNewlines),
		final: linesFinal.bind(void 0, state)
	};
};
const splitGenerator = function* (state, preserveNewlines, chunk) {
	if (typeof chunk !== "string") {
		yield chunk;
		return;
	}
	let { previousChunks } = state;
	let start = -1;
	for (let end = 0; end < chunk.length; end += 1) if (chunk[end] === "\n") {
		const newlineLength = getNewlineLength(chunk, end, preserveNewlines, state);
		let line = chunk.slice(start + 1, end + 1 - newlineLength);
		if (previousChunks.length > 0) {
			line = concatString(previousChunks, line);
			previousChunks = "";
		}
		yield line;
		start = end;
	}
	if (start !== chunk.length - 1) previousChunks = concatString(previousChunks, chunk.slice(start + 1));
	state.previousChunks = previousChunks;
};
const getNewlineLength = (chunk, end, preserveNewlines, state) => {
	if (preserveNewlines) return 0;
	state.isWindowsNewline = end !== 0 && chunk[end - 1] === "\r";
	return state.isWindowsNewline ? 2 : 1;
};
const linesFinal = function* ({ previousChunks }) {
	if (previousChunks.length > 0) yield previousChunks;
};
const getAppendNewlineGenerator = ({ binary, preserveNewlines, readableObjectMode, state }) => binary || preserveNewlines || readableObjectMode ? void 0 : { transform: appendNewlineGenerator.bind(void 0, state) };
const appendNewlineGenerator = function* ({ isWindowsNewline = false }, chunk) {
	const { unixNewline, windowsNewline, LF: LF$1, concatBytes } = typeof chunk === "string" ? linesStringInfo : linesUint8ArrayInfo;
	if (chunk.at(-1) === LF$1) {
		yield chunk;
		return;
	}
	yield concatBytes(chunk, isWindowsNewline ? windowsNewline : unixNewline);
};
const concatString = (firstChunk, secondChunk) => `${firstChunk}${secondChunk}`;
const linesStringInfo = {
	windowsNewline: "\r\n",
	unixNewline: "\n",
	LF: "\n",
	concatBytes: concatString
};
const concatUint8Array = (firstChunk, secondChunk) => {
	const chunk = new Uint8Array(firstChunk.length + secondChunk.length);
	chunk.set(firstChunk, 0);
	chunk.set(secondChunk, firstChunk.length);
	return chunk;
};
const linesUint8ArrayInfo = {
	windowsNewline: new Uint8Array([13, 10]),
	unixNewline: new Uint8Array([10]),
	LF: 10,
	concatBytes: concatUint8Array
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/validate.js
const getValidateTransformInput = (writableObjectMode, optionName) => writableObjectMode ? void 0 : validateStringTransformInput.bind(void 0, optionName);
const validateStringTransformInput = function* (optionName, chunk) {
	if (typeof chunk !== "string" && !isUint8Array(chunk) && !Buffer$1.isBuffer(chunk)) throw new TypeError(`The \`${optionName}\` option's transform must use "objectMode: true" to receive as input: ${typeof chunk}.`);
	yield chunk;
};
const getValidateTransformReturn = (readableObjectMode, optionName) => readableObjectMode ? validateObjectTransformReturn.bind(void 0, optionName) : validateStringTransformReturn.bind(void 0, optionName);
const validateObjectTransformReturn = function* (optionName, chunk) {
	validateEmptyReturn(optionName, chunk);
	yield chunk;
};
const validateStringTransformReturn = function* (optionName, chunk) {
	validateEmptyReturn(optionName, chunk);
	if (typeof chunk !== "string" && !isUint8Array(chunk)) throw new TypeError(`The \`${optionName}\` option's function must yield a string or an Uint8Array, not ${typeof chunk}.`);
	yield chunk;
};
const validateEmptyReturn = (optionName, chunk) => {
	if (chunk === null || chunk === void 0) throw new TypeError(`The \`${optionName}\` option's function must not call \`yield ${chunk}\`.
Instead, \`yield\` should either be called with a value, or not be called at all. For example:
  if (condition) { yield value; }`);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/encoding-transform.js
const getEncodingTransformGenerator = (binary, encoding, skipped) => {
	if (skipped) return;
	if (binary) return { transform: encodingUint8ArrayGenerator.bind(void 0, new TextEncoder()) };
	const stringDecoder = new StringDecoder(encoding);
	return {
		transform: encodingStringGenerator.bind(void 0, stringDecoder),
		final: encodingStringFinal.bind(void 0, stringDecoder)
	};
};
const encodingUint8ArrayGenerator = function* (textEncoder$2, chunk) {
	if (Buffer$1.isBuffer(chunk)) yield bufferToUint8Array(chunk);
	else if (typeof chunk === "string") yield textEncoder$2.encode(chunk);
	else yield chunk;
};
const encodingStringGenerator = function* (stringDecoder, chunk) {
	yield isUint8Array(chunk) ? stringDecoder.write(chunk) : chunk;
};
const encodingStringFinal = function* (stringDecoder) {
	const lastChunk = stringDecoder.end();
	if (lastChunk !== "") yield lastChunk;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/run-async.js
const pushChunks = callbackify(async (getChunks, state, getChunksArguments, transformStream) => {
	state.currentIterable = getChunks(...getChunksArguments);
	try {
		for await (const chunk of state.currentIterable) transformStream.push(chunk);
	} finally {
		delete state.currentIterable;
	}
});
const transformChunk = async function* (chunk, generators, index) {
	if (index === generators.length) {
		yield chunk;
		return;
	}
	const { transform = identityGenerator$1 } = generators[index];
	for await (const transformedChunk of transform(chunk)) yield* transformChunk(transformedChunk, generators, index + 1);
};
const finalChunks = async function* (generators) {
	for (const [index, { final }] of Object.entries(generators)) yield* generatorFinalChunks(final, Number(index), generators);
};
const generatorFinalChunks = async function* (final, index, generators) {
	if (final === void 0) return;
	for await (const finalChunk of final()) yield* transformChunk(finalChunk, generators, index + 1);
};
const destroyTransform = callbackify(async ({ currentIterable }, error) => {
	if (currentIterable !== void 0) {
		await (error ? currentIterable.throw(error) : currentIterable.return());
		return;
	}
	if (error) throw error;
});
const identityGenerator$1 = function* (chunk) {
	yield chunk;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/run-sync.js
const pushChunksSync = (getChunksSync, getChunksArguments, transformStream, done) => {
	try {
		for (const chunk of getChunksSync(...getChunksArguments)) transformStream.push(chunk);
		done();
	} catch (error) {
		done(error);
	}
};
const runTransformSync = (generators, chunks) => [...chunks.flatMap((chunk) => [...transformChunkSync(chunk, generators, 0)]), ...finalChunksSync(generators)];
const transformChunkSync = function* (chunk, generators, index) {
	if (index === generators.length) {
		yield chunk;
		return;
	}
	const { transform = identityGenerator } = generators[index];
	for (const transformedChunk of transform(chunk)) yield* transformChunkSync(transformedChunk, generators, index + 1);
};
const finalChunksSync = function* (generators) {
	for (const [index, { final }] of Object.entries(generators)) yield* generatorFinalChunksSync(final, Number(index), generators);
};
const generatorFinalChunksSync = function* (final, index, generators) {
	if (final === void 0) return;
	for (const finalChunk of final()) yield* transformChunkSync(finalChunk, generators, index + 1);
};
const identityGenerator = function* (chunk) {
	yield chunk;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/transform/generator.js
const generatorToStream = ({ value, value: { transform, final, writableObjectMode, readableObjectMode }, optionName }, { encoding }) => {
	const state = {};
	const generators = addInternalGenerators(value, encoding, optionName);
	const transformAsync = isAsyncGenerator(transform);
	const finalAsync = isAsyncGenerator(final);
	const transformMethod = transformAsync ? pushChunks.bind(void 0, transformChunk, state) : pushChunksSync.bind(void 0, transformChunkSync);
	const finalMethod = transformAsync || finalAsync ? pushChunks.bind(void 0, finalChunks, state) : pushChunksSync.bind(void 0, finalChunksSync);
	const destroyMethod = transformAsync || finalAsync ? destroyTransform.bind(void 0, state) : void 0;
	return { stream: new Transform({
		writableObjectMode,
		writableHighWaterMark: getDefaultHighWaterMark(writableObjectMode),
		readableObjectMode,
		readableHighWaterMark: getDefaultHighWaterMark(readableObjectMode),
		transform(chunk, encoding$1, done) {
			transformMethod([
				chunk,
				generators,
				0
			], this, done);
		},
		flush(done) {
			finalMethod([generators], this, done);
		},
		destroy: destroyMethod
	}) };
};
const runGeneratorsSync = (chunks, stdioItems, encoding, isInput) => {
	const generators = stdioItems.filter(({ type }) => type === "generator");
	const reversedGenerators = isInput ? generators.reverse() : generators;
	for (const { value, optionName } of reversedGenerators) chunks = runTransformSync(addInternalGenerators(value, encoding, optionName), chunks);
	return chunks;
};
const addInternalGenerators = ({ transform, final, binary, writableObjectMode, readableObjectMode, preserveNewlines }, encoding, optionName) => {
	const state = {};
	return [
		{ transform: getValidateTransformInput(writableObjectMode, optionName) },
		getEncodingTransformGenerator(binary, encoding, writableObjectMode),
		getSplitLinesGenerator(binary, preserveNewlines, writableObjectMode, state),
		{
			transform,
			final
		},
		{ transform: getValidateTransformReturn(readableObjectMode, optionName) },
		getAppendNewlineGenerator({
			binary,
			preserveNewlines,
			readableObjectMode,
			state
		})
	].filter(Boolean);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/input-sync.js
const addInputOptionsSync = (fileDescriptors, options$1) => {
	for (const fdNumber of getInputFdNumbers(fileDescriptors)) addInputOptionSync(fileDescriptors, fdNumber, options$1);
};
const getInputFdNumbers = (fileDescriptors) => new Set(Object.entries(fileDescriptors).filter(([, { direction }]) => direction === "input").map(([fdNumber]) => Number(fdNumber)));
const addInputOptionSync = (fileDescriptors, fdNumber, options$1) => {
	const { stdioItems } = fileDescriptors[fdNumber];
	const allStdioItems = stdioItems.filter(({ contents }) => contents !== void 0);
	if (allStdioItems.length === 0) return;
	if (fdNumber !== 0) {
		const [{ type, optionName }] = allStdioItems;
		throw new TypeError(`Only the \`stdin\` option, not \`${optionName}\`, can be ${TYPE_TO_MESSAGE[type]} with synchronous methods.`);
	}
	options$1.input = joinToUint8Array(allStdioItems.map(({ contents }) => contents).map((contents) => applySingleInputGeneratorsSync(contents, stdioItems)));
};
const applySingleInputGeneratorsSync = (contents, stdioItems) => {
	const newContents = runGeneratorsSync(contents, stdioItems, "utf8", true);
	validateSerializable(newContents);
	return joinToUint8Array(newContents);
};
const validateSerializable = (newContents) => {
	const invalidItem = newContents.find((item$2) => typeof item$2 !== "string" && !isUint8Array(item$2));
	if (invalidItem !== void 0) throw new TypeError(`The \`stdin\` option is invalid: when passing objects as input, a transform must be used to serialize them to strings or Uint8Arrays: ${invalidItem}.`);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/output.js
const shouldLogOutput = ({ stdioItems, encoding, verboseInfo, fdNumber }) => fdNumber !== "all" && isFullVerbose(verboseInfo, fdNumber) && !BINARY_ENCODINGS.has(encoding) && fdUsesVerbose(fdNumber) && (stdioItems.some(({ type, value }) => type === "native" && PIPED_STDIO_VALUES.has(value)) || stdioItems.every(({ type }) => TRANSFORM_TYPES.has(type)));
const fdUsesVerbose = (fdNumber) => fdNumber === 1 || fdNumber === 2;
const PIPED_STDIO_VALUES = new Set(["pipe", "overlapped"]);
const logLines = async (linesIterable, stream, fdNumber, verboseInfo) => {
	for await (const line of linesIterable) if (!isPipingStream(stream)) logLine(line, fdNumber, verboseInfo);
};
const logLinesSync = (linesArray, fdNumber, verboseInfo) => {
	for (const line of linesArray) logLine(line, fdNumber, verboseInfo);
};
const isPipingStream = (stream) => stream._readableState.pipes.length > 0;
const logLine = (line, fdNumber, verboseInfo) => {
	verboseLog({
		type: "output",
		verboseMessage: serializeVerboseMessage(line),
		fdNumber,
		verboseInfo
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/output-sync.js
const transformOutputSync = ({ fileDescriptors, syncResult: { output }, options: options$1, isMaxBuffer, verboseInfo }) => {
	if (output === null) return { output: Array.from({ length: 3 }) };
	const state = {};
	const outputFiles = /* @__PURE__ */ new Set([]);
	return {
		output: output.map((result, fdNumber) => transformOutputResultSync({
			result,
			fileDescriptors,
			fdNumber,
			state,
			outputFiles,
			isMaxBuffer,
			verboseInfo
		}, options$1)),
		...state
	};
};
const transformOutputResultSync = ({ result, fileDescriptors, fdNumber, state, outputFiles, isMaxBuffer, verboseInfo }, { buffer, encoding, lines: lines$4, stripFinalNewline: stripFinalNewline$1, maxBuffer }) => {
	if (result === null) return;
	const uint8ArrayResult = bufferToUint8Array(truncateMaxBufferSync(result, isMaxBuffer, maxBuffer));
	const { stdioItems, objectMode } = fileDescriptors[fdNumber];
	const { serializedResult, finalResult = serializedResult } = serializeChunks({
		chunks: runOutputGeneratorsSync([uint8ArrayResult], stdioItems, encoding, state),
		objectMode,
		encoding,
		lines: lines$4,
		stripFinalNewline: stripFinalNewline$1,
		fdNumber
	});
	logOutputSync({
		serializedResult,
		fdNumber,
		state,
		verboseInfo,
		encoding,
		stdioItems,
		objectMode
	});
	const returnedResult = buffer[fdNumber] ? finalResult : void 0;
	try {
		if (state.error === void 0) writeToFiles(serializedResult, stdioItems, outputFiles);
		return returnedResult;
	} catch (error) {
		state.error = error;
		return returnedResult;
	}
};
const runOutputGeneratorsSync = (chunks, stdioItems, encoding, state) => {
	try {
		return runGeneratorsSync(chunks, stdioItems, encoding, false);
	} catch (error) {
		state.error = error;
		return chunks;
	}
};
const serializeChunks = ({ chunks, objectMode, encoding, lines: lines$4, stripFinalNewline: stripFinalNewline$1, fdNumber }) => {
	if (objectMode) return { serializedResult: chunks };
	if (encoding === "buffer") return { serializedResult: joinToUint8Array(chunks) };
	const serializedResult = joinToString(chunks, encoding);
	if (lines$4[fdNumber]) return {
		serializedResult,
		finalResult: splitLinesSync(serializedResult, !stripFinalNewline$1[fdNumber], objectMode)
	};
	return { serializedResult };
};
const logOutputSync = ({ serializedResult, fdNumber, state, verboseInfo, encoding, stdioItems, objectMode }) => {
	if (!shouldLogOutput({
		stdioItems,
		encoding,
		verboseInfo,
		fdNumber
	})) return;
	const linesArray = splitLinesSync(serializedResult, false, objectMode);
	try {
		logLinesSync(linesArray, fdNumber, verboseInfo);
	} catch (error) {
		state.error ??= error;
	}
};
const writeToFiles = (serializedResult, stdioItems, outputFiles) => {
	for (const { path: path$4, append } of stdioItems.filter(({ type }) => FILE_TYPES.has(type))) {
		const pathString = typeof path$4 === "string" ? path$4 : path$4.toString();
		if (append || outputFiles.has(pathString)) appendFileSync(path$4, serializedResult);
		else {
			outputFiles.add(pathString);
			writeFileSync(path$4, serializedResult);
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/all-sync.js
const getAllSync = ([, stdout, stderr], options$1) => {
	if (!options$1.all) return;
	if (stdout === void 0) return stderr;
	if (stderr === void 0) return stdout;
	if (Array.isArray(stdout)) return Array.isArray(stderr) ? [...stdout, ...stderr] : [...stdout, stripNewline(stderr, options$1, "all")];
	if (Array.isArray(stderr)) return [stripNewline(stdout, options$1, "all"), ...stderr];
	if (isUint8Array(stdout) && isUint8Array(stderr)) return concatUint8Arrays([stdout, stderr]);
	return `${stdout}${stderr}`;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/exit-async.js
const waitForExit = async (subprocess, context) => {
	const [exitCode, signal] = await waitForExitOrError(subprocess);
	context.isForcefullyTerminated ??= false;
	return [exitCode, signal];
};
const waitForExitOrError = async (subprocess) => {
	const [spawnPayload, exitPayload] = await Promise.allSettled([once(subprocess, "spawn"), once(subprocess, "exit")]);
	if (spawnPayload.status === "rejected") return [];
	return exitPayload.status === "rejected" ? waitForSubprocessExit(subprocess) : exitPayload.value;
};
const waitForSubprocessExit = async (subprocess) => {
	try {
		return await once(subprocess, "exit");
	} catch {
		return waitForSubprocessExit(subprocess);
	}
};
const waitForSuccessfulExit = async (exitPromise) => {
	const [exitCode, signal] = await exitPromise;
	if (!isSubprocessErrorExit(exitCode, signal) && isFailedExit(exitCode, signal)) throw new DiscardedError();
	return [exitCode, signal];
};
const isSubprocessErrorExit = (exitCode, signal) => exitCode === void 0 && signal === void 0;
const isFailedExit = (exitCode, signal) => exitCode !== 0 || signal !== null;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/exit-sync.js
const getExitResultSync = ({ error, status: exitCode, signal, output }, { maxBuffer }) => {
	const resultError = getResultError(error, exitCode, signal);
	return {
		resultError,
		exitCode,
		signal,
		timedOut: resultError?.code === "ETIMEDOUT",
		isMaxBuffer: isMaxBufferSync(resultError, output, maxBuffer)
	};
};
const getResultError = (error, exitCode, signal) => {
	if (error !== void 0) return error;
	return isFailedExit(exitCode, signal) ? new DiscardedError() : void 0;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/main-sync.js
const execaCoreSync = (rawFile, rawArguments, rawOptions) => {
	const { file, commandArguments, command, escapedCommand, startTime, verboseInfo, options: options$1, fileDescriptors } = handleSyncArguments(rawFile, rawArguments, rawOptions);
	return handleResult(spawnSubprocessSync({
		file,
		commandArguments,
		options: options$1,
		command,
		escapedCommand,
		verboseInfo,
		fileDescriptors,
		startTime
	}), verboseInfo, options$1);
};
const handleSyncArguments = (rawFile, rawArguments, rawOptions) => {
	const { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions);
	const { file, commandArguments, options: options$1 } = normalizeOptions(rawFile, rawArguments, normalizeSyncOptions(rawOptions));
	validateSyncOptions(options$1);
	return {
		file,
		commandArguments,
		command,
		escapedCommand,
		startTime,
		verboseInfo,
		options: options$1,
		fileDescriptors: handleStdioSync(options$1, verboseInfo)
	};
};
const normalizeSyncOptions = (options$1) => options$1.node && !options$1.ipc ? {
	...options$1,
	ipc: false
} : options$1;
const validateSyncOptions = ({ ipc, ipcInput, detached, cancelSignal }) => {
	if (ipcInput) throwInvalidSyncOption("ipcInput");
	if (ipc) throwInvalidSyncOption("ipc: true");
	if (detached) throwInvalidSyncOption("detached: true");
	if (cancelSignal) throwInvalidSyncOption("cancelSignal");
};
const throwInvalidSyncOption = (value) => {
	throw new TypeError(`The "${value}" option cannot be used with synchronous methods.`);
};
const spawnSubprocessSync = ({ file, commandArguments, options: options$1, command, escapedCommand, verboseInfo, fileDescriptors, startTime }) => {
	const syncResult = runSubprocessSync({
		file,
		commandArguments,
		options: options$1,
		command,
		escapedCommand,
		fileDescriptors,
		startTime
	});
	if (syncResult.failed) return syncResult;
	const { resultError, exitCode, signal, timedOut, isMaxBuffer } = getExitResultSync(syncResult, options$1);
	const { output, error = resultError } = transformOutputSync({
		fileDescriptors,
		syncResult,
		options: options$1,
		isMaxBuffer,
		verboseInfo
	});
	return getSyncResult({
		error,
		exitCode,
		signal,
		timedOut,
		isMaxBuffer,
		stdio: output.map((stdioOutput, fdNumber) => stripNewline(stdioOutput, options$1, fdNumber)),
		all: stripNewline(getAllSync(output, options$1), options$1, "all"),
		options: options$1,
		command,
		escapedCommand,
		startTime
	});
};
const runSubprocessSync = ({ file, commandArguments, options: options$1, command, escapedCommand, fileDescriptors, startTime }) => {
	try {
		addInputOptionsSync(fileDescriptors, options$1);
		return spawnSync(...concatenateShell(file, commandArguments, normalizeSpawnSyncOptions(options$1)));
	} catch (error) {
		return makeEarlyError({
			error,
			command,
			escapedCommand,
			fileDescriptors,
			options: options$1,
			startTime,
			isSync: true
		});
	}
};
const normalizeSpawnSyncOptions = ({ encoding, maxBuffer,...options$1 }) => ({
	...options$1,
	encoding: "buffer",
	maxBuffer: getMaxBufferSync(maxBuffer)
});
const getSyncResult = ({ error, exitCode, signal, timedOut, isMaxBuffer, stdio, all, options: options$1, command, escapedCommand, startTime }) => error === void 0 ? makeSuccessResult({
	command,
	escapedCommand,
	stdio,
	all,
	ipcOutput: [],
	options: options$1,
	startTime
}) : makeError({
	error,
	command,
	escapedCommand,
	timedOut,
	isCanceled: false,
	isGracefullyCanceled: false,
	isMaxBuffer,
	isForcefullyTerminated: false,
	exitCode,
	signal,
	stdio,
	all,
	ipcOutput: [],
	options: options$1,
	startTime,
	isSync: true
});

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/get-one.js
const getOneMessage$1 = ({ anyProcess, channel, isSubprocess, ipc }, { reference = true, filter } = {}) => {
	validateIpcMethod({
		methodName: "getOneMessage",
		isSubprocess,
		ipc,
		isConnected: isConnected(anyProcess)
	});
	return getOneMessageAsync({
		anyProcess,
		channel,
		isSubprocess,
		filter,
		reference
	});
};
const getOneMessageAsync = async ({ anyProcess, channel, isSubprocess, filter, reference }) => {
	addReference(channel, reference);
	const ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess);
	const controller = new AbortController();
	try {
		return await Promise.race([
			getMessage(ipcEmitter, filter, controller),
			throwOnDisconnect(ipcEmitter, isSubprocess, controller),
			throwOnStrictError(ipcEmitter, isSubprocess, controller)
		]);
	} catch (error) {
		disconnect(anyProcess);
		throw error;
	} finally {
		controller.abort();
		removeReference(channel, reference);
	}
};
const getMessage = async (ipcEmitter, filter, { signal }) => {
	if (filter === void 0) {
		const [message] = await once(ipcEmitter, "message", { signal });
		return message;
	}
	for await (const [message] of on(ipcEmitter, "message", { signal })) if (filter(message)) return message;
};
const throwOnDisconnect = async (ipcEmitter, isSubprocess, { signal }) => {
	await once(ipcEmitter, "disconnect", { signal });
	throwOnEarlyDisconnect(isSubprocess);
};
const throwOnStrictError = async (ipcEmitter, isSubprocess, { signal }) => {
	const [error] = await once(ipcEmitter, "strict:error", { signal });
	throw getStrictResponseError(error, isSubprocess);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/get-each.js
const getEachMessage$1 = ({ anyProcess, channel, isSubprocess, ipc }, { reference = true } = {}) => loopOnMessages({
	anyProcess,
	channel,
	isSubprocess,
	ipc,
	shouldAwait: !isSubprocess,
	reference
});
const loopOnMessages = ({ anyProcess, channel, isSubprocess, ipc, shouldAwait, reference }) => {
	validateIpcMethod({
		methodName: "getEachMessage",
		isSubprocess,
		ipc,
		isConnected: isConnected(anyProcess)
	});
	addReference(channel, reference);
	const ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess);
	const controller = new AbortController();
	const state = {};
	stopOnDisconnect(anyProcess, ipcEmitter, controller);
	abortOnStrictError({
		ipcEmitter,
		isSubprocess,
		controller,
		state
	});
	return iterateOnMessages({
		anyProcess,
		channel,
		ipcEmitter,
		isSubprocess,
		shouldAwait,
		controller,
		state,
		reference
	});
};
const stopOnDisconnect = async (anyProcess, ipcEmitter, controller) => {
	try {
		await once(ipcEmitter, "disconnect", { signal: controller.signal });
		controller.abort();
	} catch {}
};
const abortOnStrictError = async ({ ipcEmitter, isSubprocess, controller, state }) => {
	try {
		const [error] = await once(ipcEmitter, "strict:error", { signal: controller.signal });
		state.error = getStrictResponseError(error, isSubprocess);
		controller.abort();
	} catch {}
};
const iterateOnMessages = async function* ({ anyProcess, channel, ipcEmitter, isSubprocess, shouldAwait, controller, state, reference }) {
	try {
		for await (const [message] of on(ipcEmitter, "message", { signal: controller.signal })) {
			throwIfStrictError(state);
			yield message;
		}
	} catch {
		throwIfStrictError(state);
	} finally {
		controller.abort();
		removeReference(channel, reference);
		if (!isSubprocess) disconnect(anyProcess);
		if (shouldAwait) await anyProcess;
	}
};
const throwIfStrictError = ({ error }) => {
	if (error) throw error;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/methods.js
const addIpcMethods = (subprocess, { ipc }) => {
	Object.assign(subprocess, getIpcMethods(subprocess, false, ipc));
};
const getIpcExport = () => {
	const anyProcess = process$1;
	const isSubprocess = true;
	const ipc = process$1.channel !== void 0;
	return {
		...getIpcMethods(anyProcess, isSubprocess, ipc),
		getCancelSignal: getCancelSignal$1.bind(void 0, {
			anyProcess,
			channel: anyProcess.channel,
			isSubprocess,
			ipc
		})
	};
};
const getIpcMethods = (anyProcess, isSubprocess, ipc) => ({
	sendMessage: sendMessage$1.bind(void 0, {
		anyProcess,
		channel: anyProcess.channel,
		isSubprocess,
		ipc
	}),
	getOneMessage: getOneMessage$1.bind(void 0, {
		anyProcess,
		channel: anyProcess.channel,
		isSubprocess,
		ipc
	}),
	getEachMessage: getEachMessage$1.bind(void 0, {
		anyProcess,
		channel: anyProcess.channel,
		isSubprocess,
		ipc
	})
});

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/return/early-error.js
const handleEarlyError = ({ error, command, escapedCommand, fileDescriptors, options: options$1, startTime, verboseInfo }) => {
	cleanupCustomStreams(fileDescriptors);
	const subprocess = new ChildProcess();
	createDummyStreams(subprocess, fileDescriptors);
	Object.assign(subprocess, {
		readable,
		writable,
		duplex
	});
	return {
		subprocess,
		promise: handleDummyPromise(makeEarlyError({
			error,
			command,
			escapedCommand,
			fileDescriptors,
			options: options$1,
			startTime,
			isSync: false
		}), verboseInfo, options$1)
	};
};
const createDummyStreams = (subprocess, fileDescriptors) => {
	const stdin = createDummyStream();
	const stdout = createDummyStream();
	const stderr = createDummyStream();
	const extraStdio = Array.from({ length: fileDescriptors.length - 3 }, createDummyStream);
	const all = createDummyStream();
	const stdio = [
		stdin,
		stdout,
		stderr,
		...extraStdio
	];
	Object.assign(subprocess, {
		stdin,
		stdout,
		stderr,
		all,
		stdio
	});
};
const createDummyStream = () => {
	const stream = new PassThrough();
	stream.end();
	return stream;
};
const readable = () => new Readable({ read() {} });
const writable = () => new Writable({ write() {} });
const duplex = () => new Duplex({
	read() {},
	write() {}
});
const handleDummyPromise = async (error, verboseInfo, options$1) => handleResult(error, verboseInfo, options$1);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/stdio/handle-async.js
const handleStdioAsync = (options$1, verboseInfo) => handleStdio(addPropertiesAsync, options$1, verboseInfo, false);
const forbiddenIfAsync = ({ type, optionName }) => {
	throw new TypeError(`The \`${optionName}\` option cannot be ${TYPE_TO_MESSAGE[type]}.`);
};
const addProperties = {
	fileNumber: forbiddenIfAsync,
	generator: generatorToStream,
	asyncGenerator: generatorToStream,
	nodeStream: ({ value }) => ({ stream: value }),
	webTransform({ value: { transform, writableObjectMode, readableObjectMode } }) {
		const objectMode = writableObjectMode || readableObjectMode;
		return { stream: Duplex.fromWeb(transform, { objectMode }) };
	},
	duplex: ({ value: { transform } }) => ({ stream: transform }),
	native() {}
};
const addPropertiesAsync = {
	input: {
		...addProperties,
		fileUrl: ({ value }) => ({ stream: createReadStream(value) }),
		filePath: ({ value: { file } }) => ({ stream: createReadStream(file) }),
		webStream: ({ value }) => ({ stream: Readable.fromWeb(value) }),
		iterable: ({ value }) => ({ stream: Readable.from(value) }),
		asyncIterable: ({ value }) => ({ stream: Readable.from(value) }),
		string: ({ value }) => ({ stream: Readable.from(value) }),
		uint8Array: ({ value }) => ({ stream: Readable.from(Buffer$1.from(value)) })
	},
	output: {
		...addProperties,
		fileUrl: ({ value }) => ({ stream: createWriteStream(value) }),
		filePath: ({ value: { file, append } }) => ({ stream: createWriteStream(file, append ? { flags: "a" } : {}) }),
		webStream: ({ value }) => ({ stream: Writable.fromWeb(value) }),
		iterable: forbiddenIfAsync,
		asyncIterable: forbiddenIfAsync,
		string: forbiddenIfAsync,
		uint8Array: forbiddenIfAsync
	}
};

//#endregion
//#region ../../node_modules/.pnpm/@sindresorhus+merge-streams@4.0.0/node_modules/@sindresorhus/merge-streams/index.js
function mergeStreams(streams) {
	if (!Array.isArray(streams)) throw new TypeError(`Expected an array, got \`${typeof streams}\`.`);
	for (const stream of streams) validateStream(stream);
	const objectMode = streams.some(({ readableObjectMode }) => readableObjectMode);
	const highWaterMark = getHighWaterMark(streams, objectMode);
	const passThroughStream = new MergedStream({
		objectMode,
		writableHighWaterMark: highWaterMark,
		readableHighWaterMark: highWaterMark
	});
	for (const stream of streams) passThroughStream.add(stream);
	return passThroughStream;
}
const getHighWaterMark = (streams, objectMode) => {
	if (streams.length === 0) return getDefaultHighWaterMark(objectMode);
	const highWaterMarks = streams.filter(({ readableObjectMode }) => readableObjectMode === objectMode).map(({ readableHighWaterMark }) => readableHighWaterMark);
	return Math.max(...highWaterMarks);
};
var MergedStream = class extends PassThrough {
	#streams = /* @__PURE__ */ new Set([]);
	#ended = /* @__PURE__ */ new Set([]);
	#aborted = /* @__PURE__ */ new Set([]);
	#onFinished;
	#unpipeEvent = Symbol("unpipe");
	#streamPromises = /* @__PURE__ */ new WeakMap();
	add(stream) {
		validateStream(stream);
		if (this.#streams.has(stream)) return;
		this.#streams.add(stream);
		this.#onFinished ??= onMergedStreamFinished(this, this.#streams, this.#unpipeEvent);
		const streamPromise = endWhenStreamsDone({
			passThroughStream: this,
			stream,
			streams: this.#streams,
			ended: this.#ended,
			aborted: this.#aborted,
			onFinished: this.#onFinished,
			unpipeEvent: this.#unpipeEvent
		});
		this.#streamPromises.set(stream, streamPromise);
		stream.pipe(this, { end: false });
	}
	async remove(stream) {
		validateStream(stream);
		if (!this.#streams.has(stream)) return false;
		const streamPromise = this.#streamPromises.get(stream);
		if (streamPromise === void 0) return false;
		this.#streamPromises.delete(stream);
		stream.unpipe(this);
		await streamPromise;
		return true;
	}
};
const onMergedStreamFinished = async (passThroughStream, streams, unpipeEvent) => {
	updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_COUNT);
	const controller = new AbortController();
	try {
		await Promise.race([onMergedStreamEnd(passThroughStream, controller), onInputStreamsUnpipe(passThroughStream, streams, unpipeEvent, controller)]);
	} finally {
		controller.abort();
		updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_COUNT);
	}
};
const onMergedStreamEnd = async (passThroughStream, { signal }) => {
	try {
		await finished(passThroughStream, {
			signal,
			cleanup: true
		});
	} catch (error) {
		errorOrAbortStream(passThroughStream, error);
		throw error;
	}
};
const onInputStreamsUnpipe = async (passThroughStream, streams, unpipeEvent, { signal }) => {
	for await (const [unpipedStream] of on(passThroughStream, "unpipe", { signal })) if (streams.has(unpipedStream)) unpipedStream.emit(unpipeEvent);
};
const validateStream = (stream) => {
	if (typeof stream?.pipe !== "function") throw new TypeError(`Expected a readable stream, got: \`${typeof stream}\`.`);
};
const endWhenStreamsDone = async ({ passThroughStream, stream, streams, ended, aborted: aborted$1, onFinished, unpipeEvent }) => {
	updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_PER_STREAM);
	const controller = new AbortController();
	try {
		await Promise.race([
			afterMergedStreamFinished(onFinished, stream, controller),
			onInputStreamEnd({
				passThroughStream,
				stream,
				streams,
				ended,
				aborted: aborted$1,
				controller
			}),
			onInputStreamUnpipe({
				stream,
				streams,
				ended,
				aborted: aborted$1,
				unpipeEvent,
				controller
			})
		]);
	} finally {
		controller.abort();
		updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_PER_STREAM);
	}
	if (streams.size > 0 && streams.size === ended.size + aborted$1.size) if (ended.size === 0 && aborted$1.size > 0) abortStream(passThroughStream);
	else endStream(passThroughStream);
};
const afterMergedStreamFinished = async (onFinished, stream, { signal }) => {
	try {
		await onFinished;
		if (!signal.aborted) abortStream(stream);
	} catch (error) {
		if (!signal.aborted) errorOrAbortStream(stream, error);
	}
};
const onInputStreamEnd = async ({ passThroughStream, stream, streams, ended, aborted: aborted$1, controller: { signal } }) => {
	try {
		await finished(stream, {
			signal,
			cleanup: true,
			readable: true,
			writable: false
		});
		if (streams.has(stream)) ended.add(stream);
	} catch (error) {
		if (signal.aborted || !streams.has(stream)) return;
		if (isAbortError(error)) aborted$1.add(stream);
		else errorStream(passThroughStream, error);
	}
};
const onInputStreamUnpipe = async ({ stream, streams, ended, aborted: aborted$1, unpipeEvent, controller: { signal } }) => {
	await once(stream, unpipeEvent, { signal });
	if (!stream.readable) return once(signal, "abort", { signal });
	streams.delete(stream);
	ended.delete(stream);
	aborted$1.delete(stream);
};
const endStream = (stream) => {
	if (stream.writable) stream.end();
};
const errorOrAbortStream = (stream, error) => {
	if (isAbortError(error)) abortStream(stream);
	else errorStream(stream, error);
};
const isAbortError = (error) => error?.code === "ERR_STREAM_PREMATURE_CLOSE";
const abortStream = (stream) => {
	if (stream.readable || stream.writable) stream.destroy();
};
const errorStream = (stream, error) => {
	if (!stream.destroyed) {
		stream.once("error", noop$4);
		stream.destroy(error);
	}
};
const noop$4 = () => {};
const updateMaxListeners = (passThroughStream, increment$1) => {
	const maxListeners = passThroughStream.getMaxListeners();
	if (maxListeners !== 0 && maxListeners !== Number.POSITIVE_INFINITY) passThroughStream.setMaxListeners(maxListeners + increment$1);
};
const PASSTHROUGH_LISTENERS_COUNT = 2;
const PASSTHROUGH_LISTENERS_PER_STREAM = 1;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/pipeline.js
const pipeStreams = (source, destination) => {
	source.pipe(destination);
	onSourceFinish(source, destination);
	onDestinationFinish(source, destination);
};
const onSourceFinish = async (source, destination) => {
	if (isStandardStream(source) || isStandardStream(destination)) return;
	try {
		await finished(source, {
			cleanup: true,
			readable: true,
			writable: false
		});
	} catch {}
	endDestinationStream(destination);
};
const endDestinationStream = (destination) => {
	if (destination.writable) destination.end();
};
const onDestinationFinish = async (source, destination) => {
	if (isStandardStream(source) || isStandardStream(destination)) return;
	try {
		await finished(destination, {
			cleanup: true,
			readable: false,
			writable: true
		});
	} catch {}
	abortSourceStream(source);
};
const abortSourceStream = (source) => {
	if (source.readable) source.destroy();
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/output-async.js
const pipeOutputAsync = (subprocess, fileDescriptors, controller) => {
	const pipeGroups = /* @__PURE__ */ new Map();
	for (const [fdNumber, { stdioItems, direction }] of Object.entries(fileDescriptors)) {
		for (const { stream } of stdioItems.filter(({ type }) => TRANSFORM_TYPES.has(type))) pipeTransform(subprocess, stream, direction, fdNumber);
		for (const { stream } of stdioItems.filter(({ type }) => !TRANSFORM_TYPES.has(type))) pipeStdioItem({
			subprocess,
			stream,
			direction,
			fdNumber,
			pipeGroups,
			controller
		});
	}
	for (const [outputStream, inputStreams] of pipeGroups.entries()) pipeStreams(inputStreams.length === 1 ? inputStreams[0] : mergeStreams(inputStreams), outputStream);
};
const pipeTransform = (subprocess, stream, direction, fdNumber) => {
	if (direction === "output") pipeStreams(subprocess.stdio[fdNumber], stream);
	else pipeStreams(stream, subprocess.stdio[fdNumber]);
	const streamProperty = SUBPROCESS_STREAM_PROPERTIES[fdNumber];
	if (streamProperty !== void 0) subprocess[streamProperty] = stream;
	subprocess.stdio[fdNumber] = stream;
};
const SUBPROCESS_STREAM_PROPERTIES = [
	"stdin",
	"stdout",
	"stderr"
];
const pipeStdioItem = ({ subprocess, stream, direction, fdNumber, pipeGroups, controller }) => {
	if (stream === void 0) return;
	setStandardStreamMaxListeners(stream, controller);
	const [inputStream, outputStream] = direction === "output" ? [stream, subprocess.stdio[fdNumber]] : [subprocess.stdio[fdNumber], stream];
	const outputStreams = pipeGroups.get(inputStream) ?? [];
	pipeGroups.set(inputStream, [...outputStreams, outputStream]);
};
const setStandardStreamMaxListeners = (stream, { signal }) => {
	if (isStandardStream(stream)) incrementMaxListeners(stream, MAX_LISTENERS_INCREMENT, signal);
};
const MAX_LISTENERS_INCREMENT = 2;

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/signals.js
/**
* This is not the set of all possible signals.
*
* It IS, however, the set of all signals that trigger
* an exit on either Linux or BSD systems.  Linux is a
* superset of the signal names supported on BSD, and
* the unknown signals just fail to register, so we can
* catch that easily enough.
*
* Windows signals are a different set, since there are
* signals that terminate Windows processes, but don't
* terminate (or don't even exist) on Posix systems.
*
* Don't bother with SIGKILL.  It's uncatchable, which
* means that we can't fire any callbacks anyway.
*
* If a user does happen to register a handler on a non-
* fatal signal like SIGWINCH or something, and then
* exit, it'll end up firing `process.emit('exit')`, so
* the handler will be fired anyway.
*
* SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
* artificially, inherently leave the process in a
* state from which it is not safe to try and enter JS
* listeners.
*/
const signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
if (process.platform === "linux") signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/index.js
const processOk = (process$3) => !!process$3 && typeof process$3 === "object" && typeof process$3.removeListener === "function" && typeof process$3.emit === "function" && typeof process$3.reallyExit === "function" && typeof process$3.listeners === "function" && typeof process$3.kill === "function" && typeof process$3.pid === "number" && typeof process$3.on === "function";
const kExitEmitter = Symbol.for("signal-exit emitter");
const global$1 = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
var Emitter = class {
	emitted = {
		afterExit: false,
		exit: false
	};
	listeners = {
		afterExit: [],
		exit: []
	};
	count = 0;
	id = Math.random();
	constructor() {
		if (global$1[kExitEmitter]) return global$1[kExitEmitter];
		ObjectDefineProperty(global$1, kExitEmitter, {
			value: this,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	on(ev, fn) {
		this.listeners[ev].push(fn);
	}
	removeListener(ev, fn) {
		const list = this.listeners[ev];
		const i$1 = list.indexOf(fn);
		/* c8 ignore start */
		if (i$1 === -1) return;
		/* c8 ignore stop */
		if (i$1 === 0 && list.length === 1) list.length = 0;
		else list.splice(i$1, 1);
	}
	emit(ev, code, signal) {
		if (this.emitted[ev]) return false;
		this.emitted[ev] = true;
		let ret = false;
		for (const fn of this.listeners[ev]) ret = fn(code, signal) === true || ret;
		if (ev === "exit") ret = this.emit("afterExit", code, signal) || ret;
		return ret;
	}
};
var SignalExitBase = class {};
const signalExitWrap = (handler) => {
	return {
		onExit(cb, opts) {
			return handler.onExit(cb, opts);
		},
		load() {
			return handler.load();
		},
		unload() {
			return handler.unload();
		}
	};
};
var SignalExitFallback = class extends SignalExitBase {
	onExit() {
		return () => {};
	}
	load() {}
	unload() {}
};
var SignalExit = class extends SignalExitBase {
	/* c8 ignore start */
	#hupSig = process$2.platform === "win32" ? "SIGINT" : "SIGHUP";
	/* c8 ignore stop */
	#emitter = new Emitter();
	#process;
	#originalProcessEmit;
	#originalProcessReallyExit;
	#sigListeners = {};
	#loaded = false;
	constructor(process$3) {
		super();
		this.#process = process$3;
		this.#sigListeners = {};
		for (const sig of signals) this.#sigListeners[sig] = () => {
			const listeners = this.#process.listeners(sig);
			let { count: count$1 } = this.#emitter;
			/* c8 ignore start */
			const p = process$3;
			if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") count$1 += p.__signal_exit_emitter__.count;
			/* c8 ignore stop */
			if (listeners.length === count$1) {
				this.unload();
				const ret = this.#emitter.emit("exit", null, sig);
				/* c8 ignore start */
				const s = sig === "SIGHUP" ? this.#hupSig : sig;
				if (!ret) process$3.kill(process$3.pid, s);
			}
		};
		this.#originalProcessReallyExit = process$3.reallyExit;
		this.#originalProcessEmit = process$3.emit;
	}
	onExit(cb, opts) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return () => {};
		/* c8 ignore stop */
		if (this.#loaded === false) this.load();
		const ev = opts?.alwaysLast ? "afterExit" : "exit";
		this.#emitter.on(ev, cb);
		return () => {
			this.#emitter.removeListener(ev, cb);
			if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) this.unload();
		};
	}
	load() {
		if (this.#loaded) return;
		this.#loaded = true;
		this.#emitter.count += 1;
		for (const sig of signals) try {
			const fn = this.#sigListeners[sig];
			if (fn) this.#process.on(sig, fn);
		} catch (_) {}
		this.#process.emit = (ev, ...a$1) => {
			return this.#processEmit(ev, ...a$1);
		};
		this.#process.reallyExit = (code) => {
			return this.#processReallyExit(code);
		};
	}
	unload() {
		if (!this.#loaded) return;
		this.#loaded = false;
		signals.forEach((sig) => {
			const listener = this.#sigListeners[sig];
			/* c8 ignore start */
			if (!listener) throw new Error("Listener not defined for signal: " + sig);
			/* c8 ignore stop */
			try {
				this.#process.removeListener(sig, listener);
			} catch (_) {}
			/* c8 ignore stop */
		});
		this.#process.emit = this.#originalProcessEmit;
		this.#process.reallyExit = this.#originalProcessReallyExit;
		this.#emitter.count -= 1;
	}
	#processReallyExit(code) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return 0;
		this.#process.exitCode = code || 0;
		/* c8 ignore stop */
		this.#emitter.emit("exit", this.#process.exitCode, null);
		return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
	}
	#processEmit(ev, ...args) {
		const og = this.#originalProcessEmit;
		if (ev === "exit" && processOk(this.#process)) {
			if (typeof args[0] === "number") this.#process.exitCode = args[0];
			/* c8 ignore start */
			const ret = og.call(this.#process, ev, ...args);
			/* c8 ignore start */
			this.#emitter.emit("exit", this.#process.exitCode, null);
			/* c8 ignore stop */
			return ret;
		} else return og.call(this.#process, ev, ...args);
	}
};
const process$2 = globalThis.process;
const { onExit, load, unload } = signalExitWrap(processOk(process$2) ? new SignalExit(process$2) : new SignalExitFallback());

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/terminate/cleanup.js
const cleanupOnExit = (subprocess, { cleanup, detached }, { signal }) => {
	if (!cleanup || detached) return;
	const removeExitHandler = onExit(() => {
		subprocess.kill();
	});
	addAbortListener(signal, () => {
		removeExitHandler();
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/pipe-arguments.js
const normalizePipeArguments = ({ source, sourcePromise, boundOptions, createNested }, ...pipeArguments) => {
	const startTime = getStartTime();
	const { destination, destinationStream, destinationError, from, unpipeSignal } = getDestinationStream(boundOptions, createNested, pipeArguments);
	const { sourceStream, sourceError } = getSourceStream(source, from);
	const { options: sourceOptions, fileDescriptors } = SUBPROCESS_OPTIONS.get(source);
	return {
		sourcePromise,
		sourceStream,
		sourceOptions,
		sourceError,
		destination,
		destinationStream,
		destinationError,
		unpipeSignal,
		fileDescriptors,
		startTime
	};
};
const getDestinationStream = (boundOptions, createNested, pipeArguments) => {
	try {
		const { destination, pipeOptions: { from, to, unpipeSignal } = {} } = getDestination(boundOptions, createNested, ...pipeArguments);
		return {
			destination,
			destinationStream: getToStream(destination, to),
			from,
			unpipeSignal
		};
	} catch (error) {
		return { destinationError: error };
	}
};
const getDestination = (boundOptions, createNested, firstArgument, ...pipeArguments) => {
	if (Array.isArray(firstArgument)) return {
		destination: createNested(mapDestinationArguments, boundOptions)(firstArgument, ...pipeArguments),
		pipeOptions: boundOptions
	};
	if (typeof firstArgument === "string" || firstArgument instanceof URL || isDenoExecPath(firstArgument)) {
		if (Object.keys(boundOptions).length > 0) throw new TypeError("Please use .pipe(\"file\", ..., options) or .pipe(execa(\"file\", ..., options)) instead of .pipe(options)(\"file\", ...).");
		const [rawFile, rawArguments, rawOptions] = normalizeParameters(firstArgument, ...pipeArguments);
		return {
			destination: createNested(mapDestinationArguments)(rawFile, rawArguments, rawOptions),
			pipeOptions: rawOptions
		};
	}
	if (SUBPROCESS_OPTIONS.has(firstArgument)) {
		if (Object.keys(boundOptions).length > 0) throw new TypeError("Please use .pipe(options)`command` or .pipe($(options)`command`) instead of .pipe(options)($`command`).");
		return {
			destination: firstArgument,
			pipeOptions: pipeArguments[0]
		};
	}
	throw new TypeError(`The first argument must be a template string, an options object, or an Execa subprocess: ${firstArgument}`);
};
const mapDestinationArguments = ({ options: options$1 }) => ({ options: {
	...options$1,
	stdin: "pipe",
	piped: true
} });
const getSourceStream = (source, from) => {
	try {
		return { sourceStream: getFromStream(source, from) };
	} catch (error) {
		return { sourceError: error };
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/throw.js
const handlePipeArgumentsError = ({ sourceStream, sourceError, destinationStream, destinationError, fileDescriptors, sourceOptions, startTime }) => {
	const error = getPipeArgumentsError({
		sourceStream,
		sourceError,
		destinationStream,
		destinationError
	});
	if (error !== void 0) throw createNonCommandError({
		error,
		fileDescriptors,
		sourceOptions,
		startTime
	});
};
const getPipeArgumentsError = ({ sourceStream, sourceError, destinationStream, destinationError }) => {
	if (sourceError !== void 0 && destinationError !== void 0) return destinationError;
	if (destinationError !== void 0) {
		abortSourceStream(sourceStream);
		return destinationError;
	}
	if (sourceError !== void 0) {
		endDestinationStream(destinationStream);
		return sourceError;
	}
};
const createNonCommandError = ({ error, fileDescriptors, sourceOptions, startTime }) => makeEarlyError({
	error,
	command: PIPE_COMMAND_MESSAGE,
	escapedCommand: PIPE_COMMAND_MESSAGE,
	fileDescriptors,
	options: sourceOptions,
	startTime,
	isSync: false
});
const PIPE_COMMAND_MESSAGE = "source.pipe(destination)";

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/sequence.js
const waitForBothSubprocesses = async (subprocessPromises) => {
	const [{ status: sourceStatus, reason: sourceReason, value: sourceResult = sourceReason }, { status: destinationStatus, reason: destinationReason, value: destinationResult = destinationReason }] = await subprocessPromises;
	if (!destinationResult.pipedFrom.includes(sourceResult)) destinationResult.pipedFrom.push(sourceResult);
	if (destinationStatus === "rejected") throw destinationResult;
	if (sourceStatus === "rejected") throw sourceResult;
	return destinationResult;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/streaming.js
const pipeSubprocessStream = (sourceStream, destinationStream, maxListenersController) => {
	const mergedStream = MERGED_STREAMS.has(destinationStream) ? pipeMoreSubprocessStream(sourceStream, destinationStream) : pipeFirstSubprocessStream(sourceStream, destinationStream);
	incrementMaxListeners(sourceStream, SOURCE_LISTENERS_PER_PIPE, maxListenersController.signal);
	incrementMaxListeners(destinationStream, DESTINATION_LISTENERS_PER_PIPE, maxListenersController.signal);
	cleanupMergedStreamsMap(destinationStream);
	return mergedStream;
};
const pipeFirstSubprocessStream = (sourceStream, destinationStream) => {
	const mergedStream = mergeStreams([sourceStream]);
	pipeStreams(mergedStream, destinationStream);
	MERGED_STREAMS.set(destinationStream, mergedStream);
	return mergedStream;
};
const pipeMoreSubprocessStream = (sourceStream, destinationStream) => {
	const mergedStream = MERGED_STREAMS.get(destinationStream);
	mergedStream.add(sourceStream);
	return mergedStream;
};
const cleanupMergedStreamsMap = async (destinationStream) => {
	try {
		await finished(destinationStream, {
			cleanup: true,
			readable: false,
			writable: true
		});
	} catch {}
	MERGED_STREAMS.delete(destinationStream);
};
const MERGED_STREAMS = /* @__PURE__ */ new WeakMap();
const SOURCE_LISTENERS_PER_PIPE = 2;
const DESTINATION_LISTENERS_PER_PIPE = 1;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/abort.js
const unpipeOnAbort = (unpipeSignal, unpipeContext) => unpipeSignal === void 0 ? [] : [unpipeOnSignalAbort(unpipeSignal, unpipeContext)];
const unpipeOnSignalAbort = async (unpipeSignal, { sourceStream, mergedStream, fileDescriptors, sourceOptions, startTime }) => {
	await aborted(unpipeSignal, sourceStream);
	await mergedStream.remove(sourceStream);
	throw createNonCommandError({
		error: /* @__PURE__ */ new Error("Pipe canceled by `unpipeSignal` option."),
		fileDescriptors,
		sourceOptions,
		startTime
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/pipe/setup.js
const pipeToSubprocess = (sourceInfo, ...pipeArguments) => {
	if (isPlainObject(pipeArguments[0])) return pipeToSubprocess.bind(void 0, {
		...sourceInfo,
		boundOptions: {
			...sourceInfo.boundOptions,
			...pipeArguments[0]
		}
	});
	const { destination,...normalizedInfo } = normalizePipeArguments(sourceInfo, ...pipeArguments);
	const promise = handlePipePromise({
		...normalizedInfo,
		destination
	});
	promise.pipe = pipeToSubprocess.bind(void 0, {
		...sourceInfo,
		source: destination,
		sourcePromise: promise,
		boundOptions: {}
	});
	return promise;
};
const handlePipePromise = async ({ sourcePromise, sourceStream, sourceOptions, sourceError, destination, destinationStream, destinationError, unpipeSignal, fileDescriptors, startTime }) => {
	const subprocessPromises = getSubprocessPromises(sourcePromise, destination);
	handlePipeArgumentsError({
		sourceStream,
		sourceError,
		destinationStream,
		destinationError,
		fileDescriptors,
		sourceOptions,
		startTime
	});
	const maxListenersController = new AbortController();
	try {
		const mergedStream = pipeSubprocessStream(sourceStream, destinationStream, maxListenersController);
		return await Promise.race([waitForBothSubprocesses(subprocessPromises), ...unpipeOnAbort(unpipeSignal, {
			sourceStream,
			mergedStream,
			sourceOptions,
			fileDescriptors,
			startTime
		})]);
	} finally {
		maxListenersController.abort();
	}
};
const getSubprocessPromises = (sourcePromise, destination) => Promise.allSettled([sourcePromise, destination]);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/iterate.js
const iterateOnSubprocessStream = ({ subprocessStdout, subprocess, binary, shouldEncode, encoding, preserveNewlines }) => {
	const controller = new AbortController();
	stopReadingOnExit(subprocess, controller);
	return iterateOnStream({
		stream: subprocessStdout,
		controller,
		binary,
		shouldEncode: !subprocessStdout.readableObjectMode && shouldEncode,
		encoding,
		shouldSplit: !subprocessStdout.readableObjectMode,
		preserveNewlines
	});
};
const stopReadingOnExit = async (subprocess, controller) => {
	try {
		await subprocess;
	} catch {} finally {
		controller.abort();
	}
};
const iterateForResult = ({ stream, onStreamEnd, lines: lines$4, encoding, stripFinalNewline: stripFinalNewline$1, allMixed }) => {
	const controller = new AbortController();
	stopReadingOnStreamEnd(onStreamEnd, controller, stream);
	const objectMode = stream.readableObjectMode && !allMixed;
	return iterateOnStream({
		stream,
		controller,
		binary: encoding === "buffer",
		shouldEncode: !objectMode,
		encoding,
		shouldSplit: !objectMode && lines$4,
		preserveNewlines: !stripFinalNewline$1
	});
};
const stopReadingOnStreamEnd = async (onStreamEnd, controller, stream) => {
	try {
		await onStreamEnd;
	} catch {
		stream.destroy();
	} finally {
		controller.abort();
	}
};
const iterateOnStream = ({ stream, controller, binary, shouldEncode, encoding, shouldSplit, preserveNewlines }) => {
	return iterateOnData({
		onStdoutChunk: on(stream, "data", {
			signal: controller.signal,
			highWaterMark: HIGH_WATER_MARK,
			highWatermark: HIGH_WATER_MARK
		}),
		controller,
		binary,
		shouldEncode,
		encoding,
		shouldSplit,
		preserveNewlines
	});
};
const DEFAULT_OBJECT_HIGH_WATER_MARK = getDefaultHighWaterMark(true);
const HIGH_WATER_MARK = DEFAULT_OBJECT_HIGH_WATER_MARK;
const iterateOnData = async function* ({ onStdoutChunk, controller, binary, shouldEncode, encoding, shouldSplit, preserveNewlines }) {
	const generators = getGenerators({
		binary,
		shouldEncode,
		encoding,
		shouldSplit,
		preserveNewlines
	});
	try {
		for await (const [chunk] of onStdoutChunk) yield* transformChunkSync(chunk, generators, 0);
	} catch (error) {
		if (!controller.signal.aborted) throw error;
	} finally {
		yield* finalChunksSync(generators);
	}
};
const getGenerators = ({ binary, shouldEncode, encoding, shouldSplit, preserveNewlines }) => [getEncodingTransformGenerator(binary, encoding, !shouldEncode), getSplitLinesGenerator(binary, preserveNewlines, !shouldSplit, {})].filter(Boolean);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/io/contents.js
const getStreamOutput = async ({ stream, onStreamEnd, fdNumber, encoding, buffer, maxBuffer, lines: lines$4, allMixed, stripFinalNewline: stripFinalNewline$1, verboseInfo, streamInfo }) => {
	const logPromise = logOutputAsync({
		stream,
		onStreamEnd,
		fdNumber,
		encoding,
		allMixed,
		verboseInfo,
		streamInfo
	});
	if (!buffer) {
		await Promise.all([resumeStream(stream), logPromise]);
		return;
	}
	const iterable = iterateForResult({
		stream,
		onStreamEnd,
		lines: lines$4,
		encoding,
		stripFinalNewline: getStripFinalNewline(stripFinalNewline$1, fdNumber),
		allMixed
	});
	const [output] = await Promise.all([getStreamContents({
		stream,
		iterable,
		fdNumber,
		encoding,
		maxBuffer,
		lines: lines$4
	}), logPromise]);
	return output;
};
const logOutputAsync = async ({ stream, onStreamEnd, fdNumber, encoding, allMixed, verboseInfo, streamInfo: { fileDescriptors } }) => {
	if (!shouldLogOutput({
		stdioItems: fileDescriptors[fdNumber]?.stdioItems,
		encoding,
		verboseInfo,
		fdNumber
	})) return;
	await logLines(iterateForResult({
		stream,
		onStreamEnd,
		lines: true,
		encoding,
		stripFinalNewline: true,
		allMixed
	}), stream, fdNumber, verboseInfo);
};
const resumeStream = async (stream) => {
	await setImmediate();
	if (stream.readableFlowing === null) stream.resume();
};
const getStreamContents = async ({ stream, stream: { readableObjectMode }, iterable, fdNumber, encoding, maxBuffer, lines: lines$4 }) => {
	try {
		if (readableObjectMode || lines$4) return await getStreamAsArray(iterable, { maxBuffer });
		if (encoding === "buffer") return new Uint8Array(await getStreamAsArrayBuffer(iterable, { maxBuffer }));
		return await getStreamAsString(iterable, { maxBuffer });
	} catch (error) {
		return handleBufferedData(handleMaxBuffer({
			error,
			stream,
			readableObjectMode,
			lines: lines$4,
			encoding,
			fdNumber
		}));
	}
};
const getBufferedData = async (streamPromise) => {
	try {
		return await streamPromise;
	} catch (error) {
		return handleBufferedData(error);
	}
};
const handleBufferedData = ({ bufferedData }) => isArrayBuffer(bufferedData) ? new Uint8Array(bufferedData) : bufferedData;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/wait-stream.js
const waitForStream = async (stream, fdNumber, streamInfo, { isSameDirection, stopOnExit = false } = {}) => {
	const state = handleStdinDestroy(stream, streamInfo);
	const abortController = new AbortController();
	try {
		await Promise.race([...stopOnExit ? [streamInfo.exitPromise] : [], finished(stream, {
			cleanup: true,
			signal: abortController.signal
		})]);
	} catch (error) {
		if (!state.stdinCleanedUp) handleStreamError(error, fdNumber, streamInfo, isSameDirection);
	} finally {
		abortController.abort();
	}
};
const handleStdinDestroy = (stream, { originalStreams: [originalStdin], subprocess }) => {
	const state = { stdinCleanedUp: false };
	if (stream === originalStdin) spyOnStdinDestroy(stream, subprocess, state);
	return state;
};
const spyOnStdinDestroy = (subprocessStdin, subprocess, state) => {
	const { _destroy } = subprocessStdin;
	subprocessStdin._destroy = (...destroyArguments) => {
		setStdinCleanedUp(subprocess, state);
		_destroy.call(subprocessStdin, ...destroyArguments);
	};
};
const setStdinCleanedUp = ({ exitCode, signalCode }, state) => {
	if (exitCode !== null || signalCode !== null) state.stdinCleanedUp = true;
};
const handleStreamError = (error, fdNumber, streamInfo, isSameDirection) => {
	if (!shouldIgnoreStreamError(error, fdNumber, streamInfo, isSameDirection)) throw error;
};
const shouldIgnoreStreamError = (error, fdNumber, streamInfo, isSameDirection = true) => {
	if (streamInfo.propagating) return isStreamEpipe(error) || isStreamAbort(error);
	streamInfo.propagating = true;
	return isInputFileDescriptor(streamInfo, fdNumber) === isSameDirection ? isStreamEpipe(error) : isStreamAbort(error);
};
const isInputFileDescriptor = ({ fileDescriptors }, fdNumber) => fdNumber !== "all" && fileDescriptors[fdNumber].direction === "input";
const isStreamAbort = (error) => error?.code === "ERR_STREAM_PREMATURE_CLOSE";
const isStreamEpipe = (error) => error?.code === "EPIPE";

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/stdio.js
const waitForStdioStreams = ({ subprocess, encoding, buffer, maxBuffer, lines: lines$4, stripFinalNewline: stripFinalNewline$1, verboseInfo, streamInfo }) => subprocess.stdio.map((stream, fdNumber) => waitForSubprocessStream({
	stream,
	fdNumber,
	encoding,
	buffer: buffer[fdNumber],
	maxBuffer: maxBuffer[fdNumber],
	lines: lines$4[fdNumber],
	allMixed: false,
	stripFinalNewline: stripFinalNewline$1,
	verboseInfo,
	streamInfo
}));
const waitForSubprocessStream = async ({ stream, fdNumber, encoding, buffer, maxBuffer, lines: lines$4, allMixed, stripFinalNewline: stripFinalNewline$1, verboseInfo, streamInfo }) => {
	if (!stream) return;
	const onStreamEnd = waitForStream(stream, fdNumber, streamInfo);
	if (isInputFileDescriptor(streamInfo, fdNumber)) {
		await onStreamEnd;
		return;
	}
	const [output] = await Promise.all([getStreamOutput({
		stream,
		onStreamEnd,
		fdNumber,
		encoding,
		buffer,
		maxBuffer,
		lines: lines$4,
		allMixed,
		stripFinalNewline: stripFinalNewline$1,
		verboseInfo,
		streamInfo
	}), onStreamEnd]);
	return output;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/all-async.js
const makeAllStream = ({ stdout, stderr }, { all }) => all && (stdout || stderr) ? mergeStreams([stdout, stderr].filter(Boolean)) : void 0;
const waitForAllStream = ({ subprocess, encoding, buffer, maxBuffer, lines: lines$4, stripFinalNewline: stripFinalNewline$1, verboseInfo, streamInfo }) => waitForSubprocessStream({
	...getAllStream(subprocess, buffer),
	fdNumber: "all",
	encoding,
	maxBuffer: maxBuffer[1] + maxBuffer[2],
	lines: lines$4[1] || lines$4[2],
	allMixed: getAllMixed(subprocess),
	stripFinalNewline: stripFinalNewline$1,
	verboseInfo,
	streamInfo
});
const getAllStream = ({ stdout, stderr, all }, [, bufferStdout, bufferStderr]) => {
	const buffer = bufferStdout || bufferStderr;
	if (!buffer) return {
		stream: all,
		buffer
	};
	if (!bufferStdout) return {
		stream: stderr,
		buffer
	};
	if (!bufferStderr) return {
		stream: stdout,
		buffer
	};
	return {
		stream: all,
		buffer
	};
};
const getAllMixed = ({ all, stdout, stderr }) => all && stdout && stderr && stdout.readableObjectMode !== stderr.readableObjectMode;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/verbose/ipc.js
const shouldLogIpc = (verboseInfo) => isFullVerbose(verboseInfo, "ipc");
const logIpcOutput = (message, verboseInfo) => {
	verboseLog({
		type: "ipc",
		verboseMessage: serializeVerboseMessage(message),
		fdNumber: "ipc",
		verboseInfo
	});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/ipc/buffer-messages.js
const waitForIpcOutput = async ({ subprocess, buffer: bufferArray, maxBuffer: maxBufferArray, ipc, ipcOutput, verboseInfo }) => {
	if (!ipc) return ipcOutput;
	const isVerbose$1 = shouldLogIpc(verboseInfo);
	const buffer = getFdSpecificValue(bufferArray, "ipc");
	const maxBuffer = getFdSpecificValue(maxBufferArray, "ipc");
	for await (const message of loopOnMessages({
		anyProcess: subprocess,
		channel: subprocess.channel,
		isSubprocess: false,
		ipc,
		shouldAwait: false,
		reference: true
	})) {
		if (buffer) {
			checkIpcMaxBuffer(subprocess, ipcOutput, maxBuffer);
			ipcOutput.push(message);
		}
		if (isVerbose$1) logIpcOutput(message, verboseInfo);
	}
	return ipcOutput;
};
const getBufferedIpcOutput = async (ipcOutputPromise, ipcOutput) => {
	await Promise.allSettled([ipcOutputPromise]);
	return ipcOutput;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/resolve/wait-subprocess.js
const waitForSubprocessResult = async ({ subprocess, options: { encoding, buffer, maxBuffer, lines: lines$4, timeoutDuration: timeout, cancelSignal, gracefulCancel, forceKillAfterDelay, stripFinalNewline: stripFinalNewline$1, ipc, ipcInput }, context, verboseInfo, fileDescriptors, originalStreams, onInternalError, controller }) => {
	const exitPromise = waitForExit(subprocess, context);
	const streamInfo = {
		originalStreams,
		fileDescriptors,
		subprocess,
		exitPromise,
		propagating: false
	};
	const stdioPromises = waitForStdioStreams({
		subprocess,
		encoding,
		buffer,
		maxBuffer,
		lines: lines$4,
		stripFinalNewline: stripFinalNewline$1,
		verboseInfo,
		streamInfo
	});
	const allPromise = waitForAllStream({
		subprocess,
		encoding,
		buffer,
		maxBuffer,
		lines: lines$4,
		stripFinalNewline: stripFinalNewline$1,
		verboseInfo,
		streamInfo
	});
	const ipcOutput = [];
	const ipcOutputPromise = waitForIpcOutput({
		subprocess,
		buffer,
		maxBuffer,
		ipc,
		ipcOutput,
		verboseInfo
	});
	const originalPromises = waitForOriginalStreams(originalStreams, subprocess, streamInfo);
	const customStreamsEndPromises = waitForCustomStreamsEnd(fileDescriptors, streamInfo);
	try {
		return await Promise.race([
			Promise.all([
				{},
				waitForSuccessfulExit(exitPromise),
				Promise.all(stdioPromises),
				allPromise,
				ipcOutputPromise,
				sendIpcInput(subprocess, ipcInput),
				...originalPromises,
				...customStreamsEndPromises
			]),
			onInternalError,
			throwOnSubprocessError(subprocess, controller),
			...throwOnTimeout(subprocess, timeout, context, controller),
			...throwOnCancel({
				subprocess,
				cancelSignal,
				gracefulCancel,
				context,
				controller
			}),
			...throwOnGracefulCancel({
				subprocess,
				cancelSignal,
				gracefulCancel,
				forceKillAfterDelay,
				context,
				controller
			})
		]);
	} catch (error) {
		context.terminationReason ??= "other";
		return Promise.all([
			{ error },
			exitPromise,
			Promise.all(stdioPromises.map((stdioPromise) => getBufferedData(stdioPromise))),
			getBufferedData(allPromise),
			getBufferedIpcOutput(ipcOutputPromise, ipcOutput),
			Promise.allSettled(originalPromises),
			Promise.allSettled(customStreamsEndPromises)
		]);
	}
};
const waitForOriginalStreams = (originalStreams, subprocess, streamInfo) => originalStreams.map((stream, fdNumber) => stream === subprocess.stdio[fdNumber] ? void 0 : waitForStream(stream, fdNumber, streamInfo));
const waitForCustomStreamsEnd = (fileDescriptors, streamInfo) => fileDescriptors.flatMap(({ stdioItems }, fdNumber) => stdioItems.filter(({ value, stream = value }) => isStream(stream, { checkOpen: false }) && !isStandardStream(stream)).map(({ type, value, stream = value }) => waitForStream(stream, fdNumber, streamInfo, {
	isSameDirection: TRANSFORM_TYPES.has(type),
	stopOnExit: type === "native"
})));
const throwOnSubprocessError = async (subprocess, { signal }) => {
	const [error] = await once(subprocess, "error", { signal });
	throw error;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/concurrent.js
const initializeConcurrentStreams = () => ({
	readableDestroy: /* @__PURE__ */ new WeakMap(),
	writableFinal: /* @__PURE__ */ new WeakMap(),
	writableDestroy: /* @__PURE__ */ new WeakMap()
});
const addConcurrentStream = (concurrentStreams, stream, waitName) => {
	const weakMap = concurrentStreams[waitName];
	if (!weakMap.has(stream)) weakMap.set(stream, []);
	const promises = weakMap.get(stream);
	const promise = createDeferred();
	promises.push(promise);
	return {
		resolve: promise.resolve.bind(promise),
		promises
	};
};
const waitForConcurrentStreams = async ({ resolve, promises }, subprocess) => {
	resolve();
	const [isSubprocessExit] = await Promise.race([Promise.allSettled([true, subprocess]), Promise.all([false, ...promises])]);
	return !isSubprocessExit;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/shared.js
const safeWaitForSubprocessStdin = async (subprocessStdin) => {
	if (subprocessStdin === void 0) return;
	try {
		await waitForSubprocessStdin(subprocessStdin);
	} catch {}
};
const safeWaitForSubprocessStdout = async (subprocessStdout) => {
	if (subprocessStdout === void 0) return;
	try {
		await waitForSubprocessStdout(subprocessStdout);
	} catch {}
};
const waitForSubprocessStdin = async (subprocessStdin) => {
	await finished(subprocessStdin, {
		cleanup: true,
		readable: false,
		writable: true
	});
};
const waitForSubprocessStdout = async (subprocessStdout) => {
	await finished(subprocessStdout, {
		cleanup: true,
		readable: true,
		writable: false
	});
};
const waitForSubprocess = async (subprocess, error) => {
	await subprocess;
	if (error) throw error;
};
const destroyOtherStream = (stream, isOpen, error) => {
	if (error && !isStreamAbort(error)) stream.destroy(error);
	else if (isOpen) stream.destroy();
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/readable.js
const createReadable = ({ subprocess, concurrentStreams, encoding }, { from, binary: binaryOption = true, preserveNewlines = true } = {}) => {
	const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
	const { subprocessStdout, waitReadableDestroy } = getSubprocessStdout(subprocess, from, concurrentStreams);
	const { readableEncoding, readableObjectMode, readableHighWaterMark } = getReadableOptions(subprocessStdout, binary);
	const { read, onStdoutDataDone } = getReadableMethods({
		subprocessStdout,
		subprocess,
		binary,
		encoding,
		preserveNewlines
	});
	const readable$1 = new Readable({
		read,
		destroy: callbackify(onReadableDestroy.bind(void 0, {
			subprocessStdout,
			subprocess,
			waitReadableDestroy
		})),
		highWaterMark: readableHighWaterMark,
		objectMode: readableObjectMode,
		encoding: readableEncoding
	});
	onStdoutFinished({
		subprocessStdout,
		onStdoutDataDone,
		readable: readable$1,
		subprocess
	});
	return readable$1;
};
const getSubprocessStdout = (subprocess, from, concurrentStreams) => {
	const subprocessStdout = getFromStream(subprocess, from);
	return {
		subprocessStdout,
		waitReadableDestroy: addConcurrentStream(concurrentStreams, subprocessStdout, "readableDestroy")
	};
};
const getReadableOptions = ({ readableEncoding, readableObjectMode, readableHighWaterMark }, binary) => binary ? {
	readableEncoding,
	readableObjectMode,
	readableHighWaterMark
} : {
	readableEncoding,
	readableObjectMode: true,
	readableHighWaterMark: DEFAULT_OBJECT_HIGH_WATER_MARK
};
const getReadableMethods = ({ subprocessStdout, subprocess, binary, encoding, preserveNewlines }) => {
	const onStdoutDataDone = createDeferred();
	const onStdoutData = iterateOnSubprocessStream({
		subprocessStdout,
		subprocess,
		binary,
		shouldEncode: !binary,
		encoding,
		preserveNewlines
	});
	return {
		read() {
			onRead(this, onStdoutData, onStdoutDataDone);
		},
		onStdoutDataDone
	};
};
const onRead = async (readable$1, onStdoutData, onStdoutDataDone) => {
	try {
		const { value, done } = await onStdoutData.next();
		if (done) onStdoutDataDone.resolve();
		else readable$1.push(value);
	} catch {}
};
const onStdoutFinished = async ({ subprocessStdout, onStdoutDataDone, readable: readable$1, subprocess, subprocessStdin }) => {
	try {
		await waitForSubprocessStdout(subprocessStdout);
		await subprocess;
		await safeWaitForSubprocessStdin(subprocessStdin);
		await onStdoutDataDone;
		if (readable$1.readable) readable$1.push(null);
	} catch (error) {
		await safeWaitForSubprocessStdin(subprocessStdin);
		destroyOtherReadable(readable$1, error);
	}
};
const onReadableDestroy = async ({ subprocessStdout, subprocess, waitReadableDestroy }, error) => {
	if (await waitForConcurrentStreams(waitReadableDestroy, subprocess)) {
		destroyOtherReadable(subprocessStdout, error);
		await waitForSubprocess(subprocess, error);
	}
};
const destroyOtherReadable = (stream, error) => {
	destroyOtherStream(stream, stream.readable, error);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/writable.js
const createWritable = ({ subprocess, concurrentStreams }, { to } = {}) => {
	const { subprocessStdin, waitWritableFinal, waitWritableDestroy } = getSubprocessStdin(subprocess, to, concurrentStreams);
	const writable$1 = new Writable({
		...getWritableMethods(subprocessStdin, subprocess, waitWritableFinal),
		destroy: callbackify(onWritableDestroy.bind(void 0, {
			subprocessStdin,
			subprocess,
			waitWritableFinal,
			waitWritableDestroy
		})),
		highWaterMark: subprocessStdin.writableHighWaterMark,
		objectMode: subprocessStdin.writableObjectMode
	});
	onStdinFinished(subprocessStdin, writable$1);
	return writable$1;
};
const getSubprocessStdin = (subprocess, to, concurrentStreams) => {
	const subprocessStdin = getToStream(subprocess, to);
	return {
		subprocessStdin,
		waitWritableFinal: addConcurrentStream(concurrentStreams, subprocessStdin, "writableFinal"),
		waitWritableDestroy: addConcurrentStream(concurrentStreams, subprocessStdin, "writableDestroy")
	};
};
const getWritableMethods = (subprocessStdin, subprocess, waitWritableFinal) => ({
	write: onWrite.bind(void 0, subprocessStdin),
	final: callbackify(onWritableFinal.bind(void 0, subprocessStdin, subprocess, waitWritableFinal))
});
const onWrite = (subprocessStdin, chunk, encoding, done) => {
	if (subprocessStdin.write(chunk, encoding)) done();
	else subprocessStdin.once("drain", done);
};
const onWritableFinal = async (subprocessStdin, subprocess, waitWritableFinal) => {
	if (await waitForConcurrentStreams(waitWritableFinal, subprocess)) {
		if (subprocessStdin.writable) subprocessStdin.end();
		await subprocess;
	}
};
const onStdinFinished = async (subprocessStdin, writable$1, subprocessStdout) => {
	try {
		await waitForSubprocessStdin(subprocessStdin);
		if (writable$1.writable) writable$1.end();
	} catch (error) {
		await safeWaitForSubprocessStdout(subprocessStdout);
		destroyOtherWritable(writable$1, error);
	}
};
const onWritableDestroy = async ({ subprocessStdin, subprocess, waitWritableFinal, waitWritableDestroy }, error) => {
	await waitForConcurrentStreams(waitWritableFinal, subprocess);
	if (await waitForConcurrentStreams(waitWritableDestroy, subprocess)) {
		destroyOtherWritable(subprocessStdin, error);
		await waitForSubprocess(subprocess, error);
	}
};
const destroyOtherWritable = (stream, error) => {
	destroyOtherStream(stream, stream.writable, error);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/duplex.js
const createDuplex = ({ subprocess, concurrentStreams, encoding }, { from, to, binary: binaryOption = true, preserveNewlines = true } = {}) => {
	const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
	const { subprocessStdout, waitReadableDestroy } = getSubprocessStdout(subprocess, from, concurrentStreams);
	const { subprocessStdin, waitWritableFinal, waitWritableDestroy } = getSubprocessStdin(subprocess, to, concurrentStreams);
	const { readableEncoding, readableObjectMode, readableHighWaterMark } = getReadableOptions(subprocessStdout, binary);
	const { read, onStdoutDataDone } = getReadableMethods({
		subprocessStdout,
		subprocess,
		binary,
		encoding,
		preserveNewlines
	});
	const duplex$1 = new Duplex({
		read,
		...getWritableMethods(subprocessStdin, subprocess, waitWritableFinal),
		destroy: callbackify(onDuplexDestroy.bind(void 0, {
			subprocessStdout,
			subprocessStdin,
			subprocess,
			waitReadableDestroy,
			waitWritableFinal,
			waitWritableDestroy
		})),
		readableHighWaterMark,
		writableHighWaterMark: subprocessStdin.writableHighWaterMark,
		readableObjectMode,
		writableObjectMode: subprocessStdin.writableObjectMode,
		encoding: readableEncoding
	});
	onStdoutFinished({
		subprocessStdout,
		onStdoutDataDone,
		readable: duplex$1,
		subprocess,
		subprocessStdin
	});
	onStdinFinished(subprocessStdin, duplex$1, subprocessStdout);
	return duplex$1;
};
const onDuplexDestroy = async ({ subprocessStdout, subprocessStdin, subprocess, waitReadableDestroy, waitWritableFinal, waitWritableDestroy }, error) => {
	await Promise.all([onReadableDestroy({
		subprocessStdout,
		subprocess,
		waitReadableDestroy
	}, error), onWritableDestroy({
		subprocessStdin,
		subprocess,
		waitWritableFinal,
		waitWritableDestroy
	}, error)]);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/iterable.js
const createIterable = (subprocess, encoding, { from, binary: binaryOption = false, preserveNewlines = false } = {}) => {
	const binary = binaryOption || BINARY_ENCODINGS.has(encoding);
	const subprocessStdout = getFromStream(subprocess, from);
	return iterateOnStdoutData(iterateOnSubprocessStream({
		subprocessStdout,
		subprocess,
		binary,
		shouldEncode: true,
		encoding,
		preserveNewlines
	}), subprocessStdout, subprocess);
};
const iterateOnStdoutData = async function* (onStdoutData, subprocessStdout, subprocess) {
	try {
		yield* onStdoutData;
	} finally {
		if (subprocessStdout.readable) subprocessStdout.destroy();
		await subprocess;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/convert/add.js
const addConvertedStreams = (subprocess, { encoding }) => {
	const concurrentStreams = initializeConcurrentStreams();
	subprocess.readable = createReadable.bind(void 0, {
		subprocess,
		concurrentStreams,
		encoding
	});
	subprocess.writable = createWritable.bind(void 0, {
		subprocess,
		concurrentStreams
	});
	subprocess.duplex = createDuplex.bind(void 0, {
		subprocess,
		concurrentStreams,
		encoding
	});
	subprocess.iterable = createIterable.bind(void 0, subprocess, encoding);
	subprocess[Symbol.asyncIterator] = createIterable.bind(void 0, subprocess, encoding, {});
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/promise.js
const mergePromise = (subprocess, promise) => {
	for (const [property, descriptor] of descriptors) {
		const value = descriptor.value.bind(promise);
		Reflect.defineProperty(subprocess, property, {
			...descriptor,
			value
		});
	}
};
const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = [
	"then",
	"catch",
	"finally"
].map((property) => [property, Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)]);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/main-async.js
const execaCoreAsync = (rawFile, rawArguments, rawOptions, createNested) => {
	const { file, commandArguments, command, escapedCommand, startTime, verboseInfo, options: options$1, fileDescriptors } = handleAsyncArguments(rawFile, rawArguments, rawOptions);
	const { subprocess, promise } = spawnSubprocessAsync({
		file,
		commandArguments,
		options: options$1,
		startTime,
		verboseInfo,
		command,
		escapedCommand,
		fileDescriptors
	});
	subprocess.pipe = pipeToSubprocess.bind(void 0, {
		source: subprocess,
		sourcePromise: promise,
		boundOptions: {},
		createNested
	});
	mergePromise(subprocess, promise);
	SUBPROCESS_OPTIONS.set(subprocess, {
		options: options$1,
		fileDescriptors
	});
	return subprocess;
};
const handleAsyncArguments = (rawFile, rawArguments, rawOptions) => {
	const { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions);
	const { file, commandArguments, options: normalizedOptions } = normalizeOptions(rawFile, rawArguments, rawOptions);
	const options$1 = handleAsyncOptions(normalizedOptions);
	return {
		file,
		commandArguments,
		command,
		escapedCommand,
		startTime,
		verboseInfo,
		options: options$1,
		fileDescriptors: handleStdioAsync(options$1, verboseInfo)
	};
};
const handleAsyncOptions = ({ timeout, signal,...options$1 }) => {
	if (signal !== void 0) throw new TypeError("The \"signal\" option has been renamed to \"cancelSignal\" instead.");
	return {
		...options$1,
		timeoutDuration: timeout
	};
};
const spawnSubprocessAsync = ({ file, commandArguments, options: options$1, startTime, verboseInfo, command, escapedCommand, fileDescriptors }) => {
	let subprocess;
	try {
		subprocess = spawn(...concatenateShell(file, commandArguments, options$1));
	} catch (error) {
		return handleEarlyError({
			error,
			command,
			escapedCommand,
			fileDescriptors,
			options: options$1,
			startTime,
			verboseInfo
		});
	}
	const controller = new AbortController();
	setMaxListeners(Number.POSITIVE_INFINITY, controller.signal);
	const originalStreams = [...subprocess.stdio];
	pipeOutputAsync(subprocess, fileDescriptors, controller);
	cleanupOnExit(subprocess, options$1, controller);
	const context = {};
	const onInternalError = createDeferred();
	subprocess.kill = subprocessKill.bind(void 0, {
		kill: subprocess.kill.bind(subprocess),
		options: options$1,
		onInternalError,
		context,
		controller
	});
	subprocess.all = makeAllStream(subprocess, options$1);
	addConvertedStreams(subprocess, options$1);
	addIpcMethods(subprocess, options$1);
	const promise = handlePromise({
		subprocess,
		options: options$1,
		startTime,
		verboseInfo,
		fileDescriptors,
		originalStreams,
		command,
		escapedCommand,
		context,
		onInternalError,
		controller
	});
	return {
		subprocess,
		promise
	};
};
const handlePromise = async ({ subprocess, options: options$1, startTime, verboseInfo, fileDescriptors, originalStreams, command, escapedCommand, context, onInternalError, controller }) => {
	const [errorInfo, [exitCode, signal], stdioResults, allResult, ipcOutput] = await waitForSubprocessResult({
		subprocess,
		options: options$1,
		context,
		verboseInfo,
		fileDescriptors,
		originalStreams,
		onInternalError,
		controller
	});
	controller.abort();
	onInternalError.resolve();
	return handleResult(getAsyncResult({
		errorInfo,
		exitCode,
		signal,
		stdio: stdioResults.map((stdioResult, fdNumber) => stripNewline(stdioResult, options$1, fdNumber)),
		all: stripNewline(allResult, options$1, "all"),
		ipcOutput,
		context,
		options: options$1,
		command,
		escapedCommand,
		startTime
	}), verboseInfo, options$1);
};
const getAsyncResult = ({ errorInfo, exitCode, signal, stdio, all, ipcOutput, context, options: options$1, command, escapedCommand, startTime }) => "error" in errorInfo ? makeError({
	error: errorInfo.error,
	command,
	escapedCommand,
	timedOut: context.terminationReason === "timeout",
	isCanceled: context.terminationReason === "cancel" || context.terminationReason === "gracefulCancel",
	isGracefullyCanceled: context.terminationReason === "gracefulCancel",
	isMaxBuffer: errorInfo.error instanceof MaxBufferError,
	isForcefullyTerminated: context.isForcefullyTerminated,
	exitCode,
	signal,
	stdio,
	all,
	ipcOutput,
	options: options$1,
	startTime,
	isSync: false
}) : makeSuccessResult({
	command,
	escapedCommand,
	stdio,
	all,
	ipcOutput,
	options: options$1,
	startTime
});

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/bind.js
const mergeOptions = (boundOptions, options$1) => {
	const newOptions = Object.fromEntries(Object.entries(options$1).map(([optionName, optionValue]) => [optionName, mergeOption(optionName, boundOptions[optionName], optionValue)]));
	return {
		...boundOptions,
		...newOptions
	};
};
const mergeOption = (optionName, boundOptionValue, optionValue) => {
	if (DEEP_OPTIONS.has(optionName) && isPlainObject(boundOptionValue) && isPlainObject(optionValue)) return {
		...boundOptionValue,
		...optionValue
	};
	return optionValue;
};
const DEEP_OPTIONS = new Set(["env", ...FD_SPECIFIC_OPTIONS]);

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/create.js
const createExeca = (mapArguments, boundOptions, deepOptions, setBoundExeca) => {
	const createNested = (mapArguments$1, boundOptions$1, setBoundExeca$1) => createExeca(mapArguments$1, boundOptions$1, deepOptions, setBoundExeca$1);
	const boundExeca = (...execaArguments) => callBoundExeca({
		mapArguments,
		deepOptions,
		boundOptions,
		setBoundExeca,
		createNested
	}, ...execaArguments);
	if (setBoundExeca !== void 0) setBoundExeca(boundExeca, createNested, boundOptions);
	return boundExeca;
};
const callBoundExeca = ({ mapArguments, deepOptions = {}, boundOptions = {}, setBoundExeca, createNested }, firstArgument, ...nextArguments) => {
	if (isPlainObject(firstArgument)) return createNested(mapArguments, mergeOptions(boundOptions, firstArgument), setBoundExeca);
	const { file, commandArguments, options: options$1, isSync } = parseArguments({
		mapArguments,
		firstArgument,
		nextArguments,
		deepOptions,
		boundOptions
	});
	return isSync ? execaCoreSync(file, commandArguments, options$1) : execaCoreAsync(file, commandArguments, options$1, createNested);
};
const parseArguments = ({ mapArguments, firstArgument, nextArguments, deepOptions, boundOptions }) => {
	const [initialFile, initialArguments, initialOptions] = normalizeParameters(...isTemplateString(firstArgument) ? parseTemplates(firstArgument, nextArguments) : [firstArgument, ...nextArguments]);
	const mergedOptions = mergeOptions(mergeOptions(deepOptions, boundOptions), initialOptions);
	const { file = initialFile, commandArguments = initialArguments, options: options$1 = mergedOptions, isSync = false } = mapArguments({
		file: initialFile,
		commandArguments: initialArguments,
		options: mergedOptions
	});
	return {
		file,
		commandArguments,
		options: options$1,
		isSync
	};
};

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/command.js
const mapCommandAsync = ({ file, commandArguments }) => parseCommand(file, commandArguments);
const mapCommandSync = ({ file, commandArguments }) => ({
	...parseCommand(file, commandArguments),
	isSync: true
});
const parseCommand = (command, unusedArguments) => {
	if (unusedArguments.length > 0) throw new TypeError(`The command and its arguments must be passed as a single string: ${command} ${unusedArguments}.`);
	const [file, ...commandArguments] = parseCommandString(command);
	return {
		file,
		commandArguments
	};
};
const parseCommandString = (command) => {
	if (typeof command !== "string") throw new TypeError(`The command must be a string: ${String(command)}.`);
	const trimmedCommand = command.trim();
	if (trimmedCommand === "") return [];
	const tokens = [];
	for (const token of trimmedCommand.split(SPACES_REGEXP)) {
		const previousToken = tokens.at(-1);
		if (previousToken && previousToken.endsWith("\\")) tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		else tokens.push(token);
	}
	return tokens;
};
const SPACES_REGEXP = / +/g;

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/lib/methods/script.js
const setScriptSync = (boundExeca, createNested, boundOptions) => {
	boundExeca.sync = createNested(mapScriptSync, boundOptions);
	boundExeca.s = boundExeca.sync;
};
const mapScriptAsync = ({ options: options$1 }) => getScriptOptions(options$1);
const mapScriptSync = ({ options: options$1 }) => ({
	...getScriptOptions(options$1),
	isSync: true
});
const getScriptOptions = (options$1) => ({ options: {
	...getScriptStdinOption(options$1),
	...options$1
} });
const getScriptStdinOption = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {};
const deepScriptOptions = { preferLocal: true };

//#endregion
//#region ../../node_modules/.pnpm/execa@9.6.0/node_modules/execa/index.js
const execa = createExeca(() => ({}));
const execaSync = createExeca(() => ({ isSync: true }));
const execaCommand = createExeca(mapCommandAsync);
const execaCommandSync = createExeca(mapCommandSync);
const execaNode = createExeca(mapNode);
const $$3 = createExeca(mapScriptAsync, {}, deepScriptOptions, setScriptSync);
const { sendMessage, getOneMessage, getEachMessage, getCancelSignal } = getIpcExport();

//#endregion
//#region ../../node_modules/.pnpm/kolorist@1.8.0/node_modules/kolorist/dist/esm/index.mjs
let enabled = true;
const globalVar = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
/**
* Detect how much colors the current terminal supports
*/
let supportLevel = 0;
if (globalVar.process && globalVar.process.env && globalVar.process.stdout) {
	const { FORCE_COLOR: FORCE_COLOR$1, NODE_DISABLE_COLORS: NODE_DISABLE_COLORS$1, NO_COLOR, TERM: TERM$1, COLORTERM } = globalVar.process.env;
	if (NODE_DISABLE_COLORS$1 || NO_COLOR || FORCE_COLOR$1 === "0") enabled = false;
	else if (FORCE_COLOR$1 === "1" || FORCE_COLOR$1 === "2" || FORCE_COLOR$1 === "3") enabled = true;
	else if (TERM$1 === "dumb") enabled = false;
	else if ("CI" in globalVar.process.env && [
		"TRAVIS",
		"CIRCLECI",
		"APPVEYOR",
		"GITLAB_CI",
		"GITHUB_ACTIONS",
		"BUILDKITE",
		"DRONE"
	].some((vendor) => vendor in globalVar.process.env)) enabled = true;
	else enabled = process.stdout.isTTY;
	if (enabled) if (process.platform === "win32") supportLevel = 3;
	else if (COLORTERM && (COLORTERM === "truecolor" || COLORTERM === "24bit")) supportLevel = 3;
	else if (TERM$1 && (TERM$1.endsWith("-256color") || TERM$1.endsWith("256"))) supportLevel = 2;
	else supportLevel = 1;
}
let options = {
	enabled,
	supportLevel
};
function kolorist(start, end, level = 1) {
	const open = `\x1b[${start}m`;
	const close = `\x1b[${end}m`;
	const regex$2 = new RegExp(`\\x1b\\[${end}m`, "g");
	return (str) => {
		return options.enabled && options.supportLevel >= level ? open + ("" + str).replace(regex$2, open) + close : "" + str;
	};
}
const reset = kolorist(0, 0);
const bold = kolorist(1, 22);
const dim = kolorist(2, 22);
const italic = kolorist(3, 23);
const underline = kolorist(4, 24);
const inverse = kolorist(7, 27);
const hidden = kolorist(8, 28);
const strikethrough = kolorist(9, 29);
const black = kolorist(30, 39);
const red = kolorist(31, 39);
const green = kolorist(32, 39);
const yellow = kolorist(33, 39);
const blue = kolorist(34, 39);
const magenta = kolorist(35, 39);
const cyan = kolorist(36, 39);
const white = kolorist(97, 39);
const gray = kolorist(90, 39);
const lightGray = kolorist(37, 39);
const lightRed = kolorist(91, 39);
const lightGreen = kolorist(92, 39);
const lightYellow = kolorist(93, 39);
const lightBlue = kolorist(94, 39);
const lightMagenta = kolorist(95, 39);
const lightCyan = kolorist(96, 39);
const bgBlack = kolorist(40, 49);
const bgRed = kolorist(41, 49);
const bgGreen = kolorist(42, 49);
const bgYellow = kolorist(43, 49);
const bgBlue = kolorist(44, 49);
const bgMagenta = kolorist(45, 49);
const bgCyan = kolorist(46, 49);
const bgWhite = kolorist(107, 49);
const bgGray = kolorist(100, 49);
const bgLightRed = kolorist(101, 49);
const bgLightGreen = kolorist(102, 49);
const bgLightYellow = kolorist(103, 49);
const bgLightBlue = kolorist(104, 49);
const bgLightMagenta = kolorist(105, 49);
const bgLightCyan = kolorist(106, 49);
const bgLightGray = kolorist(47, 49);

//#endregion
//#region ../../node_modules/.pnpm/minimist@1.2.8/node_modules/minimist/index.js
var require_minimist = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/minimist@1.2.8/node_modules/minimist/index.js": ((exports, module) => {
	function hasKey(obj, keys) {
		var o$1 = obj;
		keys.slice(0, -1).forEach(function(key) {
			o$1 = o$1[key] || {};
		});
		return keys[keys.length - 1] in o$1;
	}
	function isNumber$2(x) {
		if (typeof x === "number") return true;
		if (/^0x[0-9a-f]+$/i.test(x)) return true;
		return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
	}
	function isConstructorOrProto(obj, key) {
		return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
	}
	module.exports = function(args, opts) {
		if (!opts) opts = {};
		var flags = {
			bools: {},
			strings: {},
			unknownFn: null
		};
		if (typeof opts.unknown === "function") flags.unknownFn = opts.unknown;
		if (typeof opts.boolean === "boolean" && opts.boolean) flags.allBools = true;
		else [].concat(opts.boolean).filter(Boolean).forEach(function(key$1) {
			flags.bools[key$1] = true;
		});
		var aliases = {};
		function aliasIsBoolean(key$1) {
			return aliases[key$1].some(function(x) {
				return flags.bools[x];
			});
		}
		Object.keys(opts.alias || {}).forEach(function(key$1) {
			aliases[key$1] = [].concat(opts.alias[key$1]);
			aliases[key$1].forEach(function(x) {
				aliases[x] = [key$1].concat(aliases[key$1].filter(function(y) {
					return x !== y;
				}));
			});
		});
		[].concat(opts.string).filter(Boolean).forEach(function(key$1) {
			flags.strings[key$1] = true;
			if (aliases[key$1]) [].concat(aliases[key$1]).forEach(function(k) {
				flags.strings[k] = true;
			});
		});
		var defaults = opts.default || {};
		var argv$1 = { _: [] };
		function argDefined(key$1, arg$1) {
			return flags.allBools && /^--[^=]+$/.test(arg$1) || flags.strings[key$1] || flags.bools[key$1] || aliases[key$1];
		}
		function setKey(obj, keys, value$1) {
			var o$1 = obj;
			for (var i$2 = 0; i$2 < keys.length - 1; i$2++) {
				var key$1 = keys[i$2];
				if (isConstructorOrProto(o$1, key$1)) return;
				if (o$1[key$1] === void 0) o$1[key$1] = {};
				if (o$1[key$1] === Object.prototype || o$1[key$1] === Number.prototype || o$1[key$1] === String.prototype) o$1[key$1] = {};
				if (o$1[key$1] === Array.prototype) o$1[key$1] = [];
				o$1 = o$1[key$1];
			}
			var lastKey = keys[keys.length - 1];
			if (isConstructorOrProto(o$1, lastKey)) return;
			if (o$1 === Object.prototype || o$1 === Number.prototype || o$1 === String.prototype) o$1 = {};
			if (o$1 === Array.prototype) o$1 = [];
			if (o$1[lastKey] === void 0 || flags.bools[lastKey] || typeof o$1[lastKey] === "boolean") o$1[lastKey] = value$1;
			else if (Array.isArray(o$1[lastKey])) o$1[lastKey].push(value$1);
			else o$1[lastKey] = [o$1[lastKey], value$1];
		}
		function setArg(key$1, val, arg$1) {
			if (arg$1 && flags.unknownFn && !argDefined(key$1, arg$1)) {
				if (flags.unknownFn(arg$1) === false) return;
			}
			var value$1 = !flags.strings[key$1] && isNumber$2(val) ? Number(val) : val;
			setKey(argv$1, key$1.split("."), value$1);
			(aliases[key$1] || []).forEach(function(x) {
				setKey(argv$1, x.split("."), value$1);
			});
		}
		Object.keys(flags.bools).forEach(function(key$1) {
			setArg(key$1, defaults[key$1] === void 0 ? false : defaults[key$1]);
		});
		var notFlags = [];
		if (args.indexOf("--") !== -1) {
			notFlags = args.slice(args.indexOf("--") + 1);
			args = args.slice(0, args.indexOf("--"));
		}
		for (var i$1 = 0; i$1 < args.length; i$1++) {
			var arg = args[i$1];
			var key;
			var next;
			if (/^--.+=/.test(arg)) {
				var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
				key = m[1];
				var value = m[2];
				if (flags.bools[key]) value = value !== "false";
				setArg(key, value, arg);
			} else if (/^--no-.+/.test(arg)) {
				key = arg.match(/^--no-(.+)/)[1];
				setArg(key, false, arg);
			} else if (/^--.+/.test(arg)) {
				key = arg.match(/^--(.+)/)[1];
				next = args[i$1 + 1];
				if (next !== void 0 && !/^(-|--)[^-]/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
					setArg(key, next, arg);
					i$1 += 1;
				} else if (/^(true|false)$/.test(next)) {
					setArg(key, next === "true", arg);
					i$1 += 1;
				} else setArg(key, flags.strings[key] ? "" : true, arg);
			} else if (/^-[^-]+/.test(arg)) {
				var letters = arg.slice(1, -1).split("");
				var broken = false;
				for (var j = 0; j < letters.length; j++) {
					next = arg.slice(j + 2);
					if (next === "-") {
						setArg(letters[j], next, arg);
						continue;
					}
					if (/[A-Za-z]/.test(letters[j]) && next[0] === "=") {
						setArg(letters[j], next.slice(1), arg);
						broken = true;
						break;
					}
					if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
						setArg(letters[j], next, arg);
						broken = true;
						break;
					}
					if (letters[j + 1] && letters[j + 1].match(/\W/)) {
						setArg(letters[j], arg.slice(j + 2), arg);
						broken = true;
						break;
					} else setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
				}
				key = arg.slice(-1)[0];
				if (!broken && key !== "-") if (args[i$1 + 1] && !/^(-|--)[^-]/.test(args[i$1 + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
					setArg(key, args[i$1 + 1], arg);
					i$1 += 1;
				} else if (args[i$1 + 1] && /^(true|false)$/.test(args[i$1 + 1])) {
					setArg(key, args[i$1 + 1] === "true", arg);
					i$1 += 1;
				} else setArg(key, flags.strings[key] ? "" : true, arg);
			} else {
				if (!flags.unknownFn || flags.unknownFn(arg) !== false) argv$1._.push(flags.strings._ || !isNumber$2(arg) ? arg : Number(arg));
				if (opts.stopEarly) {
					argv$1._.push.apply(argv$1._, args.slice(i$1 + 1));
					break;
				}
			}
		}
		Object.keys(defaults).forEach(function(k) {
			if (!hasKey(argv$1, k.split("."))) {
				setKey(argv$1, k.split("."), defaults[k]);
				(aliases[k] || []).forEach(function(x) {
					setKey(argv$1, x.split("."), defaults[k]);
				});
			}
		});
		if (opts["--"]) argv$1["--"] = notFlags.slice();
		else notFlags.forEach(function(k) {
			argv$1._.push(k);
		});
		return argv$1;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/kleur@3.0.3/node_modules/kleur/index.js
var require_kleur = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/kleur@3.0.3/node_modules/kleur/index.js": ((exports, module) => {
	const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
	const $$2 = {
		enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
		reset: init(0, 0),
		bold: init(1, 22),
		dim: init(2, 22),
		italic: init(3, 23),
		underline: init(4, 24),
		inverse: init(7, 27),
		hidden: init(8, 28),
		strikethrough: init(9, 29),
		black: init(30, 39),
		red: init(31, 39),
		green: init(32, 39),
		yellow: init(33, 39),
		blue: init(34, 39),
		magenta: init(35, 39),
		cyan: init(36, 39),
		white: init(37, 39),
		gray: init(90, 39),
		grey: init(90, 39),
		bgBlack: init(40, 49),
		bgRed: init(41, 49),
		bgGreen: init(42, 49),
		bgYellow: init(43, 49),
		bgBlue: init(44, 49),
		bgMagenta: init(45, 49),
		bgCyan: init(46, 49),
		bgWhite: init(47, 49)
	};
	function run(arr, str) {
		let i$1 = 0, tmp, beg = "", end = "";
		for (; i$1 < arr.length; i$1++) {
			tmp = arr[i$1];
			beg += tmp.open;
			end += tmp.close;
			if (str.includes(tmp.close)) str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
		return beg + str + end;
	}
	function chain(has, keys) {
		let ctx = {
			has,
			keys
		};
		ctx.reset = $$2.reset.bind(ctx);
		ctx.bold = $$2.bold.bind(ctx);
		ctx.dim = $$2.dim.bind(ctx);
		ctx.italic = $$2.italic.bind(ctx);
		ctx.underline = $$2.underline.bind(ctx);
		ctx.inverse = $$2.inverse.bind(ctx);
		ctx.hidden = $$2.hidden.bind(ctx);
		ctx.strikethrough = $$2.strikethrough.bind(ctx);
		ctx.black = $$2.black.bind(ctx);
		ctx.red = $$2.red.bind(ctx);
		ctx.green = $$2.green.bind(ctx);
		ctx.yellow = $$2.yellow.bind(ctx);
		ctx.blue = $$2.blue.bind(ctx);
		ctx.magenta = $$2.magenta.bind(ctx);
		ctx.cyan = $$2.cyan.bind(ctx);
		ctx.white = $$2.white.bind(ctx);
		ctx.gray = $$2.gray.bind(ctx);
		ctx.grey = $$2.grey.bind(ctx);
		ctx.bgBlack = $$2.bgBlack.bind(ctx);
		ctx.bgRed = $$2.bgRed.bind(ctx);
		ctx.bgGreen = $$2.bgGreen.bind(ctx);
		ctx.bgYellow = $$2.bgYellow.bind(ctx);
		ctx.bgBlue = $$2.bgBlue.bind(ctx);
		ctx.bgMagenta = $$2.bgMagenta.bind(ctx);
		ctx.bgCyan = $$2.bgCyan.bind(ctx);
		ctx.bgWhite = $$2.bgWhite.bind(ctx);
		return ctx;
	}
	function init(open, close) {
		let blk = {
			open: `\x1b[${open}m`,
			close: `\x1b[${close}m`,
			rgx: new RegExp(`\\x1b\\[${close}m`, "g")
		};
		return function(txt) {
			if (this !== void 0 && this.has !== void 0) {
				this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
				return txt === void 0 ? this : $$2.enabled ? run(this.keys, txt + "") : txt + "";
			}
			return txt === void 0 ? chain([open], [blk]) : $$2.enabled ? run([blk], txt + "") : txt + "";
		};
	}
	module.exports = $$2;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/action.js
var require_action$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/action.js": ((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/strip.js
var require_strip$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/strip.js": ((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js": ((exports, module) => {
	const ESC = "\x1B";
	const CSI = `${ESC}[`;
	const beep$2 = "\x07";
	const cursor$22 = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count$1 = 1) => `${CSI}${count$1}A`,
		down: (count$1 = 1) => `${CSI}${count$1}B`,
		forward: (count$1 = 1) => `${CSI}${count$1}C`,
		backward: (count$1 = 1) => `${CSI}${count$1}D`,
		nextLine: (count$1 = 1) => `${CSI}E`.repeat(count$1),
		prevLine: (count$1 = 1) => `${CSI}F`.repeat(count$1),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	const scroll = {
		up: (count$1 = 1) => `${CSI}S`.repeat(count$1),
		down: (count$1 = 1) => `${CSI}T`.repeat(count$1)
	};
	const erase$14 = {
		screen: `${CSI}2J`,
		up: (count$1 = 1) => `${CSI}1J`.repeat(count$1),
		down: (count$1 = 1) => `${CSI}J`.repeat(count$1),
		line: `${CSI}2K`,
		lineEnd: `${CSI}K`,
		lineStart: `${CSI}1K`,
		lines(count$1) {
			let clear$18 = "";
			for (let i$1 = 0; i$1 < count$1; i$1++) clear$18 += this.line + (i$1 < count$1 - 1 ? cursor$22.up() : "");
			if (count$1) clear$18 += cursor$22.left;
			return clear$18;
		}
	};
	module.exports = {
		cursor: cursor$22,
		scroll,
		erase: erase$14,
		beep: beep$2
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/clear.js
var require_clear$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/clear.js": ((exports, module) => {
	function _createForOfIteratorHelper$1(o$1, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o$1[Symbol.iterator] || o$1["@@iterator"];
		if (!it) {
			if (Array.isArray(o$1) || (it = _unsupportedIterableToArray$1(o$1)) || allowArrayLike && o$1 && typeof o$1.length === "number") {
				if (it) o$1 = it;
				var i$1 = 0;
				var F = function F$1() {};
				return {
					s: F,
					n: function n$1() {
						if (i$1 >= o$1.length) return { done: true };
						return {
							done: false,
							value: o$1[i$1++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o$1);
			},
			n: function n$1() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray$1(o$1, minLen) {
		if (!o$1) return;
		if (typeof o$1 === "string") return _arrayLikeToArray$1(o$1, minLen);
		var n$1 = Object.prototype.toString.call(o$1).slice(8, -1);
		if (n$1 === "Object" && o$1.constructor) n$1 = o$1.constructor.name;
		if (n$1 === "Map" || n$1 === "Set") return Array.from(o$1);
		if (n$1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$1)) return _arrayLikeToArray$1(o$1, minLen);
	}
	function _arrayLikeToArray$1(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i$1 = 0, arr2 = new Array(len); i$1 < len; i$1++) arr2[i$1] = arr[i$1];
		return arr2;
	}
	const strip$3 = require_strip$1();
	const _require$7 = require_src(), erase$13 = _require$7.erase, cursor$21 = _require$7.cursor;
	const width$1 = (str) => [...strip$3(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt$2, perLine) {
		if (!perLine) return erase$13.line + cursor$21.to(0);
		let rows = 0;
		var _iterator = _createForOfIteratorHelper$1(prompt$2.split(/\r?\n/)), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				let line = _step.value;
				rows += 1 + Math.floor(Math.max(width$1(line) - 1, 0) / perLine);
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		return erase$13.lines(rows);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/figures.js
var require_figures$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/figures.js": ((exports, module) => {
	const main$1 = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win$1 = {
		arrowUp: main$1.arrowUp,
		arrowDown: main$1.arrowDown,
		arrowLeft: main$1.arrowLeft,
		arrowRight: main$1.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	const figures$17 = process.platform === "win32" ? win$1 : main$1;
	module.exports = figures$17;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/style.js
var require_style$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/style.js": ((exports, module) => {
	const c$1 = require_kleur();
	const figures$16 = require_figures$1();
	const styles$1 = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render$1 = (type) => styles$1[type] || styles$1.default;
	const symbols$1 = Object.freeze({
		aborted: c$1.red(figures$16.cross),
		done: c$1.green(figures$16.tick),
		exited: c$1.yellow(figures$16.cross),
		default: c$1.cyan("?")
	});
	const symbol$1 = (done, aborted$1, exited) => aborted$1 ? symbols$1.aborted : exited ? symbols$1.exited : done ? symbols$1.done : symbols$1.default;
	const delimiter$1 = (completing) => c$1.gray(completing ? figures$16.ellipsis : figures$16.pointerSmall);
	const item$1 = (expandable, expanded) => c$1.gray(expandable ? expanded ? figures$16.pointerSmall : "+" : figures$16.line);
	module.exports = {
		styles: styles$1,
		render: render$1,
		symbols: symbols$1,
		symbol: symbol$1,
		delimiter: delimiter$1,
		item: item$1
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/lines.js
var require_lines$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/lines.js": ((exports, module) => {
	const strip$2 = require_strip$1();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines$4 = String(strip$2(msg) || "").split(/\r?\n/);
		if (!perLine) return lines$4.length;
		return lines$4.map((l) => Math.ceil(l.length / perLine)).reduce((a$1, b) => a$1 + b);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/wrap.js
var require_wrap$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/wrap.js": ((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width$2 = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width$2 || arr[arr.length - 1].length + w.length + 1 < width$2) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/entriesToDisplay.js": ((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor$23, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor$23 - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/index.js
var require_util$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/index.js": ((exports, module) => {
	module.exports = {
		action: require_action$1(),
		clear: require_clear$1(),
		style: require_style$1(),
		strip: require_strip$1(),
		figures: require_figures$1(),
		lines: require_lines$1(),
		wrap: require_wrap$1(),
		entriesToDisplay: require_entriesToDisplay$1()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/prompt.js
var require_prompt$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/prompt.js": ((exports, module) => {
	const readline$1 = __require("readline");
	const action$1 = require_util$1().action;
	const EventEmitter$2 = __require("events");
	const _require2$8 = require_src(), beep$1 = _require2$8.beep, cursor$20 = _require2$8.cursor;
	const color$19 = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt$17 = class extends EventEmitter$2 {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline$1.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline$1.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a$1 = action$1(key, isSelect);
				if (a$1 === false) this._ && this._(str, key);
				else if (typeof this[a$1] === "function") this[a$1](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor$20.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep$1);
		}
		render() {
			this.onRender(color$19);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt$17;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/text.js
var require_text$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/text.js": ((exports, module) => {
	function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator$4(fn) {
		return function() {
			var self$1 = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self$1, args);
				function _next(value) {
					asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color$18 = require_kleur();
	const Prompt$16 = require_prompt$1();
	const _require$6 = require_src(), erase$12 = _require$6.erase, cursor$19 = _require$6.cursor;
	const _require2$7 = require_util$1(), style$17 = _require2$7.style, clear$17 = _require2$7.clear, lines$3 = _require2$7.lines, figures$15 = _require2$7.figures;
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt$1 = class extends Prompt$16 {
		constructor(opts = {}) {
			super(opts);
			this.transform = style$17.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear$17(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color$18.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator$4(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator$4(function* () {
				_this2.value = _this2.value || _this2.initial;
				_this2.cursorOffset = 0;
				_this2.cursor = _this2.rendered.length;
				yield _this2.validate();
				if (_this2.error) {
					_this2.red = true;
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n$1) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n$1;
			this.cursorOffset += n$1;
		}
		_(c$3, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c$3}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor$19.down(lines$3(this.outputError, this.out.columns) - 1) + clear$17(this.outputError, this.out.columns));
				this.out.write(clear$17(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style$17.symbol(this.done, this.aborted),
				color$18.bold(this.msg),
				style$17.delimiter(this.done),
				this.red ? color$18.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? " " : figures$15.pointerSmall} ${color$18.red().italic(l)}`, ``);
			this.out.write(erase$12.line + cursor$19.to(0) + this.outputText + cursor$19.save + this.outputError + cursor$19.restore + cursor$19.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/select.js
var require_select$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/select.js": ((exports, module) => {
	const color$17 = require_kleur();
	const Prompt$15 = require_prompt$1();
	const _require$5 = require_util$1(), style$16 = _require$5.style, clear$16 = _require$5.clear, figures$14 = _require$5.figures, wrap$5 = _require$5.wrap, entriesToDisplay$5 = _require$5.entriesToDisplay;
	const cursor$18 = require_src().cursor;
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt$1 = class extends Prompt$15 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear$16("", this.out.columns);
			this.render();
		}
		moveCursor(n$1) {
			this.cursor = n$1;
			this.value = this.choices[n$1].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$18.hide);
			else this.out.write(clear$16(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay$5(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style$16.symbol(this.done, this.aborted),
				color$17.bold(this.msg),
				style$16.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color$17.yellow(this.warn) : color$17.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i$1 = startIndex; i$1 < endIndex; i$1++) {
					let title, prefix, desc = "", v = this.choices[i$1];
					if (i$1 === startIndex && startIndex > 0) prefix = figures$14.arrowUp;
					else if (i$1 === endIndex - 1 && endIndex < this.choices.length) prefix = figures$14.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i$1 ? color$17.gray().underline(v.title) : color$17.strikethrough().gray(v.title);
						prefix = (this.cursor === i$1 ? color$17.bold().gray(figures$14.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i$1 ? color$17.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i$1 ? color$17.cyan(figures$14.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i$1) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap$5(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color$17.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/toggle.js
var require_toggle$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/toggle.js": ((exports, module) => {
	const color$16 = require_kleur();
	const Prompt$14 = require_prompt$1();
	const _require$4 = require_util$1(), style$15 = _require$4.style, clear$15 = _require$4.clear;
	const _require2$6 = require_src(), cursor$17 = _require2$6.cursor, erase$11 = _require2$6.erase;
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt$1 = class extends Prompt$14 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") this.value = !this.value;
			else if (c$3 === "1") this.value = true;
			else if (c$3 === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$17.hide);
			else this.out.write(clear$15(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style$15.symbol(this.done, this.aborted),
				color$16.bold(this.msg),
				style$15.delimiter(this.done),
				this.value ? this.inactive : color$16.cyan().underline(this.inactive),
				color$16.gray("/"),
				this.value ? color$16.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase$11.line + cursor$17.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/datepart.js
var require_datepart$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/datepart.js": ((exports, module) => {
	var DatePart$19 = class DatePart$19 {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$19);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$19);
		}
		toString() {
			return String(this.date);
		}
	};
	module.exports = DatePart$19;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/meridiem.js": ((exports, module) => {
	const DatePart$18 = require_datepart$1();
	var Meridiem$3 = class extends DatePart$18 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/day.js
var require_day$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/day.js": ((exports, module) => {
	const DatePart$17 = require_datepart$1();
	const pos$1 = (n$1) => {
		n$1 = n$1 % 10;
		return n$1 === 1 ? "st" : n$1 === 2 ? "nd" : n$1 === 3 ? "rd" : "th";
	};
	var Day$3 = class extends DatePart$17 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos$1(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/hours.js
var require_hours$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/hours.js": ((exports, module) => {
	const DatePart$16 = require_datepart$1();
	var Hours$3 = class extends DatePart$16 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/milliseconds.js": ((exports, module) => {
	const DatePart$15 = require_datepart$1();
	var Milliseconds$3 = class extends DatePart$15 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/minutes.js
var require_minutes$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/minutes.js": ((exports, module) => {
	const DatePart$14 = require_datepart$1();
	var Minutes$3 = class extends DatePart$14 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/month.js
var require_month$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/month.js": ((exports, module) => {
	const DatePart$13 = require_datepart$1();
	var Month$3 = class extends DatePart$13 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/seconds.js
var require_seconds$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/seconds.js": ((exports, module) => {
	const DatePart$12 = require_datepart$1();
	var Seconds$3 = class extends DatePart$12 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/year.js
var require_year$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/year.js": ((exports, module) => {
	const DatePart$11 = require_datepart$1();
	var Year$3 = class extends DatePart$11 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/index.js
var require_dateparts$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/index.js": ((exports, module) => {
	module.exports = {
		DatePart: require_datepart$1(),
		Meridiem: require_meridiem$1(),
		Day: require_day$1(),
		Hours: require_hours$1(),
		Milliseconds: require_milliseconds$1(),
		Minutes: require_minutes$1(),
		Month: require_month$1(),
		Seconds: require_seconds$1(),
		Year: require_year$1()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/date.js
var require_date$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/date.js": ((exports, module) => {
	function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator$3(fn) {
		return function() {
			var self$1 = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self$1, args);
				function _next(value) {
					asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color$15 = require_kleur();
	const Prompt$13 = require_prompt$1();
	const _require$3 = require_util$1(), style$14 = _require$3.style, clear$14 = _require$3.clear, figures$13 = _require$3.figures;
	const _require2$5 = require_src(), erase$10 = _require2$5.erase, cursor$16 = _require2$5.cursor;
	const _require3 = require_dateparts$1(), DatePart$10 = _require3.DatePart, Meridiem$2 = _require3.Meridiem, Day$2 = _require3.Day, Hours$2 = _require3.Hours, Milliseconds$2 = _require3.Milliseconds, Minutes$2 = _require3.Minutes, Month$2 = _require3.Month, Seconds$2 = _require3.Seconds, Year$2 = _require3.Year;
	const regex$1 = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups$1 = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day$2(opts),
		3: (opts) => new Month$2(opts),
		4: (opts) => new Year$2(opts),
		5: (opts) => new Meridiem$2(opts),
		6: (opts) => new Hours$2(opts),
		7: (opts) => new Minutes$2(opts),
		8: (opts) => new Seconds$2(opts),
		9: (opts) => new Milliseconds$2(opts)
	};
	const dfltLocales$1 = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt$1 = class extends Prompt$13 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales$1, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear$14("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex$1.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups$1 ? regexGroups$1[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i$1) => {
				if (typeof i$1 === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i$1;
				else arr.push(i$1);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n$1) {
			this.typed = "";
			this.cursor = n$1;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart$10));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator$3(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === "string") {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator$3(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = "red";
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart$10));
			this.render();
		}
		_(c$3) {
			if (/\d/.test(c$3)) {
				this.typed += c$3;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$16.hide);
			else this.out.write(clear$14(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style$14.symbol(this.done, this.aborted),
				color$15.bold(this.msg),
				style$14.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color$15.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? ` ` : figures$13.pointerSmall} ${color$15.red().italic(l)}`, ``);
			this.out.write(erase$10.line + cursor$16.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/number.js
var require_number$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/number.js": ((exports, module) => {
	function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator$2(fn) {
		return function() {
			var self$1 = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self$1, args);
				function _next(value) {
					asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color$14 = require_kleur();
	const Prompt$12 = require_prompt$1();
	const _require$2 = require_src(), cursor$15 = _require$2.cursor, erase$9 = _require$2.erase;
	const _require2$4 = require_util$1(), style$13 = _require2$4.style, figures$12 = _require2$4.figures, clear$13 = _require2$4.clear, lines$2 = _require2$4.lines;
	const isNumber$1 = /[0-9]/;
	const isDef$1 = (any) => any !== void 0;
	const round$1 = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt$1 = class extends Prompt$12 {
		constructor(opts = {}) {
			super(opts);
			this.transform = style$13.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef$1(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef$1(opts.min) ? opts.min : -Infinity;
			this.max = isDef$1(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color$14.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round$1(v, this.round)}`);
				this._value = round$1(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c$3) {
			return c$3 === `-` || c$3 === `.` && this.float || isNumber$1.test(c$3);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator$2(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator$2(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = `red`;
					_this2.fire();
					_this2.render();
					return;
				}
				let x = _this2.value;
				_this2.value = x !== `` ? x : _this2.initial;
				_this2.done = true;
				_this2.aborted = false;
				_this2.error = false;
				_this2.fire();
				_this2.render();
				_this2.out.write(`\n`);
				_this2.close();
			})();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c$3, key) {
			if (!this.valid(c$3)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c$3;
			this.lastHit = now;
			this.color = `cyan`;
			if (c$3 === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor$15.down(lines$2(this.outputError, this.out.columns) - 1) + clear$13(this.outputError, this.out.columns));
				this.out.write(clear$13(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style$13.symbol(this.done, this.aborted),
				color$14.bold(this.msg),
				style$13.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color$14[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? ` ` : figures$12.pointerSmall} ${color$14.red().italic(l)}`, ``);
			this.out.write(erase$9.line + cursor$15.to(0) + this.outputText + cursor$15.save + this.outputError + cursor$15.restore);
		}
	};
	module.exports = NumberPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/multiselect.js
var require_multiselect$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/multiselect.js": ((exports, module) => {
	const color$13 = require_kleur();
	const cursor$14 = require_src().cursor;
	const Prompt$11 = require_prompt$1();
	const _require2$3 = require_util$1(), clear$12 = _require2$3.clear, figures$11 = _require2$3.figures, style$12 = _require2$3.style, wrap$4 = _require2$3.wrap, entriesToDisplay$4 = _require2$3.entriesToDisplay;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt$3 = class extends Prompt$11 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear$12("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") this.handleSpaceToggle();
			else if (c$3 === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures$11.arrowUp}/${figures$11.arrowDown}: Highlight option\n    ${figures$11.arrowLeft}/${figures$11.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor$23, v, i$1, arrowIndicator) {
			const prefix = (v.selected ? color$13.green(figures$11.radioOn) : figures$11.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor$23 === i$1 ? color$13.gray().underline(v.title) : color$13.strikethrough().gray(v.title);
			else {
				title = cursor$23 === i$1 ? color$13.cyan().underline(v.title) : v.title;
				if (cursor$23 === i$1 && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap$4(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color$13.gray(desc || "");
		}
		paginateOptions(options$1) {
			if (options$1.length === 0) return color$13.red("No matches for this query.");
			let _entriesToDisplay = entriesToDisplay$4(this.cursor, options$1.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			let prefix, styledOptions = [];
			for (let i$1 = startIndex; i$1 < endIndex; i$1++) {
				if (i$1 === startIndex && startIndex > 0) prefix = figures$11.arrowUp;
				else if (i$1 === endIndex - 1 && endIndex < options$1.length) prefix = figures$11.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options$1[i$1], i$1, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options$1) {
			if (!this.done) return this.paginateOptions(options$1);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color$13.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color$13.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$14.hide);
			super.render();
			let prompt$2 = [
				style$12.symbol(this.done, this.aborted),
				color$13.bold(this.msg),
				style$12.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt$2 += color$13.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt$2 += this.renderOptions(this.value);
			this.out.write(this.clear + prompt$2);
			this.clear = clear$12(prompt$2, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt$3;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocomplete.js": ((exports, module) => {
	function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator$1(fn) {
		return function() {
			var self$1 = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self$1, args);
				function _next(value) {
					asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color$12 = require_kleur();
	const Prompt$10 = require_prompt$1();
	const _require$1 = require_src(), erase$8 = _require$1.erase, cursor$13 = _require$1.cursor;
	const _require2$2 = require_util$1(), style$11 = _require2$2.style, clear$11 = _require2$2.clear, figures$10 = _require2$2.figures, wrap$3 = _require2$2.wrap, entriesToDisplay$3 = _require2$2.entriesToDisplay;
	const getVal$1 = (arr, i$1) => arr[i$1] && (arr[i$1].value || arr[i$1].title || arr[i$1]);
	const getTitle$1 = (arr, i$1) => arr[i$1] && (arr[i$1].title || arr[i$1].value || arr[i$1]);
	const getIndex$1 = (arr, valOrTitle) => {
		const index = arr.findIndex((el$2) => el$2.value === valOrTitle || el$2.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt$1 = class extends Prompt$10 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex$1(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style$11.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear$11("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i$1) {
			this.select = i$1;
			if (this.suggestions.length > 0) this.value = getVal$1(this.suggestions, i$1);
			else this.value = this.fallback.value;
			this.fire();
		}
		complete(cb) {
			var _this = this;
			return _asyncToGenerator$1(function* () {
				const p = _this.completing = _this.suggest(_this.input, _this.choices);
				const suggestions = yield p;
				if (_this.completing !== p) return;
				_this.suggestions = suggestions.map((s, i$1, arr) => ({
					title: getTitle$1(arr, i$1),
					value: getVal$1(arr, i$1),
					description: s.description
				}));
				_this.completing = false;
				const l = Math.max(suggestions.length - 1, 0);
				_this.moveSelect(Math.min(l, _this.select));
				cb && cb();
			})();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c$3, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c$3}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures$10.arrowUp : isEnd ? figures$10.arrowDown : " ";
			let title = hovered ? color$12.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color$12.cyan(figures$10.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap$3(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color$12.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$13.hide);
			else this.out.write(clear$11(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay$3(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style$11.symbol(this.done, this.aborted, this.exited),
				color$12.bold(this.msg),
				style$11.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item$2, i$1) => this.renderOption(item$2, this.select === i$1 + startIndex, i$1 === 0 && startIndex > 0, i$1 + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color$12.gray(this.fallback.title));
			}
			this.out.write(erase$8.line + cursor$13.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocompleteMultiselect.js": ((exports, module) => {
	const color$11 = require_kleur();
	const cursor$12 = require_src().cursor;
	const MultiselectPrompt$2 = require_multiselect$1();
	const _require2$1 = require_util$1(), clear$10 = _require2$1.clear, style$10 = _require2$1.style, figures$9 = _require2$1.figures;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt$1 = class extends MultiselectPrompt$2 {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear$10("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c$3) {
			this.inputValue = this.inputValue + c$3;
			this.updateFilteredOptions();
		}
		_(c$3, key) {
			if (c$3 === " ") this.handleSpaceToggle();
			else this.handleInputChange(c$3);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures$9.arrowUp}/${figures$9.arrowDown}: Highlight option
    ${figures$9.arrowLeft}/${figures$9.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color$11.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor$23, v, i$1) {
			let title;
			if (v.disabled) title = cursor$23 === i$1 ? color$11.gray().underline(v.title) : color$11.strikethrough().gray(v.title);
			else title = cursor$23 === i$1 ? color$11.cyan().underline(v.title) : v.title;
			return (v.selected ? color$11.green(figures$9.radioOn) : figures$9.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color$11.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color$11.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$12.hide);
			super.render();
			let prompt$2 = [
				style$10.symbol(this.done, this.aborted),
				color$11.bold(this.msg),
				style$10.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt$2 += color$11.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt$2 += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt$2);
			this.clear = clear$10(prompt$2, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/confirm.js
var require_confirm$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/confirm.js": ((exports, module) => {
	const color$10 = require_kleur();
	const Prompt$9 = require_prompt$1();
	const _require = require_util$1(), style$9 = _require.style, clear$9 = _require.clear;
	const _require2 = require_src(), erase$7 = _require2.erase, cursor$11 = _require2.cursor;
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt$1 = class extends Prompt$9 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c$3, key) {
			if (c$3.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c$3.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$11.hide);
			else this.out.write(clear$9(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style$9.symbol(this.done, this.aborted),
				color$10.bold(this.msg),
				style$9.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color$10.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase$7.line + cursor$11.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/index.js
var require_elements$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/index.js": ((exports, module) => {
	module.exports = {
		TextPrompt: require_text$1(),
		SelectPrompt: require_select$1(),
		TogglePrompt: require_toggle$1(),
		DatePrompt: require_date$1(),
		NumberPrompt: require_number$1(),
		MultiselectPrompt: require_multiselect$1(),
		AutocompletePrompt: require_autocomplete$1(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect$1(),
		ConfirmPrompt: require_confirm$1()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/prompts.js
var require_prompts$2 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/prompts.js": ((exports) => {
	const $$1 = exports;
	const el$1 = require_elements$1();
	const noop$3 = (v) => v;
	function toPrompt$1(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el$1[type](args);
			const onAbort = opts.onAbort || noop$3;
			const onSubmit = opts.onSubmit || noop$3;
			const onExit$1 = opts.onExit || noop$3;
			p.on("state", args.onState || noop$3);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit$1(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.text = (args) => toPrompt$1("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.password = (args) => {
		args.style = "password";
		return $$1.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.invisible = (args) => {
		args.style = "invisible";
		return $$1.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.number = (args) => toPrompt$1("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.date = (args) => toPrompt$1("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.confirm = (args) => toPrompt$1("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$$1.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt$1("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.toggle = (args) => toPrompt$1("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.select = (args) => toPrompt$1("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item$2) => item$2.selected).map((item$2) => item$2.value);
		return toPrompt$1("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$$1.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item$2) => item$2.selected).map((item$2) => item$2.value);
		return toPrompt$1("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle$1 = (input, choices) => Promise.resolve(choices.filter((item$2) => item$2.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$$1.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle$1;
		args.choices = [].concat(args.choices || []);
		return toPrompt$1("AutocompletePrompt", args);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/index.js
var require_dist = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/index.js": ((exports, module) => {
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols$2 = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols$2 = symbols$2.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols$2);
		}
		return keys;
	}
	function _objectSpread(target) {
		for (var i$1 = 1; i$1 < arguments.length; i$1++) {
			var source = arguments[i$1] != null ? arguments[i$1] : {};
			if (i$1 % 2) ownKeys(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function _createForOfIteratorHelper(o$1, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o$1[Symbol.iterator] || o$1["@@iterator"];
		if (!it) {
			if (Array.isArray(o$1) || (it = _unsupportedIterableToArray(o$1)) || allowArrayLike && o$1 && typeof o$1.length === "number") {
				if (it) o$1 = it;
				var i$1 = 0;
				var F = function F$1() {};
				return {
					s: F,
					n: function n$1() {
						if (i$1 >= o$1.length) return { done: true };
						return {
							done: false,
							value: o$1[i$1++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o$1);
			},
			n: function n$1() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o$1, minLen) {
		if (!o$1) return;
		if (typeof o$1 === "string") return _arrayLikeToArray(o$1, minLen);
		var n$1 = Object.prototype.toString.call(o$1).slice(8, -1);
		if (n$1 === "Object" && o$1.constructor) n$1 = o$1.constructor.name;
		if (n$1 === "Map" || n$1 === "Set") return Array.from(o$1);
		if (n$1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$1)) return _arrayLikeToArray(o$1, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i$1 = 0, arr2 = new Array(len); i$1 < len; i$1++) arr2[i$1] = arr[i$1];
		return arr2;
	}
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self$1 = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self$1, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const prompts$2 = require_prompts$2();
	const passOn$1 = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop$2 = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	function prompt$1() {
		return _prompt.apply(this, arguments);
	}
	function _prompt() {
		_prompt = _asyncToGenerator(function* (questions = [], { onSubmit = noop$2, onCancel = noop$2 } = {}) {
			const answers = {};
			const override$2 = prompt$1._override || {};
			questions = [].concat(questions);
			let answer, question, quit, name, type, lastPrompt;
			const getFormattedAnswer = /* @__PURE__ */ function() {
				var _ref = _asyncToGenerator(function* (question$1, answer$1, skipValidation = false) {
					if (!skipValidation && question$1.validate && question$1.validate(answer$1) !== true) return;
					return question$1.format ? yield question$1.format(answer$1, answers) : answer$1;
				});
				return function getFormattedAnswer$1(_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}();
			var _iterator = _createForOfIteratorHelper(questions), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					question = _step.value;
					var _question = question;
					name = _question.name;
					type = _question.type;
					if (typeof type === "function") {
						type = yield type(answer, _objectSpread({}, answers), question);
						question["type"] = type;
					}
					if (!type) continue;
					for (let key in question) {
						if (passOn$1.includes(key)) continue;
						let value = question[key];
						question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
					}
					lastPrompt = question;
					if (typeof question.message !== "string") throw new Error("prompt message is required");
					var _question2 = question;
					name = _question2.name;
					type = _question2.type;
					if (prompts$2[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
					if (override$2[question.name] !== void 0) {
						answer = yield getFormattedAnswer(question, override$2[question.name]);
						if (answer !== void 0) {
							answers[name] = answer;
							continue;
						}
					}
					try {
						answer = prompt$1._injected ? getInjectedAnswer$1(prompt$1._injected, question.initial) : yield prompts$2[type](question);
						answers[name] = answer = yield getFormattedAnswer(question, answer, true);
						quit = yield onSubmit(question, answer, answers);
					} catch (err) {
						quit = !(yield onCancel(question, answers));
					}
					if (quit) return answers;
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			return answers;
		});
		return _prompt.apply(this, arguments);
	}
	function getInjectedAnswer$1(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject$1(answers) {
		prompt$1._injected = (prompt$1._injected || []).concat(answers);
	}
	function override$1(answers) {
		prompt$1._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt$1, {
		prompt: prompt$1,
		prompts: prompts$2,
		inject: inject$1,
		override: override$1
	});
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/action.js
var require_action = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/action.js": ((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/strip.js
var require_strip = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/strip.js": ((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/clear.js
var require_clear = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/clear.js": ((exports, module) => {
	const strip$1 = require_strip();
	const { erase: erase$6, cursor: cursor$10 } = require_src();
	const width = (str) => [...strip$1(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt$2, perLine) {
		if (!perLine) return erase$6.line + cursor$10.to(0);
		let rows = 0;
		const lines$4 = prompt$2.split(/\r?\n/);
		for (let line of lines$4) rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
		return erase$6.lines(rows);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js
var require_figures = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js": ((exports, module) => {
	const main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	const figures$8 = process.platform === "win32" ? win : main;
	module.exports = figures$8;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/style.js
var require_style = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/style.js": ((exports, module) => {
	const c = require_kleur();
	const figures$7 = require_figures();
	const styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render = (type) => styles[type] || styles.default;
	const symbols = Object.freeze({
		aborted: c.red(figures$7.cross),
		done: c.green(figures$7.tick),
		exited: c.yellow(figures$7.cross),
		default: c.cyan("?")
	});
	const symbol = (done, aborted$1, exited) => aborted$1 ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	const delimiter = (completing) => c.gray(completing ? figures$7.ellipsis : figures$7.pointerSmall);
	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures$7.pointerSmall : "+" : figures$7.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/lines.js
var require_lines = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/lines.js": ((exports, module) => {
	const strip = require_strip();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines$4 = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines$4.length;
		return lines$4.map((l) => Math.ceil(l.length / perLine)).reduce((a$1, b) => a$1 + b);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/wrap.js
var require_wrap = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/wrap.js": ((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width$2 = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width$2 || arr[arr.length - 1].length + w.length + 1 < width$2) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/entriesToDisplay.js": ((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor$23, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor$23 - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/index.js
var require_util = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/index.js": ((exports, module) => {
	module.exports = {
		action: require_action(),
		clear: require_clear(),
		style: require_style(),
		strip: require_strip(),
		figures: require_figures(),
		lines: require_lines(),
		wrap: require_wrap(),
		entriesToDisplay: require_entriesToDisplay()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/prompt.js
var require_prompt = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/prompt.js": ((exports, module) => {
	const readline = __require("readline");
	const { action } = require_util();
	const EventEmitter$1 = __require("events");
	const { beep, cursor: cursor$9 } = require_src();
	const color$9 = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt$8 = class extends EventEmitter$1 {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a$1 = action(key, isSelect);
				if (a$1 === false) this._ && this._(str, key);
				else if (typeof this[a$1] === "function") this[a$1](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor$9.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color$9);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt$8;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/text.js
var require_text = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/text.js": ((exports, module) => {
	const color$8 = require_kleur();
	const Prompt$7 = require_prompt();
	const { erase: erase$5, cursor: cursor$8 } = require_src();
	const { style: style$8, clear: clear$8, lines: lines$1, figures: figures$6 } = require_util();
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt$7 {
		constructor(opts = {}) {
			super(opts);
			this.transform = style$8.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear$8(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color$8.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			this.value = this.value || this.initial;
			this.cursorOffset = 0;
			this.cursor = this.rendered.length;
			await this.validate();
			if (this.error) {
				this.red = true;
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n$1) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n$1;
			this.cursorOffset += n$1;
		}
		_(c$3, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c$3}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor$8.down(lines$1(this.outputError, this.out.columns) - 1) + clear$8(this.outputError, this.out.columns));
				this.out.write(clear$8(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style$8.symbol(this.done, this.aborted),
				color$8.bold(this.msg),
				style$8.delimiter(this.done),
				this.red ? color$8.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? " " : figures$6.pointerSmall} ${color$8.red().italic(l)}`, ``);
			this.out.write(erase$5.line + cursor$8.to(0) + this.outputText + cursor$8.save + this.outputError + cursor$8.restore + cursor$8.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/select.js
var require_select = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/select.js": ((exports, module) => {
	const color$7 = require_kleur();
	const Prompt$6 = require_prompt();
	const { style: style$7, clear: clear$7, figures: figures$5, wrap: wrap$2, entriesToDisplay: entriesToDisplay$2 } = require_util();
	const { cursor: cursor$7 } = require_src();
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt$6 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear$7("", this.out.columns);
			this.render();
		}
		moveCursor(n$1) {
			this.cursor = n$1;
			this.value = this.choices[n$1].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$7.hide);
			else this.out.write(clear$7(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay$2(this.cursor, this.choices.length, this.optionsPerPage);
			this.outputText = [
				style$7.symbol(this.done, this.aborted),
				color$7.bold(this.msg),
				style$7.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color$7.yellow(this.warn) : color$7.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i$1 = startIndex; i$1 < endIndex; i$1++) {
					let title, prefix, desc = "", v = this.choices[i$1];
					if (i$1 === startIndex && startIndex > 0) prefix = figures$5.arrowUp;
					else if (i$1 === endIndex - 1 && endIndex < this.choices.length) prefix = figures$5.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i$1 ? color$7.gray().underline(v.title) : color$7.strikethrough().gray(v.title);
						prefix = (this.cursor === i$1 ? color$7.bold().gray(figures$5.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i$1 ? color$7.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i$1 ? color$7.cyan(figures$5.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i$1) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap$2(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color$7.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/toggle.js
var require_toggle = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/toggle.js": ((exports, module) => {
	const color$6 = require_kleur();
	const Prompt$5 = require_prompt();
	const { style: style$6, clear: clear$6 } = require_util();
	const { cursor: cursor$6, erase: erase$4 } = require_src();
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt$5 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") this.value = !this.value;
			else if (c$3 === "1") this.value = true;
			else if (c$3 === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$6.hide);
			else this.out.write(clear$6(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style$6.symbol(this.done, this.aborted),
				color$6.bold(this.msg),
				style$6.delimiter(this.done),
				this.value ? this.inactive : color$6.cyan().underline(this.inactive),
				color$6.gray("/"),
				this.value ? color$6.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase$4.line + cursor$6.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/datepart.js
var require_datepart = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/datepart.js": ((exports, module) => {
	var DatePart$9 = class DatePart$9 {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$9);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$9);
		}
		toString() {
			return String(this.date);
		}
	};
	module.exports = DatePart$9;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/meridiem.js": ((exports, module) => {
	const DatePart$8 = require_datepart();
	var Meridiem$1 = class extends DatePart$8 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/day.js
var require_day = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/day.js": ((exports, module) => {
	const DatePart$7 = require_datepart();
	const pos = (n$1) => {
		n$1 = n$1 % 10;
		return n$1 === 1 ? "st" : n$1 === 2 ? "nd" : n$1 === 3 ? "rd" : "th";
	};
	var Day$1 = class extends DatePart$7 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/hours.js
var require_hours = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/hours.js": ((exports, module) => {
	const DatePart$6 = require_datepart();
	var Hours$1 = class extends DatePart$6 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/milliseconds.js": ((exports, module) => {
	const DatePart$5 = require_datepart();
	var Milliseconds$1 = class extends DatePart$5 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/minutes.js
var require_minutes = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/minutes.js": ((exports, module) => {
	const DatePart$4 = require_datepart();
	var Minutes$1 = class extends DatePart$4 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/month.js
var require_month = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/month.js": ((exports, module) => {
	const DatePart$3 = require_datepart();
	var Month$1 = class extends DatePart$3 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/seconds.js
var require_seconds = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/seconds.js": ((exports, module) => {
	const DatePart$2 = require_datepart();
	var Seconds$1 = class extends DatePart$2 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/year.js
var require_year = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/year.js": ((exports, module) => {
	const DatePart$1 = require_datepart();
	var Year$1 = class extends DatePart$1 {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/index.js
var require_dateparts = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/index.js": ((exports, module) => {
	module.exports = {
		DatePart: require_datepart(),
		Meridiem: require_meridiem(),
		Day: require_day(),
		Hours: require_hours(),
		Milliseconds: require_milliseconds(),
		Minutes: require_minutes(),
		Month: require_month(),
		Seconds: require_seconds(),
		Year: require_year()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/date.js
var require_date = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/date.js": ((exports, module) => {
	const color$5 = require_kleur();
	const Prompt$4 = require_prompt();
	const { style: style$5, clear: clear$5, figures: figures$4 } = require_util();
	const { erase: erase$3, cursor: cursor$5 } = require_src();
	const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts();
	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	const dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt$4 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear$5("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i$1) => {
				if (typeof i$1 === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i$1;
				else arr.push(i$1);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n$1) {
			this.typed = "";
			this.cursor = n$1;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === "string") {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = "red";
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c$3) {
			if (/\d/.test(c$3)) {
				this.typed += c$3;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$5.hide);
			else this.out.write(clear$5(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style$5.symbol(this.done, this.aborted),
				color$5.bold(this.msg),
				style$5.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color$5.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? ` ` : figures$4.pointerSmall} ${color$5.red().italic(l)}`, ``);
			this.out.write(erase$3.line + cursor$5.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/number.js
var require_number = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/number.js": ((exports, module) => {
	const color$4 = require_kleur();
	const Prompt$3 = require_prompt();
	const { cursor: cursor$4, erase: erase$2 } = require_src();
	const { style: style$4, figures: figures$3, clear: clear$4, lines } = require_util();
	const isNumber = /[0-9]/;
	const isDef = (any) => any !== void 0;
	const round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt$3 {
		constructor(opts = {}) {
			super(opts);
			this.transform = style$4.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color$4.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c$3) {
			return c$3 === `-` || c$3 === `.` && this.float || isNumber.test(c$3);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = `red`;
				this.fire();
				this.render();
				return;
			}
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = true;
			this.aborted = false;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c$3, key) {
			if (!this.valid(c$3)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c$3;
			this.lastHit = now;
			this.color = `cyan`;
			if (c$3 === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor$4.down(lines(this.outputError, this.out.columns) - 1) + clear$4(this.outputError, this.out.columns));
				this.out.write(clear$4(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style$4.symbol(this.done, this.aborted),
				color$4.bold(this.msg),
				style$4.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color$4[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a$1, l, i$1) => a$1 + `\n${i$1 ? ` ` : figures$3.pointerSmall} ${color$4.red().italic(l)}`, ``);
			this.out.write(erase$2.line + cursor$4.to(0) + this.outputText + cursor$4.save + this.outputError + cursor$4.restore);
		}
	};
	module.exports = NumberPrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/multiselect.js
var require_multiselect = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/multiselect.js": ((exports, module) => {
	const color$3 = require_kleur();
	const { cursor: cursor$3 } = require_src();
	const Prompt$2 = require_prompt();
	const { clear: clear$3, figures: figures$2, style: style$3, wrap: wrap$1, entriesToDisplay: entriesToDisplay$1 } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt$1 = class extends Prompt$2 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear$3("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c$3, key) {
			if (c$3 === " ") this.handleSpaceToggle();
			else if (c$3 === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures$2.arrowUp}/${figures$2.arrowDown}: Highlight option\n    ${figures$2.arrowLeft}/${figures$2.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor$23, v, i$1, arrowIndicator) {
			const prefix = (v.selected ? color$3.green(figures$2.radioOn) : figures$2.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor$23 === i$1 ? color$3.gray().underline(v.title) : color$3.strikethrough().gray(v.title);
			else {
				title = cursor$23 === i$1 ? color$3.cyan().underline(v.title) : v.title;
				if (cursor$23 === i$1 && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap$1(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color$3.gray(desc || "");
		}
		paginateOptions(options$1) {
			if (options$1.length === 0) return color$3.red("No matches for this query.");
			let { startIndex, endIndex } = entriesToDisplay$1(this.cursor, options$1.length, this.optionsPerPage);
			let prefix, styledOptions = [];
			for (let i$1 = startIndex; i$1 < endIndex; i$1++) {
				if (i$1 === startIndex && startIndex > 0) prefix = figures$2.arrowUp;
				else if (i$1 === endIndex - 1 && endIndex < options$1.length) prefix = figures$2.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options$1[i$1], i$1, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options$1) {
			if (!this.done) return this.paginateOptions(options$1);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color$3.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color$3.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$3.hide);
			super.render();
			let prompt$2 = [
				style$3.symbol(this.done, this.aborted),
				color$3.bold(this.msg),
				style$3.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt$2 += color$3.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt$2 += this.renderOptions(this.value);
			this.out.write(this.clear + prompt$2);
			this.clear = clear$3(prompt$2, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt$1;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocomplete.js": ((exports, module) => {
	const color$2 = require_kleur();
	const Prompt$1 = require_prompt();
	const { erase: erase$1, cursor: cursor$2 } = require_src();
	const { style: style$2, clear: clear$2, figures: figures$1, wrap, entriesToDisplay } = require_util();
	const getVal = (arr, i$1) => arr[i$1] && (arr[i$1].value || arr[i$1].title || arr[i$1]);
	const getTitle = (arr, i$1) => arr[i$1] && (arr[i$1].title || arr[i$1].value || arr[i$1]);
	const getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el$2) => el$2.value === valOrTitle || el$2.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt$1 {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style$2.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear$2("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i$1) {
			this.select = i$1;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i$1);
			else this.value = this.fallback.value;
			this.fire();
		}
		async complete(cb) {
			const p = this.completing = this.suggest(this.input, this.choices);
			const suggestions = await p;
			if (this.completing !== p) return;
			this.suggestions = suggestions.map((s, i$1, arr) => ({
				title: getTitle(arr, i$1),
				value: getVal(arr, i$1),
				description: s.description
			}));
			this.completing = false;
			const l = Math.max(suggestions.length - 1, 0);
			this.moveSelect(Math.min(l, this.select));
			cb && cb();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c$3, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c$3}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures$1.arrowUp : isEnd ? figures$1.arrowDown : " ";
			let title = hovered ? color$2.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color$2.cyan(figures$1.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color$2.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$2.hide);
			else this.out.write(clear$2(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
			this.outputText = [
				style$2.symbol(this.done, this.aborted, this.exited),
				color$2.bold(this.msg),
				style$2.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item$2, i$1) => this.renderOption(item$2, this.select === i$1 + startIndex, i$1 === 0 && startIndex > 0, i$1 + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color$2.gray(this.fallback.title));
			}
			this.out.write(erase$1.line + cursor$2.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocompleteMultiselect.js": ((exports, module) => {
	const color$1 = require_kleur();
	const { cursor: cursor$1 } = require_src();
	const MultiselectPrompt = require_multiselect();
	const { clear: clear$1, style: style$1, figures } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear$1("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c$3) {
			this.inputValue = this.inputValue + c$3;
			this.updateFilteredOptions();
		}
		_(c$3, key) {
			if (c$3 === " ") this.handleSpaceToggle();
			else this.handleInputChange(c$3);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color$1.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor$23, v, i$1) {
			let title;
			if (v.disabled) title = cursor$23 === i$1 ? color$1.gray().underline(v.title) : color$1.strikethrough().gray(v.title);
			else title = cursor$23 === i$1 ? color$1.cyan().underline(v.title) : v.title;
			return (v.selected ? color$1.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color$1.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color$1.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor$1.hide);
			super.render();
			let prompt$2 = [
				style$1.symbol(this.done, this.aborted),
				color$1.bold(this.msg),
				style$1.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt$2 += color$1.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt$2 += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt$2);
			this.clear = clear$1(prompt$2, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/confirm.js
var require_confirm = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/confirm.js": ((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear } = require_util();
	const { erase, cursor } = require_src();
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c$3, key) {
			if (c$3.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c$3.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/index.js
var require_elements = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/index.js": ((exports, module) => {
	module.exports = {
		TextPrompt: require_text(),
		SelectPrompt: require_select(),
		TogglePrompt: require_toggle(),
		DatePrompt: require_date(),
		NumberPrompt: require_number(),
		MultiselectPrompt: require_multiselect(),
		AutocompletePrompt: require_autocomplete(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
		ConfirmPrompt: require_confirm()
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/prompts.js
var require_prompts$1 = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/prompts.js": ((exports) => {
	const $ = exports;
	const el = require_elements();
	const noop$1 = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop$1;
			const onSubmit = opts.onSubmit || noop$1;
			const onExit$1 = opts.onExit || noop$1;
			p.on("state", args.onState || noop$1);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit$1(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item$2) => item$2.selected).map((item$2) => item$2.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item$2) => item$2.selected).map((item$2) => item$2.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle = (input, choices) => Promise.resolve(choices.filter((item$2) => item$2.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/index.js
var require_lib = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/index.js": ((exports, module) => {
	const prompts$1 = require_prompts$1();
	const passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
		const answers = {};
		const override$2 = prompt._override || {};
		questions = [].concat(questions);
		let answer, question, quit, name, type, lastPrompt;
		const getFormattedAnswer = async (question$1, answer$1, skipValidation = false) => {
			if (!skipValidation && question$1.validate && question$1.validate(answer$1) !== true) return;
			return question$1.format ? await question$1.format(answer$1, answers) : answer$1;
		};
		for (question of questions) {
			({name, type} = question);
			if (typeof type === "function") {
				type = await type(answer, { ...answers }, question);
				question["type"] = type;
			}
			if (!type) continue;
			for (let key in question) {
				if (passOn.includes(key)) continue;
				let value = question[key];
				question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
			}
			lastPrompt = question;
			if (typeof question.message !== "string") throw new Error("prompt message is required");
			({name, type} = question);
			if (prompts$1[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
			if (override$2[question.name] !== void 0) {
				answer = await getFormattedAnswer(question, override$2[question.name]);
				if (answer !== void 0) {
					answers[name] = answer;
					continue;
				}
			}
			try {
				answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts$1[type](question);
				answers[name] = answer = await getFormattedAnswer(question, answer, true);
				quit = await onSubmit(question, answer, answers);
			} catch (err) {
				quit = !await onCancel(question, answers);
			}
			if (quit) return answers;
		}
		return answers;
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts: prompts$1,
		inject,
		override
	});
}) });

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/index.js
var require_prompts = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/index.js": ((exports, module) => {
	function isNodeLT(tar) {
		tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
		let i$1 = 0, src = process.versions.node.split(".").map(Number);
		for (; i$1 < tar.length; i$1++) {
			if (src[i$1] > tar[i$1]) return false;
			if (tar[i$1] > src[i$1]) return true;
		}
		return false;
	}
	module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
}) });

//#endregion
//#region index.tsx
var import_minimist = /* @__PURE__ */ __toESM(require_minimist());
var import_prompts = /* @__PURE__ */ __toESM(require_prompts());
const argv = (0, import_minimist.default)(process.argv.slice(2));
const cwd = process.cwd();
async function create() {
	console.log(`\n${bold("  ReMDX")}\n`);
	let targetDir = argv._[0];
	if (!targetDir) {
		const { projectName } = await (0, import_prompts.default)({
			initial: "remdx",
			message: "Project name:",
			name: "projectName",
			type: "text"
		});
		targetDir = projectName.trim();
	}
	const packageName = await getValidPackageName(targetDir);
	const root = path.join(cwd, targetDir);
	if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true });
	else if (fs.readdirSync(root).length) {
		console.log(yellow(`  Target directory "${targetDir}" is not empty.`));
		const { yes: yes$1 } = await (0, import_prompts.default)({
			initial: "Y",
			message: "Remove existing files and continue?",
			name: "yes",
			type: "confirm"
		});
		if (yes$1) emptyDir(root);
		else return;
	}
	console.log(dim("  Scaffolding project in ") + targetDir + dim(" ..."));
	const templateDir = path.join(import.meta.dirname, "template");
	const write = (file, content) => {
		const targetPath = path.join(root, file);
		if (content) fs.writeFileSync(targetPath, content);
		else copy(path.join(templateDir, file), targetPath);
	};
	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => f !== "package.json")) write(file);
	const pkg = JSON.parse(readFileSync(path.join(templateDir, "package.json"), "utf8"));
	pkg.name = packageName;
	write("package.json", JSON.stringify(pkg, null, 2));
	const pkgManager = /pnpm/.test(process.env.npm_execpath || "") || /pnpm/.test(process.env.npm_config_user_agent || "") ? "pnpm" : /yarn/.test(process.env.npm_execpath || "") ? "yarn" : "npm";
	const related = path.relative(cwd, root);
	console.log(green("  Done.\n"));
	const { yes } = await (0, import_prompts.default)({
		initial: "Y",
		message: "Install and start the dev server now?",
		name: "yes",
		type: "confirm"
	});
	if (yes) {
		const { agent } = await (0, import_prompts.default)({
			choices: [
				"npm",
				"yarn",
				"pnpm"
			].map((i$1) => ({
				title: i$1,
				value: i$1
			})),
			message: "Choose your package manager",
			name: "agent",
			type: "select"
		});
		if (!agent) return;
		await execa(agent, ["install"], {
			cwd: root,
			stdio: "inherit"
		});
		await execa(agent, ["run", "dev"], {
			cwd: root,
			stdio: "inherit"
		});
	} else {
		console.log(dim("\n  start it later by:\n"));
		if (root !== cwd) console.log(blue(`  cd ${bold(related)}`));
		console.log(blue(`  ${pkgManager === "yarn" ? "yarn" : `${pkgManager} install`}`));
		console.log(blue(`  ${pkgManager === "yarn" ? "yarn dev" : `${pkgManager} run dev`}`));
	}
}
const copy = (src, dest) => {
	if (fs.statSync(src).isDirectory()) copyDir(src, dest);
	else fs.copyFileSync(src, dest);
};
const getValidPackageName = async (projectName) => {
	projectName = path.basename(projectName);
	const packageNameRegExp = /^(?:@[\d*a-z~-][\d*._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*$/;
	if (packageNameRegExp.test(projectName)) return projectName;
	else {
		const { inputPackageName } = await (0, import_prompts.default)({
			initial: projectName.trim().toLowerCase().replaceAll(/\s+/g, "-").replace(/^[._]/, "").replaceAll(/[^\da-z~-]+/g, "-"),
			message: "Package name:",
			name: "inputPackageName",
			type: "text",
			validate: (input) => packageNameRegExp.test(input) ? true : "Invalid package.json name"
		});
		return inputPackageName;
	}
};
const copyDir = (srcDir, destDir) => {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) copy(path.resolve(srcDir, file), path.resolve(destDir, file));
};
const emptyDir = (dir) => {
	if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) {
		const abs = path.resolve(dir, file);
		fs.rmSync(abs, {
			force: true,
			recursive: true
		});
	}
};
try {
	create();
} catch (error) {
	console.log(error);
}

//#endregion
export {  };