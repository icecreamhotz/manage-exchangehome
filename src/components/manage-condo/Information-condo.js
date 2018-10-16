import React , { Component } from 'react';
import axios from 'axios';
import logo from '../../images/logo.svg';
import bedroom from '../../images/bed.png';

class InformationCondo extends React.Component {

    async componentDidMount() {
        await this.fetchCondoData()
    }

    fetchCondoData = () => {
        axios.get(`http://www.witrealty.co/api/estates/${this.props.match.params.id}`).then((response) => {
            console.log(response)
        })
    }

    render() {
        return(
            <div class="ui fluid pt-30 pb-30">
                <div class="ui one column grid">
                    <img src={logo} alt={logo} />
                </div>
                <div class="ui text container center aligned one column grid">
                    <h3 class="ui header">
                        Information
                    </h3>
                </div>
                <div class="ui text container pt-50 pb-50">
                    <div class="ui one column grid">
                        <h1 class="ui header">
                            title
                            <div class="sub header ml-10" style={{display:'inline'}}><i class="map marker alternate icon"></i>Address</div>
                        </h1>
                    </div>
                    <div class="ui two column grid">
                        <div class="ten wide column">
                            <div class="price-condo">
                                For Buy : 16,500,000
                                <span class="bath"> Bath</span>
                            </div>
                            <div class="price-condo">
                                For Rent : 16,500,000
                                <span class="bath"> Bath</span>
                            </div>
                            <div class="price-condo pt-10">
                                <span class="bath">Price per SQM. 82,500 THB</span>
                            </div>
                        </div>
                        <div class="six wide column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img class="utilities-img" src={bedroom} alt={bedroom} />
                                    <div class="utilitie-text">
                                        <span class="text-description1">Bedrooms</span>
                                        <span class="text-description2">3</span>
                                    </div>
                                </div>  
                                <div class="column">
                                    <img class="utilities-img" src={bedroom} alt={bedroom} />
                                    <div class="utilitie-text">
                                        <span class="text-description1">Bedrooms</span>
                                        <span class="text-description2">3</span>
                                    </div>
                                </div>  
                                <div class="column">
                                    <img class="utilities-img" src={bedroom} alt={bedroom} />
                                    <div class="utilitie-text">
                                        <span class="text-description1">Bedrooms</span>
                                        <span class="text-description2">3</span>
                                    </div>
                                </div>  
                                <div class="column">
                                    <img class="utilities-img" src={bedroom} alt={bedroom} />
                                    <div class="utilitie-text">
                                        <span class="text-description1">Bedrooms</span>
                                        <span class="text-description2">3</span>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div class="ui green inverted segment mt-30 pt-20 pb-20 pl-30">
                        <h3>
                            European-styled townhome with big living area
                        </h3>
                        <p>Baan Klang Krung Sathorn-Charoen Raj, a townhome comes in sizes 20 Sq.wa, 200 Sqm. Consists of 3 bedrooms, 3 bathrooms, 3 stories and 3 parking areas. Close to BTS Surasak station and BRT Sathorn. Easy access to Central Rama 3 and express way.</p>
                        <button class="ui black button">View Project Info</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default InformationCondo