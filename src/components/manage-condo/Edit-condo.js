import React , { Component } from 'react';
import axios from 'axios';
import { Button, Header, Modal, TransitionablePortal, Icon } from 'semantic-ui-react'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import { Dropdown } from 'semantic-ui-react'
import { validateCondoForm } from '../validate/condoForm.js'
import SimpleReactValidator from 'simple-react-validator'
import Loader from '../settings/Loader.js';

class EditCondo extends React.Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        this.state = {
            img: this.props.data[0].imgs,
            open: false,
            activeRent: (props.data.estate_sale_type != 0 ? 'active' : ''),
            activeSell: (props.data.estate_sale_type == 0 ? 'active' : ''),
            title: props.data.estate_title,
            type: props.data.estate_type_id,
            size: props.data.estate_size,
            bedroom: props.data.estate_bedroom,
            bathroom: props.data.estate_bathroom,
            sellType: props.data.estate_sale_type,
            price: props.data.estate_price,
            address: props.data.estate_address,
            description: props.data.estate_description,
            title_edit: props.title,
            updateDataOnParent: props.clickToUpdate,
            errorClass: [false, false, false, false, false],
            showerror: false,
            showedit: false,
            showsuccess: false,
            showloader: false,
            type_option: [
                {
                    text: 'Condominium',
                    value: '1'
                },
                {
                    text: 'Townhouse',
                    value: '2'
                },
                {
                    text: 'Singlehouse',
                    value: '3'
                },
                {
                    text: 'Land',
                    value: '4'
                },
                {
                    text: 'Detached House',
                    value: '5'
                },
                {
                    text: 'Commercial Building',
                    value: '6'
                },
                {
                    text: 'Hotel & Resort',
                    value: '7'
                }
            ],
            roomTotal: [
                {
                    text: 'One',
                    value: '1'
                },
                {
                    text: 'Two',
                    value: '2'
                },
                {
                    text: 'Three',
                    value: '3'
                },
                {
                    text: 'Four',
                    value: '4'
                },
                {
                    text: 'Five',
                    value: '5'
                },
                {
                    text: 'Six',
                    value: '6'
                },
                {
                    text: 'Seven',
                    value: '7'
                },
                {
                    text: 'Eight',
                    value: '8'
                },
                {
                    text: 'Nine',
                    value: '9'
                },
                {
                    text: 'Ten',
                    value: '10'
                },
            ]
        }   
        this.onImageChange = this.onImageChange.bind(this)
        this.removeImage = this.removeImage.bind(this)
        this.setValueSellTypeClick = this.setValueSellTypeClick.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateData = this.updateData.bind(this)
        this.onChangeDropDown = this.onChangeDropDown.bind(this)
        this.setValueRentTypeClick = this.setValueRentTypeClick.bind(this)
    }

    componentDidMount() {
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

    async handleInputChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name

        let count = 0

        let form = this.refs.formCondo
        let data = new FormData(form)
        for(let nameloop of data.keys()) {
            if(nameloop !== 'type' && nameloop !== 'bedroom' && nameloop !== 'bathroom') { 
                const classReturn = await validateCondoForm(count, this.state.errorClass, nameloop, name, value)
                await this.setState({errorClass: classReturn}, function() {  
                    count += 1
                })
            } 
        }
        this.setState({[name]: value})
    }

    setValueSellTypeClick = (value) => {
        this.setState({sellType: value, activeRent: '', activeSell: 'active'})
    }

    setValueRentTypeClick = (value) => {
        this.setState({sellType: value, activeRent: 'active', activeSell: ''})
    }

    closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
        this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
    }

    close = () => this.setState({ open: false })

    onImageChange(event) {
         let files = event.target.files
        if(!files[0]) {
            return
        }

        for(let file of files) {
            let render = new FileReader()
            render.onload = (event) => {
                let image = new Image()

                image.onload = () => {          
                    let canvas = document.createElement("canvas")
                    var ctx = canvas.getContext("2d")

                    var MAX_WIDTH = 1280;
                    var MAX_HEIGHT = 720;
                    var width = image.width;
                    var height = image.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(image, 0, 0, width, height);
                    let imgnaja = canvas.toDataURL();
                    this.setState({img: [...this.state.img, {img_base: btoa(imgnaja)}] })
                }
                image.src = event.target.result
            
                /*
                if(file.size > 1000000) {
                    let image = new Image()
                    image.onload = () => {
                        let tmp = this.imageToDataUrl(image, image.width / 5, image.height / 5)
                          this.setState({img: [...this.state.img, {img_base: btoa(tmp)}] })
                    }
                    image.src = event.target.result
                } else {
                     this.setState({img: [...this.state.img, {img_base: btoa(event.target.result)}] })
                }*/
            }
            render.readAsDataURL(file)
        }
        event.target.value = null
    }

    updateData = async (event) => {
        const mapImage = this.state.img.map(item => JSON.stringify(item.img_base).replace(/['"]+/g, '')) // replace for remove the double quotes
        const getMap = mapImage.reduce((r, e) => r.push(e) && r, [])
        
        this.setState({showedit: false})

        let count = 0
        const newArr = this.state.errorClass.slice()

        let form = this.refs.formCondo
        let data = new FormData(form)
        for(let name of data.keys()) {
            if(name != 'type' && name != 'bedroom' && name != 'bathroom') {
                if(!this.validator.fieldValid(name)) {
                    newArr[count] = true
                    this.setState({errorClass: newArr})
                } else {
                    newArr[count] = false
                    this.setState({errorClass: newArr})
                }
                count++
            }
        }

        if(!this.validator.allValid() ){
            setTimeout(() => {
                this.setState({showerror: true})
            }, 200);
        } else {
            this.setState({showloader: true})
            let req = new FormData()

            req.append('title', this.state.title)
            req.append('size', this.state.size)
            req.append('bathroom', this.state.bathroom)
            req.append('bedroom', this.state.bedroom)
            req.append('type_id', this.state.type)
            req.append('price', this.state.price)
            req.append('address', this.state.address)
            req.append('description', this.state.description)
            req.append('sale_type', this.state.saleType)
            req.append('img', JSON.stringify(getMap))
        
            await axios.post(`http://www.witrealty.co/api/estates/update/${this.props.data.estate_id}`, req).then((response) => {
                this.setState({showsuccess: true, showloader: false})
                this.state.updateDataOnParent()
            })
        }
    }

    removeImage(imagePos) {
        //console.log(imagePos)
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

     onChangeDropDown = (e, data) => {
        let namedropdown = data.name
        let valuedropdown = data.value
        this.setState({[namedropdown]: valuedropdown})
    }


    render() {
        const { open, closeOnEscape, closeOnDimmerClick } = this.state
        return(
            <div style={{display:'inline'}}>
            <button class="ui icon green button" onClick={this.closeConfigShow(false, true)}><i class="pencil alternate icon"></i>{this.state.title_edit}</button>
                        <Modal
                            open={open}
                            closeOnEscape={closeOnEscape}
                            closeOnDimmerClick={closeOnDimmerClick}
                            onClose={this.close}
                            closeIcon
                            className="mt-50 mb-50"
                            >
                            <Modal.Header>Edit Form</Modal.Header>
                            <Modal.Content>
                        <div class="ui text container grid pt-30 pb-30" >
                            <div className={`loader-submit ${this.state.showloader ? '' : 'hide-loader'}`}>
                                <div class="loader"></div>
                            </div>
                        <form class="ui form" ref="formCondo">
                            <div className={"field " + (this.state.errorClass[0] ? 'error' : '')}>
                                <label>Title</label>
                                <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange}/>
                                {this.validator.message('title', this.state.title, 'required')}
                            </div>
                                <div class="field">
                                    <div class="two fields">
                                        <div class="field">
                                            <label>Type</label>
                                             <Dropdown name="type" value={this.state.type} fluid selection options={this.state.type_option} onChange={this.onChangeDropDown}/>
                                        </div>
                                        <div className={"field " + (this.state.errorClass[1] ? 'error' : '')}>
                                            <label>Size</label>
                                            <input type="number" name="size" value={this.state.size} onChange={this.handleInputChange} />
                                             {this.validator.message('size', this.state.size, 'decimal')}
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="two fields">
                                         <div class="field">
                                            <label>Bedroom</label>
                                            <Dropdown name="bedroom" value={this.state.bedroom} fluid selection options={this.state.roomTotal} onChange={this.handleInputChange}/>
                                        </div>
                                        <div class="field">
                                            <label>Bathroom</label>
                                            <Dropdown name="bathroom" value={this.state.bathroom} fluid selection options={this.state.roomTotal} onChange={this.handleInputChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <label>Selltype</label>
                                    <div class="two fields">
                                        <div class="field">
                                            <button type="button" className={`fluid ui inverted green button ${this.state.activeRent}`} onClick={() => {this.setValueRentTypeClick(true)}}>Rent</button>
                                        </div>
                                        <div class="field">
                                            <button type="button" className={`fluid ui inverted blue button ${this.state.activeSell}`} onClick={() => {this.setValueSellTypeClick(false)}}>Sell</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={"field " + (this.state.errorClass[2] ? 'error' : '')}>
                                    <label>Price</label>
                                        <input type="number" name="price" value={this.state.price} onChange={this.handleInputChange}/>
                                            {this.validator.message('price', this.state.price, 'required')}
                                </div>
                                <div className={"field " + (this.state.errorClass[3] ? 'error' : '')}>
                                    <label>Address</label>
                                    <textarea name="address" rows="2" value={this.state.address} onChange={this.handleInputChange}></textarea>
                                            {this.validator.message('address', this.state.address, 'required')}
                                </div>
                                <div className={"field " + (this.state.errorClass[4] ? 'error' : '')}>
                                    <label>Description</label>
                                    <textarea name="description" value={this.state.description} onChange={this.handleInputChange}></textarea>
                                           {this.validator.message('description', this.state.description, 'required')}
                                </div>
                                <div class="field">
                                    <div class="ui two column stackable grid">
                                        { this.state.img.map((item, index) => {
                                        return  <div class="column pt-20 pb-20">
                                                    <div class="image-area">
                                                        <div><img id="target" src={atob(item.img_base)} alt={this.state.title}/>
                                                        <button class="remove-image" style={{display:"inline"}}  type="button" onClick={() => {this.removeImage(item)}}>&#215;</button></div>
                                                    </div>
                                                </div>
                                        })
                                        }
                                    </div>
                                </div>
                                <div class="field mt-20">
                                    <div class="ui fluid action input">
                                    <label for="file" class="ui icon button">
                                    <i class="file icon"></i>
                                        Open File</label>
                                    <input type="file" id="file" onChange={this.onImageChange} style={{display:'none'}} />
                                    </div>
                                </div>
                                <div class="field">
                                    <button class="ui fluid inverted green button" type="button" onClick={() => {this.setState({ showedit: true})}}>Submit</button>
                                </div>
                        </form>
                    </div>
                        </Modal.Content>
                        </Modal>
                <SweetAlert
                    show={this.state.showedit}
                    title="Are you sure?"
                    type="warning"
                    text="You need to update really!!"
                    showCancelButton
                    onConfirm={() => {this.updateData()}}
                    onCancel={() => {
                        this.setState({ showedit: false, open:true});
                    }}
                    onEscapeKey={() => this.setState({ showedit: false})}
                    onOutsideClick={() => this.setState({ showedit: false })}
                    />
                <SweetAlert
                    show={this.state.showsuccess}
                    title="Update Complete!"
                    type="success"
                    onConfirm={() => {
                        this.setState({ showsuccess: false });
                    }}
                    onEscapeKey={() => this.setState({ showsuccess: false })}
                    onOutsideClick={() => this.setState({ showsuccess: false })}
                />
                <SweetAlert
                    show={this.state.showerror}
                    title="Error , please check you data some field is empty or invalid!"
                    type="error"
                    onConfirm={() => {
                        this.setState({ showerror: false });
                    }}
                    onEscapeKey={() => this.setState({ showerror: false })}
                    onOutsideClick={() => this.setState({ showerror: false })}
                />
            </div>
        )
    }
} 

export default EditCondo