import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./user/UserSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const rootReducer = combineReducers({user: UserSlice})
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    // Ensure you're returning the result of the call to getDefaultMiddleware
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor  = persistStore(store)