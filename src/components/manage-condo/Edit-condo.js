import React , { Component } from 'react';
import axios from 'axios';
import { Button, Header, Image, Modal, TransitionablePortal, Icon } from 'semantic-ui-react'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import { Dropdown } from 'semantic-ui-react'
import { validateCondoForm } from '../validate/condoForm.js'
import SimpleReactValidator from 'simple-react-validator'

class EditCondo extends React.Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        this.state = {
            img: this.props.data[0].imgs,
            open: false,
            imgUpload: [],
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
            errorClass: [false, false, false, false, false],
            showerror: false,
            showedit: false,
            showsuccess: false,
            type_option: [
                {
                    text: 'Condo',
                    value: '1'
                },
                {
                    text: 'Home',
                    value: '2'
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
        this.setValueSaleType = this.setValueSaleType.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateData = this.updateData.bind(this)
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
                console.log(classReturn)
                await this.setState({errorClass: classReturn}, function() {  
                    count += 1
                })
            } 
        }
        this.setState({[name]: value})
    }

    setValueSaleType = (value) => {
        this.setState({sellType: value, activeRent: (this.state.activeSell === 'active' ? 'active' : ''), activeSell: (this.state.activeRent === 'active' ? 'active' : '')})
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
                if(file.size > 1000000) {
                    let image = new Image()
                    image.onload = () => {
                        let tmp = this.imageToDataUrl(image, image.width / 5, image.height / 5)
                          this.setState({img: [...this.state.img, {img_base: btoa(tmp)}] })
                    }
                    image.src = event.target.result
                } else {
                     this.setState({img: [...this.state.img, {img_base: btoa(event.target.result)}] })
                }
            }
            render.readAsDataURL(file)
        }
        event.target.value = null
    }

    updateData = async (event) => {
        const mapImage = this.state.img.map(item => JSON.stringify(item.img_base).replace(/['"]+/g, ''))
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
                console.log(response.data)
                this.setState({showsuccess: true})
            })
        }
    }

    removeImage(imagePos) {
        //console.log(imagePos)
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

    render() {
        const { open, closeOnEscape, closeOnDimmerClick } = this.state
        return(
            <div style={{display:'inline'}}>
                <Button onClick={this.closeConfigShow(false, true)} icon='pencil alternate' color='green'></Button>
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
                        <div class="ui text container grid" >
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
                                             <Dropdown name="type" value={this.state.type} fluid selection options={this.state.type_option} onChange={this.handleInputChange}/>
                                        </div>
                                        <div className={"field " + (this.state.errorClass[1] ? 'error' : '')}>
                                            <label>Size</label>
                                            <input type="number" name="size" value={this.state.size} onChange={this.handleInputChange} />
                                             {this.validator.message('size', this.state.size, 'integer')}
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
                                            <button type="button" className={`fluid ui inverted green button ${this.state.activeRent}`} onClick={() => {this.setValueSaleType(true)}}>Rent</button>
                                        </div>
                                        <div class="field">
                                            <button type="button" className={`fluid ui inverted blue button ${this.state.activeSell}`} onClick={() => {this.setValueSaleType(false)}}>Sell</button>
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
                                                        <div><img id="target" src={atob(item.img_base)}/>
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