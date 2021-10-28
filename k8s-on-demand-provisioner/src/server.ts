/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import helmet from 'helmet';

import { containerService, hmac, log, errorHandler } from './utils';
import { 
  onDemandRuntimeRequest,
  onDemandRuntimeRequestType,
  onDemandRuntimeRequestStatusResponse,
} from './api';
import { injectBodyHashOnVerify } from './hmac';

const app = express();
const app_admin = express();

const port = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000;
const port_admin = process.env.EXPRESS_PORT_ADMIN ? process.env.EXPRESS_PORT_ADMIN : 3001;

app.use(helmet());
app.use(express.json({
  verify: injectBodyHashOnVerify,
}));

app_admin.use(helmet());
app_admin.use(errorHandler);

app.get('/health', (_, res) => {
  res.send('healthy');
});

app.post('/hook', hmac, async (req, res) => {
  const request = req.body as onDemandRuntimeRequest;

  if (!request.type) {
    log.info('Request not recognized');
    res.status(400).send('Request not recognized');
    return;
  }

  switch (request.type) {
    case onDemandRuntimeRequestType.START:
      log.info(`Creating runtime ${request.runtimeId}`);
      try {
        const result = await containerService.startContainer({
          imageUri: 'robocorp/robocontainer',
          ...request
        });
        log.debug(result);
        res.send();
      } catch (e) {
        console.log('failed to create runtime');
        console.log(e);
        res.send(500);
      };
      break;

    case onDemandRuntimeRequestType.STATUS:
      res.send({
        version: '1',
        status: 'OK',
      } as onDemandRuntimeRequestStatusResponse);
      break;

    default: 
      log.info('Request type not recognized');
      res.status(400).send('Request type not recognized');
      break;
  }
});

app.use(errorHandler);

log.info(`Starting service on ports ${port}, ${port_admin}`);

app.listen(port, () => {
  log.info(`kube-hosted-runtime listening at port ${port}`);
});

app_admin.get('/', (_, res) => {
  // TODO make prettier
  res.send(`Secret: ${process.env.API_SECRET}`);
});
app_admin.listen(port_admin, () => {
  log.info(`kube-hosted-runtime admin interface listening at port ${port_admin}`);
});
