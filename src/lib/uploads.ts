/**
 * Where /ftp/ uploads are stored: any S3-compatible bucket -- a Railway Bucket
 * by default, or Backblaze B2's S3 endpoint, which needs nothing but different
 * values below.
 *
 * Configured entirely from process.env at request time (never import.meta.env,
 * which Vite would inline into the bundle):
 *
 *   UPLOADS_ENDPOINT           e.g. https://t3.storageapi.dev   (Railway ENDPOINT)
 *   UPLOADS_BUCKET             the S3 bucket name                (Railway BUCKET)
 *   UPLOADS_ACCESS_KEY_ID                                        (Railway ACCESS_KEY_ID)
 *   UPLOADS_SECRET_ACCESS_KEY                                    (Railway SECRET_ACCESS_KEY)
 *   UPLOADS_REGION             optional, default `auto`         (Railway REGION)
 *   UPLOADS_PATH_STYLE         `true` only if the bucket's Credentials tab says
 *                              to use path-style URLs; Railway's current
 *                              buckets are virtual-hosted.
 *
 * Railway Buckets are private, so the rep's email carries presigned download
 * links rather than public URLs. SigV4 caps a presigned URL at seven days.
 */
import { AwsClient } from 'aws4fetch';

export const LINK_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface UploadStore {
  put(key: string, body: ArrayBuffer, contentType: string | null): Promise<void>;
  signedGetUrl(key: string): Promise<string>;
  /** The object as the bucket returns it; check `ok` (404 when missing). */
  get(key: string): Promise<Response>;
}

/** Encode each path segment, keep the slashes. */
const encodeKey = (key: string) => key.split('/').map(encodeURIComponent).join('/');

const REQUIRED_VARS = [
  'UPLOADS_ENDPOINT',
  'UPLOADS_BUCKET',
  'UPLOADS_ACCESS_KEY_ID',
  'UPLOADS_SECRET_ACCESS_KEY',
] as const;

/** Names (never values) of the required variables that are unset or empty. */
export const missingUploadVars = (): string[] => REQUIRED_VARS.filter((name) => !process.env[name]);

export function getUploadStore(): UploadStore | null {
  const e = process.env;
  const endpoint = e.UPLOADS_ENDPOINT?.replace(/\/$/, '');
  const bucket = e.UPLOADS_BUCKET;
  if (!endpoint || !bucket || !e.UPLOADS_ACCESS_KEY_ID || !e.UPLOADS_SECRET_ACCESS_KEY) return null;

  const client = new AwsClient({
    accessKeyId: e.UPLOADS_ACCESS_KEY_ID,
    secretAccessKey: e.UPLOADS_SECRET_ACCESS_KEY,
    service: 's3',
    region: e.UPLOADS_REGION || 'auto',
  });

  const base = new URL(endpoint);
  const objectUrl = (key: string) =>
    e.UPLOADS_PATH_STYLE === 'true'
      ? `${base.origin}/${bucket}/${encodeKey(key)}`
      : `${base.protocol}//${bucket}.${base.host}/${encodeKey(key)}`;

  return {
    async put(key, body, contentType) {
      const res = await client.fetch(objectUrl(key), {
        method: 'PUT',
        body,
        headers: contentType ? { 'content-type': contentType } : undefined,
      });
      if (!res.ok) {
        const why = (await res.text().catch(() => '')).slice(0, 200);
        throw new Error(`bucket PUT ${res.status}: ${why}`);
      }
    },

    get(key) {
      return client.fetch(objectUrl(key));
    },

    async signedGetUrl(key) {
      const url = new URL(objectUrl(key));
      url.searchParams.set('X-Amz-Expires', String(LINK_TTL_SECONDS));
      const signed = await client.sign(url.toString(), { method: 'GET', aws: { signQuery: true } });
      return signed.url;
    },
  };
}
