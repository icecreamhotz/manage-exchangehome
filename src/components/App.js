import React, { Component } from 'react';

import './App.css';
import './react-draft-wysiwyg.css';
import Header from './Header.js';
import Home from './home/Home.js';
import IndexCondo from './manage-condo/HomeCondo.js';
import InsertCondo from './manage-condo/Insert-condo.js';
import InformationCondo from './manage-condo/Information-condo.js';
import IndexArticles from './manage-articles/Index-articles.js';
import Insertarticles from './manage-articles/Insert-articles.js';
import InformationArticle from './manage-articles/Information-articles.js';
import Footer from './Footer.js';
import Error from './error/error.js';

import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'

import 'semantic-ui-css/semantic.min.css';

import {BrowserRouter , Route, Switch, HashRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
          <HashRouter basename="/admin">
            <div>
              <Header />
              <Switch>
                <Route path="/" component={Home} exact /> 
                <Route path="/condo" component={IndexCondo} exact/> 
                <Route path="/condo/add" component={InsertCondo} /> 
                <Route path="/condo/:id" component={InformationCondo} />
                <Route path="/articles" component={IndexArticles} exact/>
                <Route path="/articles/add" component={Insertarticles} />
                <Route path="/articles/:id" component={InformationArticle} />
                <Route component={Error} />
              </Switch>
              <Footer />
            </div>
          </HashRouter>
      </div>
    );
  }
}

export default App;
