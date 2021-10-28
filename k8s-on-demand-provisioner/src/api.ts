export enum onDemandRuntimeRequestType {
  START = 'start',
  STOP = 'stop',
  STATUS = 'status',
}
export interface onDemandRuntimeRequestStart {
  type: onDemandRuntimeRequestType.START;
  workspaceId: string;
  runtimeLinkToken: string;
  runtimeId: string;
  maxLifetimeSeconds?: number;
}

export interface onDemandRuntimeRequestStop {
  type: onDemandRuntimeRequestType.STOP;
  workspaceId: string;
  runtimeId: string;
}

export interface onDemandRuntimeRequestStatus {
  type: onDemandRuntimeRequestType.STATUS;
}

export interface onDemandRuntimeRequestStatusResponse {
  version: number;
  status: string;
}

export type onDemandRuntimeRequest =
  | onDemandRuntimeRequestStart
  | onDemandRuntimeRequestStop
  | onDemandRuntimeRequestStatus;
