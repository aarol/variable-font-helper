import fileSaver from "file-saver";
import type { Metadata } from "../../functions/src/metadata";

export async function getVariableFontData() {
	const url = "/getMetadata";
	const res = await fetch(url, { method: "GET", cache: "force-cache" });
	if (res.status >= 400) {
		throw new Error(`Received response ${res.status}: ${res.statusText}`);
	}
	return (await res.json()) as Metadata;
}

export type Stylesheet = {
	raw: string;
	subset: string;
	italic: boolean;
	url: string;
};

export function fontFaceIdentifier(style: Stylesheet): string {
	if (style.italic) {
		return `${style.subset}-italic`;
	}
	return style.subset;
}

// get the charset and url in separate groups
const subsetRegex = /\/\*(.*)\*\/[\s\S]*?url\((.*?)\)[\s\S]*?}/g;

export async function getStylesheets(
	font: string,
	charsets: string[],
	axes: Axis[],
	italic: boolean,
): Promise<Stylesheet[]> {
	const url = buildCSS2Url(font, axes, italic);
	const res = await fetch(url).then((r) => r.text());
	const matches = [...res.matchAll(subsetRegex)];
	return matches
		.map((match) => ({
			raw: match[0],
			subset: match[1].trim(),
			url: match[2],
			italic: match[0].includes("italic"),
		}))
		.filter((sheet) => charsets.includes(sheet.subset));
}

export type Axis = {
	tag: string;
	weight: number | [number, number];
};

// CSS2 API: https://developers.google.com/fonts/docs/css2#api_url_specification
function buildCSS2Url(font: string, axes: Axis[], italic: boolean) {
	if (axes.length === 0) {
		return `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
	}

	const urlFont = font.replace(" ", "+");

	// axes need to be sorted alphabetically, lowercase first or else it will error
	axes.sort((a, b) => sortLowercaseFirst(a.tag, b.tag));

	let axisList = axes.map((a) => a.tag).join(",");

	let axisValues = axes
		.map((a) => {
			if (typeof a.weight === "number") {
				return a.weight.toString();
			}
			return `${a.weight[0]}..${a.weight[1]}`;
		})
		.join(",");

	if (italic) {
		axisList = `ital,${axisList}`;
		axisValues = `0,${axisValues};1,${axisValues}`;
	}
	return `https://fonts.googleapis.com/css2?family=${urlFont}:${axisList}@${axisValues}&display=swap`;
}

export async function downloadAllFiles(fontName: string, styles: Stylesheet[]) {
	const download = (s: Stylesheet) => fetch(s.url).then((r) => r.blob());

	const fonts = await Promise.all(styles.map(download));
	const zip = (await import("jszip")).default();

	// omit the subset on one font
	if (styles.length === 1) {
		zip.file(`${fontName}.woff2`, fonts[0]);
	} else {
		fonts.forEach((font, i) => {
			zip.file(`${fontName}-${fontFaceIdentifier(styles[i])}.woff2`, font);
		});
	}

	await zip.generateAsync({ type: "blob" }).then((zipFile) => {
		fileSaver.saveAs(zipFile, `${fontName}.zip`);
	});
}

// copied from stack overflow
const sortLowercaseFirst = (a: string, b: string) => {
	if (
		(a[0] === a[0].toLocaleLowerCase() && b[0] === b[0].toLocaleLowerCase()) ||
		(a[0] === a[0].toLocaleUpperCase() && b[0] === b[0].toLocaleUpperCase())
	) {
		return a.localeCompare(b);
	}
	if (a[0] === a[0].toLocaleLowerCase()) {
		return -1;
	}
	return 1;
};
