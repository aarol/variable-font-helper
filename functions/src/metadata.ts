import * as z from "zod";

// generated with https://app.quicktype.io/

export const DisplayNameSchema = z.enum([
  "",
  "Off",
  "On",
]);
export type DisplayName = z.infer<typeof DisplayNameSchema>;


export const CategorySchema = z.enum([
  "Display",
  "Handwriting",
  "Monospace",
  "Sans Serif",
  "Serif",
]);
export type Category = z.infer<typeof CategorySchema>;

export const ColorCapabilitySchema = z.enum([
  "COLRV0",
  "COLRV1",
  "OTSVG",
]);
export type ColorCapability = z.infer<typeof ColorCapabilitySchema>;

export const FontSchema = z.object({
  "thickness": z.union([z.number(), z.null()]),
  "slant": z.union([z.number(), z.null()]),
  "width": z.union([z.number(), z.null()]),
  "lineHeight": z.number(),
});
export type Font = z.infer<typeof FontSchema>;

export const AxisSchema = z.object({
  "tag": z.string(),
  "min": z.number(),
  "max": z.number(),
  "defaultValue": z.number(),
});
export type Axis = z.infer<typeof AxisSchema>;

const GFFontFamilySchema = z.object({
  "family": z.string(),
  "displayName": z.union([z.null(), z.string()]),
  "category": CategorySchema,
  "size": z.number(),
  "subsets": z.array(z.string()),
  "fonts": z.record(z.string(), FontSchema),
  "axes": z.array(AxisSchema),
  "designers": z.array(z.string()),
  "lastModified": z.string(),
  "dateAdded": z.string(),
  "popularity": z.number(),
  "trending": z.number(),
  "defaultSort": z.number(),
  "androidFragment": z.union([z.null(), z.string()]),
  "isNoto": z.boolean(),
  "colorCapabilities": z.array(ColorCapabilitySchema),
  "primaryScript": z.string(),
  "primaryLanguage": z.string(),
});
type GFFontFamily = z.infer<typeof GFFontFamilySchema>;

export type FontFamily = Pick<GFFontFamily, "family" | "subsets" | "axes" | "designers" | "popularity"> & {
  hasItalic: boolean,
}

export const FallbackSchema = z.object({
  "name": z.string(),
  "value": z.number(),
  "displayName": DisplayNameSchema,
});
export type Fallback = z.infer<typeof FallbackSchema>;

const GFAxisRegistrySchema = z.object({
  "tag": z.string(),
  "displayName": z.string(),
  "min": z.number(),
  "defaultValue": z.number(),
  "max": z.number(),
  "precision": z.number(),
  "description": z.string(),
  "fallbackOnly": z.boolean(),
  "fallbacks": z.array(FallbackSchema),
  "illustrationUrl": z.union([z.null(), z.string()]).optional(),
});
type GFAxisRegistry = z.infer<typeof GFAxisRegistrySchema>;

export type AxisRegistry = Pick<GFAxisRegistry, "tag" | "displayName" | "min" | "max" | "precision" | "description" | "defaultValue">

export const GFMetadataSchema = z.object({
  "axisRegistry": z.array(GFAxisRegistrySchema),
  "familyMetadataList": z.array(GFFontFamilySchema),
  "promotedScript": z.null(),
});
type GFMetadata = z.infer<typeof GFMetadataSchema>;

export type Metadata = {
  axisRegistry: AxisRegistry[],
  familyMetadataList: FontFamily[],
}

export function filterMetadata(data: GFMetadata): Metadata {
  return {
    axisRegistry: data.axisRegistry.map(a => ({
      displayName: a.displayName,
      description: a.description,
      tag: a.tag,
      min: a.min,
      max: a.max,
      defaultValue: a.defaultValue,
      precision: a.precision,
    })),
    familyMetadataList: data.familyMetadataList
      .filter((family) => family.axes.length > 0) // variable fonts only
      .map(f => ({
        axes: f.axes,
        designers: f.designers,
        family: f.family,
        // I don't know what menu is but it's not a real subset
        subsets: f.subsets.filter(s => s != "menu"),
        popularity: f.popularity,
        // some fonts have an italic variant separate from the "slant" property
        hasItalic: Object.keys(f.fonts).some(w => w.endsWith("i")),
      }))
      .sort((a, b) => a.popularity - b.popularity)
  }
}