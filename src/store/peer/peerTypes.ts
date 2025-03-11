export enum PeerActionType {
    PEER_SESSION_START = 'PEER_SESSION_START',
    PEER_SESSION_STOP = 'PEER_SESSION_STOP',
    PEER_LOADING = 'PEER_LOADING'
}

export interface StartPeerSessionAction {
    type: PeerActionType.PEER_SESSION_START;
    id: string;
}

export interface StopPeerSessionAction {
    type: PeerActionType.PEER_SESSION_STOP;
}

export interface SetLoadingAction {
    type: PeerActionType.PEER_LOADING;
    loading: boolean;
}

export type PeerAction = 
    | StartPeerSessionAction 
    | StopPeerSessionAction 
    | SetLoadingAction;


export interface PeerState {
    readonly id?: string
    readonly loading: boolean
    readonly started: boolean
}