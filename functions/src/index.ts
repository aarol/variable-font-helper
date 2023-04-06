import * as functions from "firebase-functions";
import { filterVariableFonts, Metadata } from "./metadata";
import axios from "axios";

export const getMetadata = functions.https.onRequest((async (request, response) => {
  functions.logger.info("Getting metadata from Google fonts");
  const url = "https://fonts.google.com/metadata/fonts";

  await axios.get(url, { headers: { "User-Agent": "variable-font-helper.web.app" } })
    .then((res) => {
      const fonts = filterVariableFonts(res.data as Metadata)
      // cache for 1 day
      // on client AND CDN, so response is cached even if function is redeployed
      response.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
      response.send(fonts)
    })
    .catch((err) => {
      functions.logger.error("failed to get metadata:", err.toString());
      response.sendStatus(500);
    })
}));
