/**
 * Title: myKitchen.js
 * Authors: Andrew Sanchez, Vivian Lam
 * Date Created: 11/2/2017
 * Description: This file will serve as the Kitchen page
 */
import React, { Component } from 'react';

import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

//Components
import Pantry from './pantry'
import Exclude from './exclude'
import Tools from './tools'

class Kitchen extends Component {
    render() {
        return (

            <div>
                <Tabs defaultTab="Pantry" >

                    <div id="theTabs">
                    <TabLink to="Pantry" id="pantry"> Pantry </TabLink>
                    <TabLink to="Exclude" id="exclude"> Exclude </TabLink>
                    <TabLink to="Tools" id="tools"> Tools </TabLink>
                    </div>

                    <TabPanel>
                    <TabContent for="Pantry">
                        <h2> Pantry! </h2>
                        <Pantry />
                    </TabContent>
                    </TabPanel>
                    <TabPanel title="Exclude">
                    <TabContent for="Exclude">
                        <h2> Exclude! </h2>
                        <Exclude />
                    </TabContent>
                    </TabPanel>
                    <TabContent for="Tools">
                        <TabPanel>
                        <h2> Tools! </h2>
                        <Tools />
                        </TabPanel>
                    </TabContent>
                </Tabs>

            </div>
        );

    }
}

export default Kitchen;