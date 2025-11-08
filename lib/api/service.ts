import { HttpServerRequest } from "@effect/platform/HttpServerRequest";
import { Effect, Layer } from "effect";
import { SessionMiddleware } from "./SessionMiddleware";

export const SessionMiddlewareLive = Layer.effect(
  SessionMiddleware,
  Effect.gen(function* () {
    return Effect.gen(function* () {
      const req = yield* HttpServerRequest;
      const headers = new Headers(req.headers);

      return { session: { organizationId: "this is the org id" }, headers };
    });
  })
);
