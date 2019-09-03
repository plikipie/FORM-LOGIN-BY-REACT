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
        this.deleteNote = this.deleteNote.bind(this);
    }
    deleteNote(id){
        if(window.confirm("Anda yakin akan menghapus catatan ini?")){
            let token = localStorage.getItem('token@pencatat') || null
            fetch(
                NOTES_URL + "/"+id,
                {
                    method: 'DELETE',
                    headers: {
                        'x-access-token':token
                    }
                }
            )
                .then((response) =>{ 
                    if(!response.ok) {
                        throw Error(response.statusText)
                    }
                    return response
                })
                .then((response) => response.json())
                .then((data) => {
                    this.updateList()
                })
                .catch((err) =>{
                    throw Error(err)
                })
        }
    }
    doLogout(){
        localStorage.removeItem('login@pencatat')
        localStorage.removeItem('token@pencatat')
        this.setState({loggedin:false}) 
    }
    componentDidMount() {
        this.updateList();
        if (localStorage.getItem('login@pencatat')) {
            this.setState({loggedin:true})
        } else {
            this.setState({loggedin:false})
        }
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

                < NoteList notes={this.state.articles}
                    isAuthenticated={this.state.loggedin}
                    onDelete={this.deleteNote} />
            </div>
        )
    }
}

 export default Notes;