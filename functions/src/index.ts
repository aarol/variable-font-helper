import * as functions from "firebase-functions";
import { GFMetadataSchema, filterMetadata } from "./metadata";
import axios from "axios";

export const getMetadata = functions.https.onRequest((async (request, response) => {
  functions.logger.info("Getting metadata from Google fonts");
  const url = "https://fonts.google.com/metadata/fonts";

  await axios.get(url, { headers: { "User-Agent": "variable-font-helper.web.app" } })
    .then((res) => {
      try {
        const metadata = GFMetadataSchema.parse(res.data)

        const fonts = filterMetadata(metadata)
        // cache for 1 day
        // on client AND CDN, so response is cached even if function is redeployed
        response.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
        response.send(fonts)
      } catch (err) {
        functions.logger.error("failed to parse metadata:", err);
        response.sendStatus(500);
      }
    })
    .catch((err) => {
      functions.logger.error("failed to GET metadata:", err);
      response.sendStatus(500);
    })
}));
