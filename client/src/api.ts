import jsZip from 'jszip'
import fileSaver from 'file-saver'

export async function getVariableFontData() {
  const url = "https://us-central1-variable-font-helper.cloudfunctions.net/getMetadata"
  const res = await fetch(url, { method: "GET", cache: "force-cache" })
  return await res.json() as VariableFontData
}

// get the charset and url in separate groups
const subsetRegex = /\/\*(.*)\*\/[\s\S]*?url\((.*?)\)[\s\S]*?}/g

export type Stylesheet = {
  raw: string,
  subset: string,
  url: string,
}

export async function getStylesheets(font: string, charsets: string[], axes: Axis[]): Promise<Stylesheet[]> {
  const url = await buildCSS2Url(font, axes)
  const res = await (await fetch(url)).text()

  const matches = [...res.matchAll(subsetRegex)]
  return matches.map((match) => ({
    raw: match[0],
    subset: match[1].trim(),
    url: match[2],
  })).filter(sheet => charsets.includes(sheet.subset))
}

export type Axis = {
  tag: string,
  weight: number | [number, number]
}

// CSS2 API: https://developers.google.com/fonts/docs/css2#api_url_specification
async function buildCSS2Url(font: string, axes: Axis[]) {

  if (axes.length === 0) {
    return `https://fonts.googleapis.com/css2?family=${font}&display=swap`
  }

  font = font.replace(' ', '+')

  // axes need to be sorted alphabetically, lowercase first or else it will error
  axes.sort((a, b) => sortLowercaseFirst(a.tag, b.tag))

  const axisList = axes.map(a => a.tag).join(',')

  const axisValues = axes.map(a => {
    if (typeof (a.weight) == 'number') {
      return a.weight.toString()
    } else {
      return `${a.weight[0]}..${a.weight[1]}`
    }
  })
  return `https://fonts.googleapis.com/css2?family=${font}:${axisList}@${axisValues}&display=swap`
}

export async function downloadAllFiles(fontName: string, styles: Stylesheet[]) {

  // keep the font subset with the blob
  const downloadStyle = async (style: Stylesheet) => {
    const res = await fetch(style.url)
    return ({ ...style, blob: await res.blob() })
  }
  const fonts = await Promise.all(styles.map(downloadStyle))
  const zip = jsZip()

  // omit the subset on one font
  if (styles.length === 1) {
    zip.file(`${fontName}.woff2`, fonts[0].blob)
  } else {
    fonts.forEach((font) => {
      zip.file(`${fontName}-${font.subset}.woff2`, font.blob)
    })
  }
  zip.generateAsync({ type: 'blob' }).then(zipFile => {
    fileSaver.saveAs(zipFile, `${fontName}.zip`)
  })
}

const sortLowercaseFirst = (a: string, b: string) => {
  if (a[0] === a[0].toLocaleLowerCase() && b[0] === b[0].toLocaleLowerCase() ||
    a[0] === a[0].toLocaleUpperCase() && b[0] === b[0].toLocaleUpperCase()) {
    return a.localeCompare(b);
  }
  if (a[0] === a[0].toLocaleLowerCase()) {
    return -1;
  }
  return 1;
}

export interface VariableFontData {
  axisRegistry: AxisRegistry[];
  familyMetadataList: FontFamily[];
}

export interface AxisRegistry {
  tag: string;
  // displayName:  string;
  min: number;
  defaultValue: number;
  max: number;
  precision: number;
  description: string;
}

export interface FontFamily {
  family: string;
  category: Category;
  colorCapabilities: string[];
  designers: string[];
  displayName: null;
  size: number;
  subsets: string[];
  axes: FontAxis[];
  popularity: number,
}

export interface FontAxis {
  tag: string;
  min: number;
  max: number;
  defaultValue: number;
}

export enum Category {
  Display = "Display",
  Monospace = "Monospace",
  SansSerif = "Sans Serif",
  Serif = "Serif",
}