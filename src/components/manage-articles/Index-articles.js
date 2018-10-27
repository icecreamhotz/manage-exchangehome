import React , { Component } from 'react';
import axios from 'axios';
import Progress from '../settings/Progress.js';
import EditArticle from '../manage-articles/Edit-articles.js';
import { NavLink, Redirect } from "react-router-dom";
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';

class HomeCondo extends React.Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            articles: [],
            loading: true,
            showdelete: false,
            showsuccess: false,
            idArticle: null,
            redirectCondo: false,
            id: [],
            showerror: false,
            setChecked: []
        }
    
        this.fetchArticleData = this.fetchArticleData.bind(this)
        this.deleteData = this.deleteData.bind(this)
        this.seeInformation = this.seeInformation.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.checkArrayDelete = this.checkArrayDelete.bind(this)
    }

    async componentDidMount() {
        await this.fetchArticleData()
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

    fetchArticleData = () => {
        axios.get('http://www.witrealty.co/api/forums').then((response) => {
            const data = response.data
            this.setState( { articles: data, loading: false })
        })
    }

    onCheckboxChange = (e, i) => {
        //current data
        const options = this.state.id

        let index

        if(e.target.checked) {
            options.push(e.target.value)
        } else {
            index = options.indexOf(e.target.value)
            options.splice(index, 1)
        }

        //set checked value
        let cbvalue = this.state.setChecked.slice()
        cbvalue[i] = e.target.checked

        // set state value
        this.setState({id: options, setChecked: cbvalue})
    }

    checkArrayDelete = () => {
        if(!this.state.id.length > 0) {
            this.setState({showerror: true})
        } else {
            this.setState({ showdelete: true})
        }
    }

    deleteData  =  () => {
            this.setState({showdelete: false})  
            if(this.state.idArticle !== null) {
                this.setState({id: [...this.state.id, this.state.idArticle]})
            }

            let req = new FormData()
            req.append('id', JSON.stringify(this.state.id))

            axios.post(`http://www.witrealty.co/api/forums/delete`, req).then((response) => {
                this.fetchArticleData()
                this.setState({showsuccess: true, idArticle: null, id: []})
                // set unchecked item deleted
                const cbvalue  = this.state.setChecked.map(item =>  item = false)
                this.setState({setChecked: cbvalue})
            })
    } 
    

    seeInformation = (id) => {
        this.setState({redirectCondo: true, idArticle: id});
    }       

    render() {
        const { loading } = this.state
        if(loading) { return <Progress /> }
        if (this.state.redirectCondo) {
            this.setState({redirectCondo: false})
            return <Redirect push to={`/articles/${this.state.idArticle}`}/>
        }
        return(
                    <div class="ui fluild pt-100 pb-50 bg-gray" style={{minHeight:'100vh'}}>
                        <div class="ui container">
                            <div class="ui grid">
                                <div class="left floated six wide column" style={{textAlign:'left'}}>
                                    <NavLink to={`articles/add`} className={"ui icon blue button left aligned"}><i class="add icon"></i> Add</NavLink>
                                </div>
                                <div class="right aligned floated six wide column">
                                    <button className={"ui icon red button"} type="button" onClick={this.checkArrayDelete}><i class="delete icon"></i> Delete</button>
                                </div>
                            </div>
                            <div class="pt-10" style={{overflowX:'auto'}}>
                                <table class="ui inverted grey table selectcondo center aligned">
                                    <thead>
                                        <tr>
                                            <th>Choose</th>
                                            <th>Title</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.articles.map((item,i) => 
                                        <tr style={{cursor:'pointer'}}>
                                            <td class="center aligned">
                                                <div class="ui fitted slider checkbox">
                                                    <input type="checkbox" checked={this.state.setChecked[i]} value={item.id} onChange={(e) => this.onCheckboxChange(e, i)}/> <label></label>
                                                </div>
                                            </td>
                                            <td  onClick={() => {this.seeInformation(item.id)}}>{item.forum_title}</td>
                                            <td>
                                                <EditArticle data={item} clickToUpdate={this.fetchArticleData} title=""/>
                                                <button class="ui icon red button" onClick={() => {this.setState({ showdelete: true, idArticle: item.id })}}><i class="trash icon"></i></button>
                                            </td>
                                        </tr>) 
                                        }
                                    </tbody>
                                </table>
                            </div>
                        <SweetAlert
                            show={this.state.showdelete}
                            title="Are you sure?"
                            type="warning"
                            text="Once deleted, you will not be able to recover this data!"
                            showCancelButton
                            onConfirm={() => {this.deleteData()}}
                            onCancel={() => {
                                this.setState({ showdelete: false, idArticle: null });
                            }}
                            onEscapeKey={() => this.setState({ showdelete: false, idArticle: null })}
                            onOutsideClick={() => this.setState({ showdelete: false, idArticle: null })}
                            />
                        <SweetAlert
                            show={this.state.showsuccess}
                            title="Delete Complete!"
                            type="success"
                            onConfirm={() => {
                                this.setState({ showsuccess: false });
                            }}
                            onEscapeKey={() => this.setState({ showsuccess: false })}
                            onOutsideClick={() => this.setState({ showsuccess: false })}
                        />
                        <SweetAlert
                            show={this.state.showerror}
                            title="Error , please select your item for delete!"
                            type="error"
                            onConfirm={() => {
                                this.setState({ showerror: false });
                            }}
                            onEscapeKey={() => this.setState({ showerror: false })}
                            onOutsideClick={() => this.setState({ showerror: false })}
                        />
                        </div>
                    </div>
        )
    }
}


export default HomeCondo