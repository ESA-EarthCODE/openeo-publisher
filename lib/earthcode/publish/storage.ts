export const uploadPublicFileToS3 = async (
  sourceUrl: string,
  keyPrefix: string,
  bucket?: string,
  overrideExisting: boolean = true
): Promise<string> => {
  console.info(
    `[S3 upload client] Starting upload request: sourceUrl=${sourceUrl}, keyPrefix=${keyPrefix}, bucket=${bucket || "<missing>"}, overrideExisting=${overrideExisting}`
  );

  const response = await fetch("/api/storage/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceUrl,
      keyPrefix,
      bucket,
      overrideExisting,
    }),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.url) {
    const message =
      payload?.error ||
      `Failed to upload workflow file to S3 (status ${response.status})`;
    console.error(
      `[S3 upload client] Upload failed: status=${response.status}, message=${message}`
    );
    throw new Error(
      message
    );
  }

  console.info(
    `[S3 upload client] Upload completed: url=${payload.url}, overwritten=${payload.overwritten}`
  );

  return payload.url as string;
};