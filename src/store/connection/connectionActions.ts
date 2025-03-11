import {ConnectionActionType} from "./connectionTypes";
import {Dispatch} from "redux";
import {Data, DataType, PeerConnection} from "../../helpers/peer";
import {message, Modal} from "antd";
import download from "js-file-download";
import React from "react";

export const changeConnectionInput = (id: string) => ({
    type: ConnectionActionType.CONNECTION_INPUT_CHANGE, id
})

export const setLoading = (loading: boolean) => ({
    type: ConnectionActionType.CONNECTION_CONNECT_LOADING, loading
})
export const addConnectionList = (id: string) => ({
    type: ConnectionActionType.CONNECTION_LIST_ADD, id
})

export const removeConnectionList = (id: string) => ({
    type: ConnectionActionType.CONNECTION_LIST_REMOVE, id
})

export const selectItem = (id: string) => ({
    type: ConnectionActionType.CONNECTION_ITEM_SELECT, id
})

export const connectPeer: (id: string) => (dispatch: Dispatch) => Promise<void>
    = (id: string) => (async (dispatch) => {
    dispatch(setLoading(true));
    try {
        await PeerConnection.connectPeer(id);
        
        PeerConnection.onConnectionDisconnected(id, () => {
            message.info("Connection closed: " + id);
            dispatch(removeConnectionList(id));
        });

        PeerConnection.onConnectionReceiveData(id, (data: Data) => {
            if (data.dataType === DataType.FILE && Array.isArray(data.files)) {
                Modal.confirm({
                    title: "Incoming File(s)",
                    content: React.createElement(
                        "div",
                        null,
                        React.createElement("p", null, `Receiving ${data.files.length} file(s) from ${id}:`),
                        ...data.files.map((file, index) =>
                            React.createElement(
                                "div",
                                { key: index, className: "mt-2" },
                                React.createElement("p", { className: "font-medium" }, file.fileName),
                                React.createElement(
                                    "p",
                                    { className: "text-sm text-gray-500" },
                                    `Size: ${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
                                )
                            )
                        )
                    ),
                    okText: "Download",
                    cancelText: "Reject",
                    onOk() {
                        data.files.forEach(file => {
                            try {
                                download(file.file, file.fileName, file.fileType);
                                message.success(`Downloaded ${file.fileName}`);
                            } catch (error) {
                                console.error("Download error:", error);
                                message.error(`Failed to download ${file.fileName}`);
                            }
                        });
                    }
                });
            }
        });
        
        dispatch(addConnectionList(id));
        dispatch(setLoading(false));
    } catch (err) {
        console.error("Connection error:", err);
        message.error("Failed to connect to peer");
        dispatch(setLoading(false));
    }
});