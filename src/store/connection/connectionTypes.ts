export enum ConnectionActionType {
    CONNECTION_INPUT_CHANGE = 'CONNECTION_INPUT_CHANGE',
    CONNECTION_CONNECT_LOADING = 'CONNECTION_CONNECT_LOADING',
    CONNECTION_LIST_ADD = 'CONNECTION_LIST_ADD',
    CONNECTION_LIST_REMOVE = 'CONNECTION_LIST_REMOVE',
    CONNECTION_ITEM_SELECT = 'CONNECTION_ITEM_SELECT'
}

export interface ConnectionInputChangeAction {
    type: ConnectionActionType.CONNECTION_INPUT_CHANGE;
    id: string;
}

export interface ConnectionConnectLoadingAction {
    type: ConnectionActionType.CONNECTION_CONNECT_LOADING;
    loading: boolean;
}
export interface ConnectionListAddAction {
    type: ConnectionActionType.CONNECTION_LIST_ADD;
    id: string;
}

export interface ConnectionListRemoveAction {
    type: ConnectionActionType.CONNECTION_LIST_REMOVE;
    id: string;
}

export interface ConnectionItemSelectAction {
    type: ConnectionActionType.CONNECTION_ITEM_SELECT;
    id: string;
}

export type ConnectionAction = 
    | ConnectionInputChangeAction 
    | ConnectionConnectLoadingAction 
    | ConnectionListAddAction 
    | ConnectionListRemoveAction 
    | ConnectionItemSelectAction;

export interface ConnectionState {
    readonly id?: string
    readonly loading: boolean
    readonly list: string[]
    readonly selectedId?: string
}