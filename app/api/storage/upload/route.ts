import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { auth } from "auth";

export const runtime = "nodejs";

type S3UploadConfig = {
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  baseFolder: string;
  publicBaseUrl?: string;
  publicUrlStyle: "path" | "virtual-host";
};

const trimSlashes = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

const buildScopedObjectKey = (
  baseFolder: string,
  keyPrefix: string,
  fileName: string
): string => {
  const normalizedBaseFolder = trimSlashes(baseFolder);
  const normalizedPrefix = trimSlashes(keyPrefix);
  const normalizedFileName = trimSlashes(fileName);

  const parts = [normalizedBaseFolder, normalizedPrefix, normalizedFileName].filter(
    (part) => part.length > 0
  );

  return parts.join("/");
};

const readS3UploadConfig = (): S3UploadConfig | null => {
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const baseFolder = process.env.S3_ENV ? `${process.env.S3_ENV}` : "dev";

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    region,
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId,
    secretAccessKey,
    baseFolder,
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
    publicUrlStyle:
      process.env.S3_PUBLIC_URL_STYLE === "virtual-host"
        ? "virtual-host"
        : "path",
  };
};

const getPublicObjectUrl = (
  config: S3UploadConfig,
  bucket: string,
  key: string
): string => {
  if (config.publicBaseUrl) {
    return `${config.publicBaseUrl.replace(/\/+$/, "")}/${bucket}/${key}`;
  }

  if (config.endpoint) {
    const endpointUrl = new URL(config.endpoint);
    const endpointPath = trimSlashes(endpointUrl.pathname);
    const pathPrefix = endpointPath ? `/${endpointPath}` : "";

    if (config.publicUrlStyle === "virtual-host") {
      return `${endpointUrl.protocol}//${bucket}.${endpointUrl.host}${pathPrefix}/${key}`;
    }

    return `${endpointUrl.protocol}//${endpointUrl.host}${pathPrefix}/${bucket}/${key}`;
  }
 
  throw new Error("Cannot determine public URL for S3 object. Please provide S3_PUBLIC_BASE_URL or S3_ENDPOINT in the configuration.");
};

const getFileNameFromUrl = (sourceUrl: string): string => {
  const pathname = new URL(sourceUrl).pathname;
  const fileName = pathname.split("/").pop();

  if (!fileName || fileName.trim() === "") {
    return "workflow-file";
  }

  return fileName;
};

const normalizeFileName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "asset.json";
  }

  const clean = trimmed.split("/").pop();
  if (!clean || clean.trim() === "") {
    return "asset.json";
  }

  return clean;
};

const objectExists = async (
  s3: S3Client,
  bucket: string,
  key: string
): Promise<boolean> => {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "$metadata" in error
        ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata
            ?.httpStatusCode
        : undefined;
    const name =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: unknown }).name)
        : "";

    if (statusCode === 404 || name === "NotFound") {
      return false;
    }

    throw error;
  }
};

export async function POST(request: Request) {
  const requestId = `upload-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    console.info(`[S3 upload] [${requestId}] Request received`);

    const session = await auth();
    if (!session?.user && process.env.SKIP_AUTH !== "true") {
      console.warn(`[S3 upload] [${requestId}] Unauthorized request`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const sourceUrl = body?.sourceUrl;
    const rawJson = body?.rawJson;
    const fileName = body?.fileName;
    const keyPrefix = body?.keyPrefix;
    const bucket = body?.bucket || undefined;
    const overrideExisting = body?.overrideExisting !== false;

    console.info(
      `[S3 upload] [${requestId}] Input parsed: sourceUrl=${sourceUrl || "<missing>"}, rawJson=${rawJson !== undefined}, fileName=${fileName || "<missing>"}, keyPrefix=${keyPrefix || "<missing>"}, bucket=${bucket || "<missing>"}, overrideExisting=${overrideExisting}`
    );

    if (!keyPrefix) {
      console.warn(
        `[S3 upload] [${requestId}] Validation failed: keyPrefix missing`
      );
      return NextResponse.json(
        { error: "keyPrefix is required" },
        { status: 400 }
      );
    }

    if (!sourceUrl && rawJson === undefined) {
      console.warn(
        `[S3 upload] [${requestId}] Validation failed: sourceUrl or rawJson must be provided`
      );
      return NextResponse.json(
        { error: "Provide either sourceUrl or rawJson" },
        { status: 400 }
      );
    }

    const config = readS3UploadConfig();
    if (!config) {
      console.error(
        `[S3 upload] [${requestId}] Missing S3 credentials configuration`
      );
      return NextResponse.json(
        {
          error:
            "Missing S3 configuration. Expected S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY",
        },
        { status: 500 }
      );
    }

    if (!bucket) {
      console.warn(
        `[S3 upload] [${requestId}] Validation failed: bucket missing`
      );
      return NextResponse.json(
        {
          error:
            "Missing bucket. Provide bucket in request body.",
        },
        { status: 400 }
      );
    }

    let bodyBuffer: Buffer;
    let contentType: string;
    let key: string;

    if (sourceUrl) {
      console.info(
        `[S3 upload] [${requestId}] Downloading source file from ${sourceUrl}`
      );

      const fileResponse = await fetch(sourceUrl);
      if (!fileResponse.ok) {
        console.error(
          `[S3 upload] [${requestId}] Source download failed with status ${fileResponse.status} ${fileResponse.statusText}`
        );
        return NextResponse.json(
          {
            error: `Failed to download source file: ${fileResponse.status} ${fileResponse.statusText}`,
          },
          { status: 400 }
        );
      }

      const bytes = await fileResponse.arrayBuffer();
      bodyBuffer = Buffer.from(bytes);
      contentType =
        fileResponse.headers.get("content-type") || "application/octet-stream";
      key = buildScopedObjectKey(
        config.baseFolder,
        keyPrefix,
        getFileNameFromUrl(sourceUrl)
      );
    } else {
      contentType = "application/json";
      bodyBuffer = Buffer.from(JSON.stringify(rawJson, null, 2), "utf-8");
      key = buildScopedObjectKey(
        config.baseFolder,
        keyPrefix,
        normalizeFileName(typeof fileName === "string" ? fileName : "asset.json")
      );
      console.info(
        `[S3 upload] [${requestId}] Using rawJson upload with fileName=${normalizeFileName(
          typeof fileName === "string" ? fileName : "asset.json"
        )}`
      );
    }

    console.info(
      `[S3 upload] [${requestId}] Prepared upload target bucket=${bucket}, key=${key}, contentType=${contentType}, sizeBytes=${bodyBuffer.length}`
    );

    const s3 = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: !!config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    const exists = await objectExists(s3, bucket, key);
    console.info(
      `[S3 upload] [${requestId}] Object exists=${exists} for bucket=${bucket}, key=${key}`
    );

    if (exists && !overrideExisting) {
      const existingUrl = getPublicObjectUrl(config, bucket, key);
      console.warn(
        `[S3 upload] [${requestId}] Upload blocked because overrideExisting=false, existingUrl=${existingUrl}`
      );
      return NextResponse.json(
        {
          error:
            "Asset already exists in S3 and overrideExisting is false.",
          url: existingUrl,
        },
        { status: 409 }
      );
    }

    console.info(
      `[S3 upload] [${requestId}] Uploading object to S3 bucket=${bucket}, key=${key}`
    );

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bodyBuffer,
        ContentType: contentType,
      })
    );

    const publicUrl = getPublicObjectUrl(config, bucket, key);
    console.info(
      `[S3 upload] [${requestId}] Upload complete. publicUrl=${publicUrl}, overwritten=${exists}`
    );

    return NextResponse.json({
      url: publicUrl,
      overwritten: exists,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected upload error";

    const details =
      typeof error === "object" && error !== null
        ? JSON.stringify(error, Object.getOwnPropertyNames(error))
        : String(error);

    console.error(
      `[S3 upload] [${requestId}] Unhandled error: ${message}. details=${details}`
    );

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
