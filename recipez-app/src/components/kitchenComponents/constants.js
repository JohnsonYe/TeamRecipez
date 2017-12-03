/**
 * Title: Kitchen.js
 * Authors: Vivian Lam
 * Date Created: 12/2/2017
 * Description: This file will contain all the constants for kitchen.
 */

import React from 'react';
import SearchBar from '../SearchComponents/SearchBar'


//Creates the well and button object that shows up on the screen
export const AddItem = ({item, remove, addOut}) => {

    return (

        <form>
            <div className="well well-sm" id="pantry-node">
                {item}
                <button className = "btn btn-danger"
                        id = "btn-r"
                        type = "button"
                        onClick = {()=> remove(item)}
                        title = "Remove"
                        style = {{float:'right', display:'block',
                            fontSize:'10px', marginTop:'-10.5px',
                            marginRight:'-9px'}}>

                    <span className = "glyphicon glyphicon-trash"
                          style={{fontSize:'1.5em'}}/>
                </button>
                <button className = "btn btn-warning"
                        id = "btn-d"
                        type = "button"
                        onClick = {()=> addOut(item) }
                        title = "Add to Restock"
                        style={{float:'right', display:'block',
                            fontSize:'10px', marginTop:'-10.5px',
                            marginLeft:'-7px'}}>
                    <span className = "glyphicon glyphicon-alert"
                          style={{fontSize:'1.5em'}}/>
                </button>
            </div>

        </form>
    );
}

// The well and buttons for the exclude and cookware
export const AddExcludeCookware = ({item, remove}) => {

    return (

        <form>
            <div className="well well-sm" id="pantry-node">
                {item}
                <button className = "btn btn-danger"
                        id = "btn-one"
                        type = "button"
                        onClick = {()=> remove(item)}
                        title = "Remove"
                        style = {{float:'right', display:'block', fontSize:'10px',
                            marginTop:'-10px', marginRight:'-10px'}}>

                    <span className = "glyphicon glyphicon-trash"
                          style={{fontSize:'1.5em'}}/>
                </button>
            </div>

        </form>
    );
}

// The well and buttons for the restock list
export const AddRestock = ({item, remove, addBack}) => {

    return (

        <form>
            <div className="well well-sm" id="pantry-node">
                {item}
                <button className = "btn btn-danger"
                        type = "button"
                        onClick = {()=> remove(item)}
                        title = "Remove"
                        style = {{float:'right', display:'block',
                            fontSize:'12px', marginTop:'-10.5px',
                            marginRight:'-9px'}}>

                    <span className = "glyphicon glyphicon-trash"
                          style={{fontSize:'1.5em'}}/>
                </button>
                <button className = "btn btn-success"
                        type = "button"
                        onClick = {()=> addBack(item) }
                        title = "Add back to list"
                        style = {{float:'right', display:'block',
                            fontSize:'12px', marginTop:'-10.5px',
                            marginLeft:'-7px'}}>
                    <span className = "glyphicon glyphicon-plus-sign"
                          style={{fontSize:'1.5em'}}/>
                </button>
                <button className = "btn btn-info"
                        type = "button"
                        onClick = {()=> {} }
                        title = "Add to Shopping List"
                        style = {{float:'right', display:'block',
                            fontSize:'12px', marginTop:'-10.5px',
                            marginRight:'7px'}}>
                    <span className = "glyphicon glyphicon-shopping-cart"
                          style={{fontSize:'1.5em'}}/>
                </button>

            </div>

        </form>
    );
}


// Maps each item into a node
export const ItemList = ( {items, remove, addOut} ) => {

    // Map through nodes
    const itemNode = items.map((item)=>
        (<AddItem item = {item}
                  key={item.id}
                  remove={remove}
                  addOut={addOut}
        />));

    return (<div> {itemNode}  </div>);
}

// Maps each item into a node
export const ExcludeCookwareList = ( {items, remove} ) => {

    // Map through nodes
    const itemNode = items.map((item)=>
        (<AddExcludeCookware item = {item}
                             key={item.id}
                             remove={remove}
        />));

    return (<div> {itemNode}  </div>);
}

// Maps each item into a node
export const RestockList = ( {items, remove, addBack} ) => {
    const itemNode = items.map( (item) =>
        (<AddRestock item = {item}
                     key={item.id}
                     remove={remove}
                     addBack = {addBack} />));

    return (<div> {itemNode}  </div>);
}


// Actually calls the add function to update state
export const ItemForm = ( {addProtein,
                       addDairy,
                       addVegetable,
                       addFruit,
                       addGrain,
                       addOther,
                       getKey,
                       handleChange, internalClient} ) => {

    // Input Tracker
    let input;

    return (
        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( this.searchbar.getValue() !== '') {

                // Call the add function for each group
                switch( getKey ){
                    case "Protein":
                        addProtein(this.searchbar.getValue());
                        break;
                    case "Dairy":
                        addDairy(this.searchbar.getValue());
                        break;
                    case "Vegetable":
                        addVegetable(this.searchbar.getValue());
                        break;
                    case "Fruit":
                        addFruit(this.searchbar.getValue());
                        break;
                    case "Grain":
                        addGrain(this.searchbar.getValue());
                        break;
                    case "Other":
                        addOther(this.searchbar.getValue());
                        break;
                    default:
                        break;
                }

                // Clearing
                this.searchbar.reset();
            }
        }}>
        <div className = "input-group">
            <SearchBar client = {internalClient} ref={(searchbar)=>{this.searchbar = searchbar}}/>

                <span className = "input-group-btn">
                        <button className = "btn btn-success"
                                type = "submit"
                                title = "Add to list"
                                >
                            <i className = "glyphicon glyphicon-plus-sign" />
                        </button>
                </span>
        </div>

        </form>
    );
};

// Calls the add function to update for exclude and cookware
export const ExcludeCookwareForm = ({addExclude, addCookware, getModalKey}) => {

    // Input Tracker
    let input;

    return (
        // Add to the form
        <form onSubmit={(e) => {
            e.preventDefault();

            // Preventing empty answers
            if( input.value !== '') {

                if( getModalKey == "Exclude" ) {
                    addExclude(input.value);
                }else if( getModalKey == "Cookware"){
                    addCookware(input.value);
                }

                // Clearing
                input.value = '';
            }
        }}>


            <div className="input-group">
                <input className="form-control" type= "text" id = "enter"
                       autocomplete="off"
                       placeholder="Add"
                       ref={node => { input = node; }} />

                <span className = "input-group-btn">
                        <button className="btn btn-success"
                                type="submit"
                                title="Add to list">
                            <i className = "glyphicon glyphicon-plus-sign" />
                        </button>
                </span>
            </div>
        </form>
    );
}
