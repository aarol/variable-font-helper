import * as functions from "firebase-functions";
import { filterVariableFonts, Metadata } from "./metadata";
import Axios from "axios";
import cors = require("cors");

const corsHandler = cors({ origin: "*" })

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const getMetadata = functions.https.onRequest((async (request, response) => {
  corsHandler(request, response, async () => {
    functions.logger.info("Getting metadata from Google fonts");
    const url = "https://fonts.google.com/metadata/fonts";

    await Axios.get(url,)
      .then((res) => {
        const fonts = filterVariableFonts(res.data as Metadata)
        response.set("Cache-Control", "public, max-age=604800, s-maxage=604800");
        response.send(fonts)
      })
      .catch((err) => {
        functions.logger.error("failed to get metadata:", err.toString());
        response.sendStatus(500);
      })
  });
}));
