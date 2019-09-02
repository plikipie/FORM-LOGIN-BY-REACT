import React from 'react';
import {Link} from 'react-router-dom';
import {NOTES_URL} from '../constants';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
  

class Notes extends React.Component{

    constructor() {
        super()
        this.state = {
            articles: [],
            loggedin:false
        }

        this.updateList = this.updateList.bind(this);
        this.doLogout = this.doLogout.bind(this);
    }

    doLogout(){
        localStorage.removeItem('login@pencatat')
        localStorage.removeItem('token@pencatat')
        this.setState({loggedin:false}) 
    }
    componentDidMount() {
        this.updateList();
    }

    updateList() {
        fetch(
            NOTES_URL,
            {method:'GET'})
            .then((Response) => {
                if(!Response.ok) {
                    throw Error(Response.statusText);
                }
                return Response;
            })
            .then((Response) => Response.json())
            .then((data) => {
                this.setState({articles: data.data.notes});
            })
            .catch((err) => {
                throw Error(err);
            })
    }
    render(){
        return (
            <div className="notes">
                <h1 className="title">Catatan</h1>
                {this.state.loggedin?
                <div>
                    <p>
                        Anda Sudah Login.
                        <button onClick={this.doLogout}>Logout</button>
                    </p>
                    <NoteForm update={this.updateList}/>
                </div>
                :
                <p>
                    Anda Belum Login.
                    <Link to="/login">Login</Link>
                    atau <Link to="/register">Register</Link>
                </p>    
            }
                <hr/>

                < NoteList notes={this.state.articles}/>
            </div>
        )
    }
}

 export default Notes;