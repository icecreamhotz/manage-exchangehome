import React , { Component } from 'react';
import axios from 'axios';
import Progress from '../settings/Progress.js';
import { NavLink } from "react-router-dom";
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
            id: null,
        }
        
        this.checkTypeID = this.checkTypeID.bind(this)
        this.checkSaleType = this.checkSaleType.bind(this)
        this.fetchCondoData = this.fetchCondoData.bind(this)
        this.deleteData = this.deleteData.bind(this)
    }

    async componentDidMount() {
        await this.fetchCondoData()
        window.addEventListener('popstate', this.hiddenAlert);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert);
    }

    fetchCondoData = () => {
            axios.get('http://www.witrealty.co/api/estates').then((response) => {
                const data = response.data
                this.setState( { estates: data, loading: false })
            })
    }

    deleteData  = () => {
            axios.post(`http://www.witrealty.co/api/estates/delete/${this.state.id}`).then((response) => {
                console.log(response)
                this.fetchCondoData()
                this.setState({showsuccess: true, id: null})
            })
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
        return(
            <div class="ui fluild pt-50 pb-50">
                <div class="ui container">
                <NavLink to={`condo/add`} className={"ui icon blue button"}><i class="pencil alternate icon"></i> Follow</NavLink>
                    <table class="ui center aligned selectable celled table">
                        <thead>
                            <tr>
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
                                <td>{item.estate_title}</td>
                                <td>{this.checkTypeID(item.estate_id)}</td>
                                <td>{item.estate_size}</td>
                                <td>{item.estate_bedroom}</td>
                                <td>{item.estate_bathroom}</td>
                                <td>{this.checkSaleType(item.estate_sale_type)}</td>
                                <td>{item.estate_price}</td>
                                <td>{item.estate_address}</td>
                                <td>{item.estate_description}</td>
                                <td>
                                    <NavLink to={`condo/${item.estate_id}`} className={"ui icon green button"}><i class="cloud icon"></i></NavLink>
                                    <button class="ui icon red button" onClick={() => {this.setState({ showdelete: true, id: item.estate_id })}}><i class="trash icon"></i></button>
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
            this.setState({ showdelete: false, id: null });
          }}
          onEscapeKey={() => this.setState({ showdelete: false, id: null })}
          onOutsideClick={() => this.setState({ showdelete: false, id: null })}
        />
           <SweetAlert
          show={this.state.showsuccess}
          title="Demo Complex"
          type="success"
          text="SweetAlert in React"
          showCancelButton
          onConfirm={() => {
            this.setState({ showsuccess: false });
          }}
          onCancel={() => {
            this.setState({ showsuccess: false });
          }}
          onEscapeKey={() => this.setState({ showsuccess: false })}
          onOutsideClick={() => this.setState({ showsuccess: false })}
        />
                </div>
              
            </div>
        )
    }
}

export default Index;