import React from 'react';
import { message, Upload, UploadFile } from "antd";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import * as connectionAction from "./store/connection/connectionActions";
import { useAsyncState } from "./helpers/hooks";
import { startPeer, stopPeerSession } from './store/peer/peerActions';
import { DataType, FileData, PeerConnection } from './helpers/peer';



export const App: React.FC = () => {
    const peer = useAppSelector((state) => state.peer);
    const connection = useAppSelector((state) => state.connection);
    const dispatch = useAppDispatch();
    const [fileList, setFileList] = useAsyncState([] as UploadFile[]);
    const [sendLoading, setSendLoading] = useAsyncState(false);

    const handleStartSession = () => dispatch(startPeer());
    const handleStopSession = async () => {
        await PeerConnection.closePeerSession();
        dispatch(stopPeerSession());
    };

    const handleConnectOtherPeer = () => {
        connection.id ? dispatch(connectionAction.connectPeer(connection.id)) :
            message.warning("Please enter ID");
    };
    const handleUpload = async () => {
        if (fileList.length === 0 || !connection.selectedId) {
            message.warning(!fileList.length ? "Please select files" : "Please select a connection");
            return;
        }
    
        try {
            await setSendLoading(true);
            const filesData: FileData[] = await Promise.all(
                fileList.map(async (file: UploadFile) => {
                    const actualFile = file instanceof File ? file : file.originFileObj;
                    if (!actualFile) {
                        throw new Error(`Failed to process file: ${file.name}`);
                    }
    
                    // Create Blob with proper type
                    const blob = new Blob([actualFile], { type: actualFile.type });
                    return {
                        file: blob,
                        fileName: actualFile.name,
                        fileType: actualFile.type || 'application/octet-stream',
                        fileSize: actualFile.size
                    };
                })
            );
    
            await PeerConnection.sendConnection(connection.selectedId, {
                dataType: DataType.FILE,
                files: filesData,  // Changed from file to files,
                filename: filesData.map((file) => file.fileName).join(', ')
            });
            
            setFileList([]);
            setSendLoading(false);
            message.success(`${filesData.length} file(s) sent successfully`);
        } catch (err) {
            setSendLoading(false);
            console.error('Upload error:', err);
            message.error(err instanceof Error ? err.message : "Error sending files");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">P2P File Transfer</h1>
                        <p className="mt-2 text-gray-600">Share files securely with peer-to-peer connection</p>
                    </div>

                    {/* Start/Stop Section */}
                    {!peer.started ? (
                        <div className="text-center">
                            <button
                                onClick={handleStartSession}
                                disabled={peer.loading}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {peer.loading ? 'Starting...' : 'Start Session'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* ID Display */}
                            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Your ID:</span>
                                <code className="px-4 py-2 bg-gray-100 rounded-md text-sm">{peer.id}</code>
                                <button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(peer.id || "");
                                        message.success("ID copied to clipboard");
                                    }}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleStopSession}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                                >
                                    Stop Session
                                </button>
                            </div>

                            {/* Connect Section */}
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Enter peer ID to connect"
                                    onChange={e => dispatch(connectionAction.changeConnectionInput(e.target.value))}
                                    className="flex-1 min-w-0 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handleConnectOtherPeer}
                                    disabled={connection.loading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Connect
                                </button>
                            </div>

                            {/* Connections List */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Peers</h3>
                                {connection.list.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Waiting for connections...</p>
                                ) : (
                                    <div className="space-y-2">
                                        {connection.list.map(peerId => (
                                            <button
                                                key={peerId}
                                                onClick={() => dispatch(connectionAction.selectItem(peerId))}
                                                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${connection.selectedId === peerId
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {peerId}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Send File</h3>
                                <div className="flex items-center space-x-4">
                                    <Upload
                                        multiple
                                        fileList={fileList}
                                        maxCount={5}
                                        beforeUpload={(file) => {
                                            const isLessThan100MB = file.size / 1024 / 1024 < 100;
                                            if (!isLessThan100MB) {
                                                message.error(`${file.name} must be smaller than 100MB`);
                                                return Upload.LIST_IGNORE;
                                            }
                                            // Store the actual File object
                                            setFileList((prev: UploadFile[]) => [...prev, {
                                                uid: file.uid || String(Date.now()),
                                                name: file.name,
                                                size: file.size,
                                                type: file.type,
                                                originFileObj: file
                                            } as UploadFile]);
                                            return false; // Prevent default upload
                                        }}
                                        onRemove={(file) => {
                                            const index = fileList.indexOf(file);
                                            const newFileList = fileList.slice();
                                            newFileList.splice(index, 1);
                                            setFileList(newFileList);
                                            return false;
                                        }}
                                        customRequest={({ onSuccess }) => {
                                            // Prevent default upload behavior
                                            setTimeout(() => {
                                                onSuccess && onSuccess("ok");
                                            }, 0);
                                        }}
                                        className="flex-1"
                                    >
                                        <button
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Select Files (Max 100MB)
                                        </button>
                                    </Upload>
                                    <button
                                        onClick={handleUpload}
                                        disabled={fileList.length === 0 || sendLoading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {sendLoading ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;