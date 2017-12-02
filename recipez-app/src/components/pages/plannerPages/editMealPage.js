/**
 * Title: plannerPageDefault.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be in charge of editing or creating new meals
 * Depending on whether the user is planning or removing the meal
 *
 * Time will be based of 24 hour Military System
 */
import React, { Component } from 'react';
import {Button, Modal, DropdownButton, MenuItem, ButtonToolbar} from 'react-bootstrap';
import RecipeHelper from "../../classes/RecipeHelper";


function Duration(props) {
    return (
        <div>
            <div className="d-sm-inline-block">
                <h4>Cooking Duration</h4>
            </div>&nbsp;
            <div className="d-sm-inline-block">
                <img
                    className="image-fluid"
                    src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                    alt="Timer"
                    width={20}
                    height={20}
                />
            </div>
        </div>
    );

}

function DaySelector(props) {
    return (
        <div className="mt-3">
        <p>Select a day</p>
        <DropdownButton
            onSelect={props.handleClick}
            title={props.btnTitle}
            id="dropdown-no-caret"
            noCaret>
            <MenuItem eventKey="0">Sunday</MenuItem>
            <MenuItem eventKey="1">Monday</MenuItem>
            <MenuItem eventKey="2">Tuesday</MenuItem>
            <MenuItem eventKey="3">Wednesday</MenuItem>
            <MenuItem eventKey="4">Thursday</MenuItem>
            <MenuItem eventKey="5">Friday</MenuItem>
            <MenuItem eventKey="6">Saturday</MenuItem>
        </DropdownButton>
        </div>
    );
}

function TimeSelector(props) {
    return(
        <div className="mt-3">
            <p>Select a starting time</p>
            <ButtonToolbar>
                <DropdownButton
                    onSelect={props.handleHour}
                    title={props.hour}
                    noCaret>
                    <MenuItem eventKey="1">1</MenuItem>
                    <MenuItem eventKey="2">2</MenuItem>
                    <MenuItem eventKey="3">3</MenuItem>
                    <MenuItem eventKey="4">4</MenuItem>
                    <MenuItem eventKey="5">5</MenuItem>
                    <MenuItem eventKey="6">6</MenuItem>
                    <MenuItem eventKey="7">7</MenuItem>
                    <MenuItem eventKey="8">8</MenuItem>
                    <MenuItem eventKey="9">9</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="11">11</MenuItem>
                    <MenuItem eventKey="12">12</MenuItem>
                </DropdownButton>
                :
                <DropdownButton
                    onSelect={props.handleMin}
                    title={props.min}
                    noCaret>
                    <MenuItem eventKey="0">00</MenuItem>
                    <MenuItem eventKey="5">05</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="15">15</MenuItem>
                    <MenuItem eventKey="20">20</MenuItem>
                    <MenuItem eventKey="25">25</MenuItem>
                    <MenuItem eventKey="30">30</MenuItem>
                    <MenuItem eventKey="35">35</MenuItem>
                    <MenuItem eventKey="40">40</MenuItem>
                    <MenuItem eventKey="45">45</MenuItem>
                    <MenuItem eventKey="50">50</MenuItem>
                    <MenuItem eventKey="55">55</MenuItem>
                </DropdownButton>
                <DropdownButton
                    onSelect={props.handleNoon}
                    title={props.noon}
                    noCaret>
                    <MenuItem eventKey="am">am</MenuItem>
                    <MenuItem eventKey="pm">pm</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        </div>
    );

}

class MealEditor extends Component {

    constructor(props) {
        super(props);

        var strStartTime = props.data.getMealStartTime(this.props.day, this.props.mealIndex),
            startHr = "12",
            startMin = "00",
            noon = "pm",
            endTime = "calculating ...",
            days =  ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

        if(strStartTime != "Unavailable" ) {
            var colon = strStartTime.indexOf(":");
            startHr = strStartTime.substring(0,colon);
            startMin = strStartTime.substring(colon + 1, colon + 3);
            endTime = props.data.getMealEndTime(this.props.day, this.props.mealIndex);
        }

        this.state = {
            mealData: props.data,
            days: days,
            showEditor: false,
            dayOnBtn: days[this.props.day],
            hourOnBtn: startHr,
            minOnBtn: startMin,
            noonOnBtn: noon,
            endtime: endTime
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleHourSelection = this.handleHourSelection.bind(this);
        this.handleMinSelection = this.handleMinSelection.bind(this);
        this.handleNoonSelection = this.handleNoonSelection.bind(this);
    }

    /** Updates day on button */
    handleDaySelection(evt) {
        this.setState({ dayOnBtn: this.state.days[evt] });
    }

    /**Updates hour on button*/
    handleHourSelection(evt) {
        this.setState( {hourOnBtn: evt} );
    }

    /**Updates min on button*/
    handleMinSelection(evt) {
        this.setState( {minOnBtn: evt} );
    }

    /** Updates noon on button */
    handleNoonSelection(evt) {
        this.setState( {noonOnBtn: evt} );
    }


    /**Method that opens Modal*/
    open() {
        this.setState( {showEditor: true} );
    }

    /**Method that closes modal*/
    close() {
        this.setState( {showEditor: false} );
    }

    /** creates/overwrites meal to the meal */
    save() {

    }

    render() {

        var editButton = (
                <a
                    className="card-link"
                    onClick={this.open}>{this.props.recipe}
                </a>
            ),
            createButton = (
                <a className="btn btn-light"
                    onClick={this.open}>
                    <img alt="planner"
                         width="18"
                         height="18"
                         src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                    Plan Meal
                </a>
            ),
            button;

        if(this.props.edit == true) {
            button = editButton;
        }
        else {
            button = createButton;
        }

        return (
            <div>
                {button}
            <Modal show={this.state.showEditor} onHide={this.close}>
                <Modal.Header>{this.props.recipe}</Modal.Header>
                <Modal.Body>
                    <figure>
                        <img
                            className="img-fluid"
                            src="http://twolovesstudio.com/wp-content/uploads/sites/5/2017/05/99-Best-Food-Photography-Tips-5-1.jpg"
                            alt="No Image"
                        />
                    </figure>

                    <Duration />
                    <div className="border
                                    border-dark
                                    border-top-0
                                    border-right-0
                                    border-left-0
                                    mb-2">
                        <h2>Meal Info</h2>
                    </div>
                    <DaySelector
                        handleClick={this.handleDaySelection}
                        btnTitle={this.state.dayOnBtn}
                    />
                    <TimeSelector
                        handleHour={this.handleHourSelection}
                        handleMin={this.handleMinSelection}
                        handleNoon={this.handleNoonSelection}
                        hour={this.state.hourOnBtn}
                        min={this.state.minOnBtn}
                        noon={this.state.noonOnBtn}
                    />

                    <div className="mt-3">
                    <p>Your meal should be ready at {this.state.endtime}.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button onClick={this.save}>Save</Button>
                        <Button bsStyle="danger" onClick={null}>Delete</Button>
                        <Button onClick={this.close}>Close</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
            </div>
        );
    }
}

export default MealEditor;
