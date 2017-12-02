/**
 * Title: SearchThumbail.js
 * Author: Michael Yee
 * Date Created: 11/29/2017
 * Description: Thumbnail used to display search results.
 *              Passed in prop is data for the recipe object.
 */

import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import Recipe from '../pages/recipe';
import RecipeHelper from '../classes/RecipeHelper';

class SearchThumbail extends Component {
    constructor(props){
        super(props);
        this.state = {
            quickView: false
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.heart = this.heart.bind(this);
        this.calendar = this.calendar.bind(this);
        
    }

    open() {
        this.setState( {quickView: true} );
    }

    close() {
        this.setState( {quickView: false} );
    }

    heart() {
        alert("HELLO WORLD");
    }

    calendar() {
        alert("HELLO WORLD");
    }

    render() {
        var imgsrc= "http://www.maktabatulmadina.net/img/uploaded/730.jpg";
        {this.props.data.Image ? imgsrc=this.props.data.Image : null}
        
        var ingredients = this.props.data.Ingredients.map((ingredient) => <li><span>{ingredient}</span></li>)
        var directions = this.props.data.Directions.map((step) => <li>{step}</li>)
        
        return(
            <div className="col-lg-3 col-md-3 col-sm-6 search-thumbnail" >
                {/* Need to check if recipe's img exists, if so use that */}
                <a href={'/Recipes/'+ this.props.data.Name}>
                    <img src={imgsrc}
                         className="card-img-top" />
                </a>

                {/* View Recipe, Favorite, and Plan Meal buttons */}  
                <div className="thumbnail-buttons row mx-auto">
                    <a href="javascript:undefined;" onClick={this.open} className="btn btn-dark col-4 quickview">
                        <img className="view"
                                width="18"
                                height="18"
                                src="http://icons.iconarchive.com/icons/blackvariant/button-ui-system-apps/1024/Preview-2-icon.png" />
                    </a>
                    <Modal show={this.state.quickView} onHide={this.close}>
                        <Modal.Header>{this.props.data.Name}</Modal.Header>
                        <Modal.Body>
                            <img src={imgsrc} width="100%"/>
                            <p>Difficulty: {this.props.data.Difficulty == "Undefined"?"Medium": this.props.data.Difficulty}</p>
                            <p>Rating: {RecipeHelper.getAvgRating(this.props.data)}</p>
                            <h3>Ingredients:</h3>
                            <ul>{ingredients}</ul>
                            <h3>Directions:</h3>
                            <ol>{directions}</ol>
                            <br />
                            <p>View Full Recipe <a href={"/Recipes/"+ this.props.data.Name}>Here</a>.</p>
                                                                            
                        </Modal.Body>
                    </Modal>
                    <a href="javascript:undefined;" onClick={this.heart} className="btn btn-dark col-4">
                        <img className="heart"
                                width="18"
                                height="18"
                                src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" />
                    
                    </a>
                    <a href="javascript:undefined;" onClick={this.calendar} className="btn btn-dark col-4">
                        <img className="calendar"
                                width="18"
                                height="18"
                                src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                    </a>
                </div>

                <div className="card-body">
                    {/* Title of recipe, want to put info about prep time, difficulty, etc
                        instead of score */}
                    <h4 className="card-title">{this.props.data.Name}</h4>
                    {
                        this.props.data.TimeCost == "Undefined" ? 
                        <p className="card-text"><span className="glyphicon glyphicon-time"/><span>{"1 h"}</span></p> :
                        <p className="card-text"><span className="glyphicon glyphicon-time"/><span>{this.props.data.TimeCost}</span></p>
                    }
                </div>
            </div>
        )
    }
}

export default SearchThumbail;