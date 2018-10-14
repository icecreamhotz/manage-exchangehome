import React , { Component } from 'react';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

class EditCondo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            img: []
        }   
        this.onImageChange = this.onImageChange.bind(this)
        this.removeImage = this.removeImage.bind(this)
    }

    async componentDidMount() {
        await axios.post(`http://www.witrealty.co/api/estates/${this.props.match.params.id}`).then((response) => {
            console.log(response)  
        })
    }

    onImageChange(e) {
        if(e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({img: [...this.state.img, e.target.result] })
            }
            reader.readAsDataURL(e.target.files[0])
        }
        e.target.value = null
    }

    removeImage(imagePos) {
        console.log(imagePos)
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

    render() {
        return(
            <div class="ui text container pt-50 pb-50">
                <div class="ui grid">
                    <div class="row">
                        <div class="ui form">
                        <div class="field">
                            <label>Title</label>
                            <input type="text" name="title" placeholder="First Name" />
                        </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="eight wide computer column no-padding-left">
                            <div class="ui form">
                            <div class="field">
                                <label>Type</label>
                                <select name="typeid" class="ui fluid dropdown">
                                    <option value="">State</option>
                                    <option value="1">Dummy</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        <div class="eight wide computer column no-padding-right">
                            <div class="ui form">
                            <div class="field">
                                <label>Size</label>
                                <input type="number" name="size" placeholder="First Name" />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                         <div class="eight wide computer column no-padding-left">
                            <div class="ui form">
                            <div class="field">
                                <label>Bedroom</label>
                                <input type="number" name="bedroom" placeholder="First Name" />
                            </div>
                            </div>
                        </div>
                        <div class="eight wide computer column no-padding-right">
                            <div class="ui form">
                            <div class="field">
                                <label>Bathroom</label>
                                <input type="number" name="bathroom" placeholder="First Name" />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="eight wide computer column no-padding-left">
                            <div class="ui form">
                             <div class="field">
                                <label>Saletype</label>
                                <select name="saletype" class="ui fluid dropdown">
                                    <option value="">State</option>
                                    <option value="1">Dummy</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        <div class="eight wide computer column no-padding-right">
                            <div class="ui form">
                            <div class="field">
                                <label>Price</label>
                                <input type="number" name="price" placeholder="First Name" />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ui form">
                        <div class="field">
                            <label>Address</label>
                            <textarea name="address" rows="2"></textarea>
                        </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ui form">
                          <div class="field">
                            <label>Description</label>
                            <textarea name="description"></textarea>
                        </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ui fluid action input">
                        <label for="file" class="ui icon button">
                        <i class="file icon"></i>
                            Open File</label>
                        <input type="file" id="file" onChange={this.onImageChange} style={{display:'none'}} />
                        </div>
                    </div>
                </div>
                    <div class="ui two column stackable grid">
                            { this.state.img.map((item, index) => {
                                return  <div class="column">
                                            <div class="image-area">
                                                <div><img id="target" src={item }/>
                                                <button class="remove-image" style={{display:"inline"}} onClick={() => {this.removeImage(item)}}>&#215;</button></div>
                                            </div>
                                        </div>
                                })
                            }
                    </div>
                <div class="ui center aligned text container grid">
                        <button class="ui primary button">
                        Save
                        </button>
                        <button class="ui button">
                        Discard
                        </button>
                </div>
            </div>
        )
    }
} 

export default EditCondo