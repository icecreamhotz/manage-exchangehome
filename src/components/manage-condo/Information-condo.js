import React , { Component } from 'react';
import axios from 'axios';
import bedroom from '../../images/bed.png';
import condo from '../../images/condo.png';
import OwlCarousel from 'react-owl-carousel';
import EditCondo from '../manage-condo/Edit-condo.js';
import Progress from '../settings/Progress.js';
import noimg from '../../images/noimg.png';
import { Redirect } from "react-router-dom";

import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';

class InformationCondo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            item: [],
            loading: true,
            redirect: false,
            showdelete: false,
            showsuccess: false,
            showloader: false,
        }
        this.fetchCondoData = this.fetchCondoData.bind(this)
        this.deleteData = this.deleteData.bind(this)
    }

    async componentDidMount() {
        await this.fetchCondoData()
         window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }


    deleteData  =  () => {
        this.setState({showdelete: false}, () => this.setState({showloader: true}))

        let idarray = []
        idarray.push(this.props.match.params.id)

        let req = new FormData()
        req.append('id', JSON.stringify(idarray))

        axios.post(`http://www.witrealty.co/api/estates/delete`, req).then((response) => {
            this.setState({showsuccess: true,showloader: false})
        })
    } 

    fetchCondoData = () => {
        axios.get(`http://www.witrealty.co/api/estates/${this.props.match.params.id}`).then((response) => {
            let data = response.data[0]
            this.setState({item: data, loading: false})
            this.forceUpdate()
        })
    }

    render() {
        const { loading, redirect } = this.state
        if(loading) { return <Progress /> }
        if(redirect) { return <Redirect push to='/condo'/> }
        return(
            <div class="ui fluid pt-100 pb-50">
                <div class="ui container">
                    <div class="ui very padded piled green segment">
                        <div class="ui two column grid">
                            <div class="six wide column middle aligned">

                                <OwlCarousel
                                    className="owl-theme owl-carousel owl-demo"
                                    items={1}
                                    loop
                                    >
                                
                                    {(!this.state.item[0].imgs.length > 0) ?
                                        <div class="item"><img src={noimg} alt={noimg} /></div>
                                    :
                                        this.state.item[0].imgs.map(item => {
                                            return <div class="item"><img src={atob(item.img_base)} alt={this.state.item.estate_title} /></div>
                                        })
                                    }
                                </OwlCarousel>
                            </div>
                            <div class="ten wide column">
                                <div class="ui grid">
                                    <div class="left floated seven wide column">
                                        <h3 class="ui header">{this.state.item.estate_title}</h3>
                                        <div class="ui items">
                                        <div class="item" style={{flexDirection:'initial'}}>
                                            <div class="ui small image" style={{width:'auto'}}>
                                                {(this.state.item.estate_type_id === "1" ? <img src={condo} alt={condo} style={{width:'40px'}}/> : <img src={bedroom} alt={bedroom} style={{width:'40px'}}/>)}
                                                
                                            </div>
                                            <div class="bottom aligned content">
                                                    <p>{(this.state.item.estate_type_id === "1" ? 'Condo' : 'Home')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="right floated five wide column middle aligned"> 
                                        <EditCondo data={this.state.item} clickToUpdate={this.fetchCondoData} title={'Edit'} />
                                        <button className={"ui icon red button"} type="button" onClick={() => {this.setState({showdelete: true})}}><i class="delete icon"></i> Delete</button>
                                    </div>
                                </div>
                                <div class="column pt-30">
                                    <h4 class="ui horizontal divider header">
                                        <i class="tag icon"></i>
                                            Overview
                                        </h4>
                                        <p>{this.state.item.estate_description}</p>
                                        <h4 class="ui horizontal divider header">
                                            <i class="bar chart icon"></i>
                                            Specifications
                                    </h4>
                                    <table class="ui definition table">
                                        <tbody>
                                            <tr>
                                                <td class="two wide column">Size</td>
                                                <td>{this.state.item.estate_size}</td>
                                            </tr>
                                            <tr>
                                                <td>Bedroom</td>
                                                <td>{this.state.item.estate_bedroom}</td>
                                            </tr>
                                            <tr>
                                                <td>Bathroom</td>
                                                <td>{this.state.item.estate_bathroom}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 class="ui horizontal divider header">
                                        <i class="money bill alternate outline icon"></i>
                                            Price
                                    </h4>
                                        <h5>{(this.state.item.estate_sale_type === "0" ? 'Sell : ' : 'Rent : ') + this.state.item.estate_price + ' THB'}</h5>
                                        <h4 class="ui horizontal divider header">
                                            <i class="home icon"></i>
                                            Address
                                        </h4>
                                        <p>{this.state.item.estate_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                />
                <SweetAlert
                    show={this.state.showsuccess}
                    title="Delete Complete!"
                    type="success"
                    onConfirm={() => {
                            this.setState({ showsuccess: false}, () => this.setState({redirect: true}));
                        }}
                    onEscapeKey={() => this.setState({ showsuccess: false })}
                />
            </div>
        )
    }
}

export default InformationCondo