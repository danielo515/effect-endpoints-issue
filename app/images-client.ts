import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpApiClient from "@effect/platform/HttpApiClient";
import * as HttpClient from "@effect/platform/HttpClient";
import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import { ImagesApi } from "lib/api";

/**
 * Service that provides a typed HTTP client for the Images API.
 * The client is automatically derived from the ImagesApi HttpApi definition.
 */
export class ImagesClient extends Effect.Service<ImagesClient>()(
  "ImagesClient",
  {
    dependencies: [FetchHttpClient.layer],
    accessors: true,
    effect: Effect.gen(function* () {
      // Derive the client from the ImagesApi definition
      const imagesClient = yield* HttpApiClient.make(ImagesApi, {
        baseUrl: typeof window !== "undefined" ? window.location.origin : "",
      });

      const httpClient = (yield* HttpClient.HttpClient).pipe(
        HttpClient.retryTransient({
          times: 3,
          schedule: Schedule.exponential("200 millis"),
        })
      );

      const uploadToUrl = (url: URL, file: File) => {
        // TODO: do the upload after CORS is fixed
        // return httpClient.put(url, { body: HttpBody.fileWeb(file) });
        return Effect.logInfo("Uploading image", {
          url: url.href,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
      };

      const uploadImage = Effect.fn("uploadImage")(function* (
        articlePublicId: string,
        file: File
      ) {
        const uploadResponse = yield* imagesClient.Images.generateUploadUrl({
          payload: {
            articlePublicId,
            mimeType: file.type as unknown as any, // let server side validation do it's job
            fileSize: file.size,
          },
        });
        yield* uploadToUrl(new URL(uploadResponse.uploadUrl), file);
        return uploadResponse;
      });

      return {
        ...imagesClient.Images,
        uploadImage,
      };
    }),
  }
) {}
