import { createStore, combineReducers, applyMiddleware, Store, Middleware, StoreEnhancer } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reduxThunk from 'redux-thunk';
import { History } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import browserHistory from '../modules/History/BrowserHistory';
import loggedUserReducer from './LoggedUser/LoggedUserReducer';
import remaindersReducer from './Remainders/RemaindersReducer';

export const createRootReducer = (history: History) => {
    return combineReducers({
        router: connectRouter(history),
        loggedUser: loggedUserReducer,
        remainders: remaindersReducer,
    });
};

export function configureStore(): Store {
    const middlewares: Middleware[] = [reduxThunk, routerMiddleware(browserHistory)];
    const middlewareEnhancer: StoreEnhancer = applyMiddleware(...middlewares);
    const store: Store = createStore(createRootReducer(browserHistory), composeWithDevTools(middlewareEnhancer));
    return store;
}

const store = configureStore();

export default store;
export type AppState = ReturnType<ReturnType<typeof createRootReducer>>;
export type AppDispatch = typeof store.dispatch;
