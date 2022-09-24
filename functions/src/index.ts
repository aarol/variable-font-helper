import * as functions from "firebase-functions";
import { filterVariableFonts, Metadata } from "./metadata";
import Axios from "axios";

import cors = require("cors");
const corsHandler = cors({ origin: "*" })

export const getMetadata = functions.https.onRequest((async (request, response) => {
  corsHandler(request, response, async () => {
    response.set("Access-Control-Allow-Origin", "*") 
    functions.logger.info("Getting metadata from Google fonts");
    const url = "https://fonts.google.com/metadata/fonts";
    
    await Axios.get(url, { headers: {"User-Agent": "variable-font-helper.web.app"}})
      .then((res) => {
        const fonts = filterVariableFonts(res.data as Metadata)
        // cache for 1 day
        // on client AND cdn, so response is cached even if function is redeployed
        response.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
        response.send(fonts)
      })
      .catch((err) => {
        functions.logger.error("failed to get metadata:", err.toString());
        response.sendStatus(500);
      })
  });
}));
