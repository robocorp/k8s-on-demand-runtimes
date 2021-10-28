export enum onDemandRuntimeRequestType {
  START = 'start',
  STATUS = 'status',
}
export interface onDemandRuntimeRequestStart {
  type: onDemandRuntimeRequestType.START;
  workspaceId: string;
  runtimeLinkToken: string;
  runtimeId: string;
}

export interface onDemandRuntimeRequestStatus {
  type: onDemandRuntimeRequestType.STATUS;
}

export interface onDemandRuntimeRequestStatusResponse {
  version: string;
  status: string;
}

export type onDemandRuntimeRequest = onDemandRuntimeRequestStart | onDemandRuntimeRequestStatus;
