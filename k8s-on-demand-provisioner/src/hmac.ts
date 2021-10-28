import crypto from "crypto";
import { RequestHandler } from "express";
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from "http";

const TIMESTAMP_EXPIRATION_TIME = 60 * 15;

export enum HmacErrorType {
  MALFORMED_REQUEST = "MALFORMED_REQUEST",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  INVALID_TIMESTAMP = "INVALID_TIMESTAMP",
  EXPIRED_TIMESTAMP = "EXPIRED_TIMESTAMP",
}

export class HmacError extends Error {
  constructor(message: string, public type: HmacErrorType) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, HmacError.prototype);
  }
}

const validateTimestamp = (timestamp: string) => {
  const unixTime = Math.floor(Date.now() / 1000);
  const clientTime = Number(timestamp);
  const timeDiff = Math.abs(unixTime - clientTime);
  if (Number.isNaN(timeDiff)) {
    throw new HmacError("invalid timestamp", HmacErrorType.INVALID_TIMESTAMP);
  }
  if (timeDiff > TIMESTAMP_EXPIRATION_TIME) {
    throw new HmacError(
      "hmac request expired, given timestamp differs too much from server time",
      HmacErrorType.EXPIRED_TIMESTAMP
    );
  }
};

export const buildHmacMiddleware =
  (secret: string): RequestHandler =>
  (req, res, next) => {
    const getHeader = (
      headers: IncomingHttpHeaders,
      header: string
    ): string => {
      const result = headers[header];
      if (typeof result !== "string" || !result) {
        throw new HmacError(
          `${header} header missing or incorrect type`,
          HmacErrorType.MALFORMED_REQUEST
        );
      }
      return result;
    };

    // Actual headers
    const signatureFromHeader = getHeader(req.headers, "x-rc-signature");
    const timestamp = getHeader(req.headers, "x-rc-timestamp");
    const signedHeaders = getHeader(req.headers, "x-rc-signed-headers");

    // variables
    const algorithm = "sha256";
    const method = req.method.toUpperCase();
    const uri = req.path;
    const querystring = ""; // TODO currently assumes is empty

    // header injected in the JSON parser verify function
    const bodyHash = req.headers["x-rc-internal-body-hash"];

    if (!bodyHash) {
      throw new Error("INTERNAL ERROR: payload hash not found");
    }

    const headersToSign = signedHeaders.split(";");

    const headers = headersToSign
      .map((header) => `${header}:${req.headers[header]}`)
      .join("\n");

    const request = [
      method,
      uri,
      querystring,
      headers,
      signedHeaders,
      bodyHash,
    ].join("\n");

    const stringToSign = [
      algorithm,
      timestamp,
      crypto.createHash(algorithm).update(request).digest("base64"),
    ].join("\n");

    const signature = crypto
      .createHmac(algorithm, secret)
      .update(stringToSign)
      .digest("hex");

    validateTimestamp(timestamp);

    if (signature !== signatureFromHeader) {
      throw new HmacError(
        "signature did not match",
        HmacErrorType.NOT_AUTHENTICATED
      );
    }

    next();
  };

export const injectBodyHashOnVerify = (
  req: IncomingMessage,
  _1: ServerResponse,
  buf: Buffer,
  _2: string
) => {
  // Calcualate hash from the raw body buffer here
  const bodyHash = crypto.createHash("sha256").update(buf).digest("base64");
  // it's a bit of a hack to store the hash in a header, but it works...
  // this 'header' is only visible internally in this express application
  req.headers["x-rc-internal-body-hash"] = bodyHash;
};
