import React, { Component } from 'react';
import './App.css';
import Header from './Header.js';
import IndexPage from './home/Index.js';
import InsertCondo from './manage-condo/Insert-condo.js';
import EditCondo from './manage-condo/Edit-condo.js';
import Footer from './Footer.js';

import 'semantic-ui/dist/semantic.min.css'
import '../asset/css/exchangehome.css'

import {BrowserRouter , Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route path="/home" component={IndexPage} exact /> 
                <Route path="/condo/add" component={InsertCondo} /> 
                <Route path="/condo/:id" component={EditCondo} />
              </Switch>
              <Footer />
            </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
