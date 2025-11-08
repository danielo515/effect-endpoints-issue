import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";
import { SessionMiddleware } from "./SessionMiddleware";

// Request/Response Schemas

export const ImageMimeType = Schema.Literal(
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml"
);

export const UploadImageRequest = Schema.Struct({
  articlePublicId: Schema.String,
  mimeType: ImageMimeType,
  fileSize: Schema.Number.pipe(
    Schema.annotations({
      description: "File size in bytes (max 10MB)",
    })
  ),
});

export const UploadImageResponse = Schema.Struct({
  uploadUrl: Schema.String.pipe(
    Schema.annotations({
      description: "Presigned S3 URL for uploading the image",
    })
  ),
  assetId: Schema.String.pipe(
    Schema.annotations({
      description: "Unique identifier for the uploaded asset",
    })
  ),
  fetchUrl: Schema.String.pipe(
    Schema.annotations({
      description: "URL for fetching the uploaded image",
    })
  ),
  expiresIn: Schema.Number.pipe(
    Schema.annotations({
      description: "Number of seconds until the upload URL expires",
    })
  ),
});

export const DownloadImageResponse = Schema.Struct({
  downloadUrl: Schema.String.pipe(
    Schema.annotations({
      description: "Presigned S3 URL for downloading the image",
    })
  ),
  expiresIn: Schema.Number.pipe(
    Schema.annotations({
      description: "Number of seconds until the download URL expires",
    })
  ),
  mimeType: Schema.String.pipe(
    Schema.annotations({
      description: "MIME type of the image",
    })
  ),
  contentHash: Schema.String.pipe(
    Schema.annotations({
      description: "Content hash for ETag caching",
    })
  ),
});

// Path parameters
const assetIdParam = HttpApiSchema.param("id", Schema.String);

// API Definition
export const ImagesApi = HttpApi.make("ImagesApi")
  .add(
    HttpApiGroup.make("Images")
      .add(
        HttpApiEndpoint.post("generateUploadUrl", "/upload")
          .setPayload(UploadImageRequest)
          .addSuccess(UploadImageResponse)
      )
      .add(
        HttpApiEndpoint.get("getImage")`/${assetIdParam}`.addSuccess(
          DownloadImageResponse
        )
      )
  )
  .prefix("/api/images")
  .middleware(SessionMiddleware);
