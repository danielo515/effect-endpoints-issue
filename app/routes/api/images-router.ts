import { HttpApiBuilder, HttpServerResponse } from "@effect/platform";
import { HttpServerRequest } from "@effect/platform/HttpServerRequest";
import { Effect } from "effect";
import { ImagesApi } from "lib/api";
import { SessionService } from "lib/api/SessionService";
import { inspect } from "util";

/**
 * Implementation of the Images API group.
 * This layer provides handlers for all endpoints in the Images group.
 */
export const ImagesRouterLive = HttpApiBuilder.group(
  ImagesApi,
  "Images",
  (handlers) =>
    handlers
      .handle("generateUploadUrl", ({ payload, request }) =>
        Effect.gen(function* () {
          const sessionSvc = yield* SessionService;
          const { session } = sessionSvc;

          const organizationId = session.organizationId;

          if (!organizationId) {
            return yield* HttpServerResponse.json(
              { error: "Unauthorised" },
              { status: 401 }
            ).pipe(Effect.orDie);
          }

          Effect.logInfo("Generating upload URL", {
            articlePublicId: payload.articlePublicId,
            mimeType: payload.mimeType,
            fileSize: payload.fileSize,
          });

          Effect.logInfo("Upload URL generated.", {
            uploadUrl: "test",
            expiresIn: 9999,
          });

          Effect.logInfo(inspect(request, { depth: null, colors: true }));

          return {
            assetId: "test",
            expiresIn: 9999,
            uploadUrl: "test",
            fetchUrl: request.originalUrl + "/" + "test",
          };
        }).pipe(
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              yield* Effect.logError("Upload URL generation error", error);
              return yield* HttpServerResponse.json(
                { error: "Internal server error" },
                { status: 500 }
              ).pipe(Effect.orDie);
            })
          ),
          Effect.annotateLogs({
            endpoint: "generateUploadUrl",
            articlePublicId: payload.articlePublicId,
          })
        )
      )
      .handle("getImage", ({ path }) =>
        Effect.gen(function* () {
          const sessionSvc = yield* SessionService;
          const { session } = sessionSvc;

          const organizationId = session.organizationId;

          if (!organizationId) {
            return yield* HttpServerResponse.json(
              { error: "Unauthorised" },
              { status: 401 }
            ).pipe(Effect.orDie);
          }

          const request = yield* HttpServerRequest;
          const ifNoneMatch = request.headers["if-none-match"];
          const currentETag = `"test"`;

          if (ifNoneMatch === currentETag) {
            return yield* HttpServerResponse.raw(null, {
              status: 304,
              headers: {
                ETag: currentETag,
                "Cache-Control": "private, max-age=3600", // Cache for 1 hour
              },
            });
          }

          // Return 302 redirect to presigned URL with ETag
          return yield* HttpServerResponse.redirect("test", {
            headers: {
              ETag: currentETag,
              "Cache-Control": "private, max-age=3600", // Cache for 1 hour
              "Content-Type": "test",
            },
          });
        }).pipe(
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              yield* Effect.logError("Image retrieval error", error);
              return yield* HttpServerResponse.json(
                { error: "Internal server error" },
                { status: 500 }
              ).pipe(Effect.orDie);
            })
          ),
          Effect.annotateLogs({
            endpoint: "getImage",
            assetId: path.id,
          })
        )
      )
);
