import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { HashRouter } from 'react-router-dom';
import './index.css';
import 'element-theme-default';
import stores from './models/index';
import * as serviceWorker from './serviceWorker';
import Routes from './routes/index';

class App extends React.Component {
    render() {
        return (
            <Provider {...stores}>
                <HashRouter>
                    <Routes />
                </HashRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
