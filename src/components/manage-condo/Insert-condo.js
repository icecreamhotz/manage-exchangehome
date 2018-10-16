import React, { Component } from 'react'
import axios from 'axios';
import { dropdown } from '../settings/Dropdown.js';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import SimpleReactValidator from 'simple-react-validator'
import { validateCondoForm } from '../validate/condoForm.js'

class Insertcondo extends React.Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        this.state = {
            img: [],
            saleType: true,
            activeRent: 'active',
            activeSell: false,
            title: '',
            type: '',
            size: '',
            bedroom: '',
            bathroom: '',
            sellType: '',
            price: '',
            address: '',
            description: '',
            showinsert: false,
            showsuccess: false,
            errorClass: [false, false, false, false, false],
            showerror: false
        }
        this.setValueSaleType = this.setValueSaleType.bind(this)
        this.insertData = this.insertData.bind(this)
        this.onImageAdd = this.onImageAdd.bind(this)
        this.removeImage = this.removeImage.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }
        
    componentDidMount() {
        window.addEventListener('popstate', this.hiddenAlert);
        dropdown()
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert);
    }

    setValueSaleType = (value) => {
        this.setState({sellType: value, activeRent: (this.state.activeSell === 'active' ? 'active' : ''), activeSell: (this.state.activeRent === 'active' ? 'active' : '')})
    }

    async handleInputChange(event) {
        const target = event.target
        const value = target.value
        const inputname = target.name

        let count = 0

        let form = this.refs.formCondo
        let data = new FormData(form)
        for(let name of data.keys()) {
            if(name !== 'type' && name !== 'bedroom' && name !== 'bathroom') { 
                const classReturn = await validateCondoForm(count, this.state.errorClass, name, inputname, value)
                console.log(classReturn)
                await this.setState({errorClass: classReturn}, function() {  
                    count += 1
                })
            } 
        }

        this.setState({[inputname]: value});
    }

    insertData = async () => {

        this.setState({showinsert: false})

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
            req.append('img', JSON.stringify(this.state.img))
        
            await axios.post('http://www.witrealty.co/api/estates', req).then((response) => {
                console.log(response.data)
                this.setState({showsuccess: true})
            })
        }
    }

    onImageAdd(event) {
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
                          this.setState({img: [...this.state.img, btoa(tmp)] })
                    }
                    image.src = event.target.result
                } else {
                     this.setState({img: [...this.state.img, btoa(event.target.result)] })
                }
            }
            render.readAsDataURL(file)
        }
        event.target.value = null
    }

    imageToDataUrl(img, width, height) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        return canvas.toDataURL()
    }

    removeImage(imagePos) {
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

    render() {
        return(
            <div class="ui text container grid pt-50 pb-50">
                <form class="ui form" ref="formCondo">
                    <div className={"field " + (this.state.errorClass[0] ? 'error' : '')}>
                        <label>Title</label>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />
                        {this.validator.message('title', this.state.title, 'required')}
                    </div>
                    <div class="field">
                        <label>State</label>
                            <select name="type" class="ui fluid dropdown" value={this.state.type} onChange={this.handleInputChange}>
                            <option value="1">Condo</option>
                            <option value="2">Condo</option>
                        </select>
                    </div>
                    <div className={"field " + (this.state.errorClass[1] ? 'error' : '')}>
                        <label>Size</label>
                        <input type="number" name="size" value={this.state.size} onChange={this.handleInputChange}/>
                        {this.validator.message('size', this.state.size, 'integer')}
                    </div>
                    <div class="field">
                        <label>Bedroom</label>
                        <select name="bedroom" class="ui fluid dropdown" value={this.state.bedroom} onChange={this.handleInputChange}>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            <option value="4">Four</option>
                            <option value="5">Five</option>
                            <option value="6">Six</option>
                            <option value="7">Seven</option>
                            <option value="8">Eight</option>
                            <option value="9">Nine</option>
                            <option value="10">Ten</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Bathroom</label>
                            <select name="bathroom" class="ui fluid dropdown" value={this.state.bathroom} onChange={this.handleInputChange}>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            <option value="4">Four</option>
                            <option value="5">Five</option>
                            <option value="6">Six</option>
                            <option value="7">Seven</option>
                            <option value="8">Eight</option>
                            <option value="9">Nine</option>
                            <option value="10">Ten</option>
                        </select>
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
                        <input type="text" name="address" value={this.state.address} onChange={this.handleInputChange}/>
                        {this.validator.message('address', this.state.address, 'required')}
                    </div>
                    <div className={"field " + (this.state.errorClass[4] ? 'error' : '')}>
                        <label>Description</label>
                        <textarea name="description" value={this.state.description} onChange={this.handleInputChange}></textarea>
                        {this.validator.message('description', this.state.description, 'required')}
                    </div>
                     <div class="ui two column stackable grid">
                            { this.state.img.map((item, index) => {
                                return  <div class="column">
                                            <div class="image-area">
                                                <div><img id="target" src={atob(item) }/>
                                                <button class="remove-image" style={{display:"inline"}} onClick={() => {this.removeImage(item)}}>&#215;</button></div>
                                            </div>
                                        </div>
                                })
                            }
                    </div>
                    <div class="field mt-30">
                        <div class="ui fluid action input">
                            <label for="file" class="ui icon button">
                                <i class="file icon"></i>
                                    Open File</label>
                               <input type="file" id="file" onChange={this.onImageAdd} style={{display:'none'}} />
                        </div>
                    </div>
                    <button class="ui fluid inverted green button" type="button" onClick={() => {this.setState({ showinsert: true})}}>Submit</button>
                </form>
                <SweetAlert
                    show={this.state.showinsert}
                    title="Are you sure?"
                    type="warning"
                    text="You need to update really!!"
                    showCancelButton
                    onConfirm={() => {this.insertData()}}
                    onCancel={() => {
                        this.setState({ showinsert: false, open:true});
                    }}
                    onEscapeKey={() => this.setState({ showinsert: false})}
                    onOutsideClick={() => this.setState({ showinsert: false })}
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

export default Insertcondo;