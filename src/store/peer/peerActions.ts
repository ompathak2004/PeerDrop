import { PeerActionType } from "./peerTypes";
import { Dispatch } from "redux";
import { DataType, PeerConnection } from "../../helpers/peer";
import { message, Modal } from "antd";
import { addConnectionList, removeConnectionList } from "../connection/connectionActions";
import download from "js-file-download";
import React from "react";

export const startPeerSession = (id: string) => ({
    type: PeerActionType.PEER_SESSION_START,
    id
});

export const stopPeerSession = () => ({
    type: PeerActionType.PEER_SESSION_STOP,
});

export const setLoading = (loading: boolean) => ({
    type: PeerActionType.PEER_LOADING,
    loading
});

export const startPeer = () => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
        const id = await PeerConnection.startPeerSession();

        PeerConnection.onIncomingConnection((conn) => {
            const peerId = conn.peer;
            message.info("Incoming connection: " + peerId);
            dispatch(addConnectionList(peerId));

            PeerConnection.onConnectionDisconnected(peerId, () => {
                message.info("Connection closed: " + peerId);
                dispatch(removeConnectionList(peerId));
            });

            PeerConnection.onConnectionReceiveData(peerId, (data) => {
                console.log("Received Data:", data);

                if (data.dataType === DataType.FILE && Array.isArray(data.files)) {
                    Modal.confirm({
                        title: "Incoming File(s)",
                        content: React.createElement(
                            "div",
                            null,
                            React.createElement("p", null, `Receiving ${data.files.length} file(s) from ${peerId}:`),
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
                            data.files.forEach((file) => {
                                try {
                                    const blob = new Blob([file.file], {
                                        type: file.fileType || "application/octet-stream",
                                    });
                                    download(blob, file.fileName, file.fileType);
                                    message.success(`Downloaded ${file.fileName}`);
                                } catch (error) {
                                    console.error("Download error:", error);
                                    message.error(`Failed to download ${file.fileName}`);
                                }
                            });
                        },
                    });
                }
            });
        });

        dispatch(startPeerSession(id));
    } catch (err) {
        console.error("Error in peer connection:", err);
        message.error("Failed to start peer connection");
    } finally {
        dispatch(setLoading(false));
    }
};
