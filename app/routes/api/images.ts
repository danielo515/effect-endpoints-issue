import { HttpApiBuilder, HttpServer } from "@effect/platform";
import { Layer } from "effect";
import { ImagesApi } from "lib/api";

import { SessionMiddlewareLive } from "lib/api/service";
import { runtime } from "lib/runtime";
import type { AppLoadContext, LoaderFunctionArgs } from "react-router";
import { ImagesRouterLive } from "./images-router";
// Import the router implementation that handles the API endpoints

// Build the API layer by combining the API definition with its implementation
const ImagesApiLive = HttpApiBuilder.api(ImagesApi)
  .pipe(Layer.provide(ImagesRouterLive))
  .pipe(Layer.provide(SessionMiddlewareLive));

const { handler } = HttpApiBuilder.toWebHandler(
  Layer.mergeAll(ImagesApiLive, HttpServer.layerContext),
  {
    memoMap: runtime.memoMap,
  }
);

export const loader = ({ request }: LoaderFunctionArgs<AppLoadContext>) => {
  return handler(request);
};

export const action = ({ request }: LoaderFunctionArgs<AppLoadContext>) => {
  return handler(request);
};
