import { configureStore } from '@reduxjs/toolkit'
import { PeerReducer } from "./peer/peerReducer";
import { ConnectionReducer } from "./connection/connectionReducer";

export const store = configureStore({
    reducer: {
        peer: PeerReducer as any, // temporary fix
        connection: ConnectionReducer as any // temporary fix
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['peer/sendFile'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.file'],
                // Ignore these paths in the state
                ignoredPaths: ['peer.files']
            }
        })
})

window.store = store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch