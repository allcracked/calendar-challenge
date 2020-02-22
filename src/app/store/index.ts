import { createStore, combineReducers, applyMiddleware, Store, Middleware, StoreEnhancer } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reduxThunk from 'redux-thunk';
import { History } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import browserHistory from '../modules/History/BrowserHistory';
import loggedUserReducer from './LoggedUser/LoggerUserReducer';

export const createRootReducer = (history: History) => {
    return combineReducers({
        router: connectRouter(history),
        loggedUser: loggedUserReducer,
    });
};

export default function configureStore(): Store {
    const middlewares: Middleware[] = [reduxThunk, routerMiddleware(browserHistory)];
    const middlewareEnhancer: StoreEnhancer = applyMiddleware(...middlewares);
    const store: Store = createStore(createRootReducer(browserHistory), composeWithDevTools(middlewareEnhancer));
    return store;
}
