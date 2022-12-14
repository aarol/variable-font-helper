export function filterVariableFonts(data: Metadata): Metadata {
  return {
    axisRegistry: data.axisRegistry.map(ax => ({
      tag: ax.tag,
      displayName: ax.displayName,
      min: ax.min,
      defaultValue: ax.defaultValue,
      max: ax.max,
      precision: ax.precision,
      description: ax.description
    })),
    familyMetadataList: data.familyMetadataList
      .filter((family) => family.axes.length > 0) // variable fonts only
      .map(ff => {
        return {
          family: ff.family,
          category: ff.category,
          colorCapabilities: ff.colorCapabilities,
          designers: ff.designers,
          displayName: ff.displayName,
          size: ff.size,
          subsets: ff.subsets.filter(s => s !== "menu"),
          axes: ff.axes,
          popularity: ff.popularity,
        }
      })
      .sort((a,b) => a.popularity - b.popularity) // sort by popularity
  }
}

export interface Metadata {
  axisRegistry: AxisRegistry[];
  familyMetadataList: FontFamily[];
  // promotedScript: null;
}

export interface AxisRegistry {
  tag: string;
  displayName: string;
  min: number;
  defaultValue: number;
  max: number;
  precision: number;
  description: string;
  // fallbackOnly: boolean;
  // fallbacks: Fallback[];
  // illustrationUrl?: string;
}

// export interface Fallback {
//   name: string;
//   value: number;
//   displayName: DisplayName;
// }

// export enum DisplayName {
//   Empty = "",
//   Off = "Off",
//   On = "On",
// }

export interface FontFamily {
  family: string;
  displayName: null | string;
  category: Category;
  size: number;
  subsets: string[];
  // fonts: { [key: string]: Font };
  axes: Axis[];
  designers: string[];
  // lastModified: Date;
  // dateAdded: Date;
  popularity: number;
  // trending: number;
  // defaultSort: number;
  // androidFragment: null | string;
  // isNoto: boolean;
  colorCapabilities: ColorCapability[];
  // primaryScript: PrimaryScript;
}

export interface Axis {
  tag: string;
  min: number;
  max: number;
  defaultValue: number;
}

export enum Category {
  Display = "Display",
  Handwriting = "Handwriting",
  Monospace = "Monospace",
  SansSerif = "Sans Serif",
  Serif = "Serif",
}

export enum ColorCapability {
  Colrv0 = "COLRV0",
  Colrv1 = "COLRV1",
  Otsvg = "OTSVG",
}

// export interface Font {
//   thickness: number | null;
//   slant: number | null;
//   width: number | null;
//   lineHeight: number;
// }

// export enum PrimaryScript {
//   Arab = "Arab",
//   Empty = "",
// }
