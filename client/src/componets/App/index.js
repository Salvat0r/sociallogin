import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Welcome from '../Welcome';
import Home from '../Home';

function App() {
    return(
        <BrowserRouter >
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route path="/home" component={Home} />
            </Switch>
        </BrowserRouter>
    )
}

export default App;


