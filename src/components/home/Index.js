import React , { Component } from 'react';
import axios from 'axios';
import Progress from '../settings/Progress.js';
import EditCondo from '../manage-condo/Edit-condo.js';
import { NavLink, Redirect } from "react-router-dom";
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';

class Index extends React.Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            estates: [],
            loading: true,
            showdelete: false,
            showsuccess: false,
            idEstate: null,
            redirectCondo: false,
            id: [],
            showerror: false,
        }
        
        this.checkTypeID = this.checkTypeID.bind(this)
        this.checkSaleType = this.checkSaleType.bind(this)
        this.fetchCondoData = this.fetchCondoData.bind(this)
        this.deleteData = this.deleteData.bind(this)
        this.seeInformation = this.seeInformation.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.checkArrayDelete = this.checkArrayDelete.bind(this)
    }

    async componentDidMount() {
        await this.fetchCondoData()
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

    fetchCondoData = () => {
            axios.get('http://www.witrealty.co/api/estates').then((response) => {
                const data = response.data
                this.setState( { estates: data, loading: false })
                console.log(data)
            })
    }

    onCheckboxChange = (e) => {
        //current data
        const options = this.state.id

        let index

        if(e.target.checked) {
            options.push(e.target.value)
        } else {
            index = options.indexOf(e.target.value)
            options.splice(index, 1)
        }

        this.setState({id: options})
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
            if(this.state.idEstate !== null) {
                this.setState({id: [...this.state.id, this.state.idEstate]})
            }
            console.log(this.state.id)
            axios.post(`http://www.witrealty.co/api/estates/delete`, this.state.id).then((response) => {
                console.log(response)
                this.fetchCondoData()
                this.setState({showsuccess: true, idEstate: null, id: []})
            })
    } 
    

    seeInformation = (id) => {
        this.setState({redirectCondo: true, idEstate: id});
    }

    checkTypeID(type_id) {
        return (type_id === "1" ? 'Condo' : 'Home')
    }
    
    checkSaleType(sale_type) {
        return (sale_type === "1" ? "Sell" : "Rent")
    }

    render() {
        const { loading } = this.state
        if(loading) { return <Progress /> }
        if (this.state.redirectCondo) {
            this.setState({redirectCondo: false})
            return <Redirect push to={`/condo/${this.state.idEstate}`}/>;
        }
        return(
            <div class="ui fluild pt-50 pb-50">
                <div class="ui container">
                    <div class="ui grid">
                        <div class="left floated six wide column">
                            <NavLink to={`condo/add`} className={"ui icon blue button left aligned"}><i class="add icon"></i> Follow</NavLink>
                        </div>
                        <div class="right aligned floated six wide column">
                            <button className={"ui icon red button"} type="button" onClick={this.checkArrayDelete}><i class="delete icon"></i> Delete</button>
                        </div>
                    </div>
                    <table class="ui inverted grey table">
                        <thead>
                            <tr>
                                <th>Choose</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Bedroom</th>
                                <th>Bathroom</th>
                                <th>Dealtype</th>
                                <th>Price</th>
                                <th>Address</th>
                                <th>Description</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            { this.state.estates.map(item => 
                            <tr>
                                <td class="center aligned">
                                    <div class="ui fitted slider checkbox">
                                        <input type="checkbox" value={item.estate_id} onChange={this.onCheckboxChange}/> <label></label>
                                    </div>
                                </td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_title}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{this.checkTypeID(item.estate_id)}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_size}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_bedroom}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_bathroom}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{this.checkSaleType(item.estate_sale_type)}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_price}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_address}</td>
                                <td  onClick={() => {this.seeInformation(item.estate_id)}}>{item.estate_description}</td>
                                <td class="center aligned">
                                    <EditCondo data={item} active={true}/>
                                    <button class="ui icon red button" onClick={() => {this.setState({ showdelete: true, idEstate: item.estate_id })}}><i class="trash icon"></i></button>
                                </td>
                            </tr>) 
                            }
                        </tbody>
                    </table>
                <SweetAlert
                    show={this.state.showdelete}
                    title="Are you sure?"
                    type="warning"
                    text="Once deleted, you will not be able to recover this data!"
                    showCancelButton
                    onConfirm={() => {this.deleteData()}}
                    onCancel={() => {
                        this.setState({ showdelete: false, idEstate: null });
                    }}
                    onEscapeKey={() => this.setState({ showdelete: false, idEstate: null })}
                    onOutsideClick={() => this.setState({ showdelete: false, idEstate: null })}
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


export default Index;