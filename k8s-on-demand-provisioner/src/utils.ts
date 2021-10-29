import { K8SContainerService } from "./runtimes/K8SContainerService";
import { ContainerService } from "./runtimes/ContainerService";
import { buildHmacMiddleware } from "./hmac";
import { buildConsoleLogProxy } from "./logging";
import { ErrorRequestHandler } from "express";
import { HmacError, HmacErrorType } from "./hmac";

export const log = buildConsoleLogProxy({ name: "express" });

export const hmac = buildHmacMiddleware(process.env.API_SECRET);

export const containerService: ContainerService = new K8SContainerService({
  //  runtimeNamespace: '',
  logger: buildConsoleLogProxy({ name: "K8SContainerService" }),
});

export const errorHandler: ErrorRequestHandler = (error, _1, res, _2) => {
  if (error instanceof HmacError) {
    switch (error.type) {
      case HmacErrorType.EXPIRED_TIMESTAMP:
      case HmacErrorType.INVALID_TIMESTAMP:
      case HmacErrorType.NOT_AUTHENTICATED:
        return res.status(403).send(error.message);
      case HmacErrorType.MALFORMED_REQUEST:
        return res.status(400).send(error.message);
    }
  }
  console.error(error);
  return res.status(500).send("unknown error");
};
