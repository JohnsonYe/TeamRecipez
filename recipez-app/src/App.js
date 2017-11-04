/**
 * Title: App.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will server as the driver of the app,
 * containing all the components
 */
import React, { Component } from 'react';

//Styling
import './css/App.css';

//Router
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'

//Components
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Search from './components/pages/search';
import Kitchen from './components/pages/myKitchen';
import Planner from './components/pages/myPlanner';
import Cookbook from "./components/pages/myCookbook";

import Pantry from './components/pages/pantry';
import Exclude from './components/pages/exclude';
import Tools from './components/pages/tools';


class App extends Component {
  render() {
    return (
        <Router>
        <div className="App">
            <Header />
            <Route exact path='/' component={Homepage} />
            <Route exact path='/Search' component={Search} />
            <Route exact path='/Cookbook' component={Cookbook} />
            <Route path='/Kitchen' component={Kitchen} />
            <Route exact path='/Planner' component={Planner} />

            <div className="Kitchen">
                <Route exact path='/Kitchen/Pantry' component={Pantry} />
                <Route exact path='/Kitchen/Exclude' component={Exclude} />
                <Route exact path='/Kitchen/Tools' component={Tools} />
            </div>

          <Footer />
        </div>
        </Router>
    );
  }
}

export default App;
