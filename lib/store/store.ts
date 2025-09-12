import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./slices/authSlice";
import { todoSlice } from "./slices/todoSlice";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["accessToken", "sessionId", "profile"], // فقط این فیلدها persist می‌شوند
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        todos: todoSlice.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                    "todos/setDraggedTodo", // قبلاً داشتی
                ],
                ignoredPaths: ["todos.draggedTodo"],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
