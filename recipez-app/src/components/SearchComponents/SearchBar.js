/**
 * Title: SearchBar.js
 * Author: Alexander Haggart
 * Date Created: 11/18/2017
 * Description: modular searchbar component that provides autocomplete in a dropdown menu
 */
import React, { Component } from 'react';

class SearchBar extends Component{
    constructor(props){
        super(props)

        this.state = {
            query:'',
            completions:[],
            listOpen:false
        }

        this.autocomplete = this.autocomplete.bind(this);
        this.textEntry = this.textEntry.bind(this);
        this.focusHiddenForm = this.focusHiddenForm.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    focusHiddenForm(e){
        this.hiddenForm.focus()
    }

    textEntry(value){
        this.setState({query:value})
        if(value.length>0){
            this.props.client.autocomplete(value,this.autocomplete)
        } else {
            this.setState({completions:[]})
        }        
    }

    autocomplete(completions){
       this.setState({completions:completions})
    }

    addItem(e){
        e.preventDefault()
        this.props.callback(this.state.completions[0])
        this.setState({completions:[],query:''})
    }

    render(){
        return(
            <div className='searchbar-base'>
                <div className='searchbar-container'>
                    <form onSubmit={this.addItem}>{/* we use an <input> element to read text input so we don't have to do keypress handling*/}
                        <input className='search-input' type='text' onChange={(e)=>this.textEntry(e.target.value)} ref={(input)=>this.hiddenForm=input} value={this.state.query}/>
                    </form>
                    <div className='search-overlay' onClick={this.focusHiddenForm}>{/* display the user's entry and a completion*/}
                        <span>{this.state.query}</span><span style={{color:'green'}}>{this.state.completions[0]?this.state.completions[0].substring(this.state.query.length):''}</span>
                    </div>
                    <div className='searchbar-contents-expand' open={this.state.listOpen} onClick={(e)=>this.setState({listOpen:true})}></div>
                    <div className='autocomplete-result-container' open={this.state.completions.length > 0}>
                        {this.state.completions.map((c)=><div className='autocomplete-result'>{c}</div>)}
                    </div>
                </div>
            </div>
            );
    }

}

export default SearchBar;