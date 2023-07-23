// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import quizReducer from './quizSlice';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['quiz'],
};

const rootReducer = combineReducers({
	quiz: quizReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);
