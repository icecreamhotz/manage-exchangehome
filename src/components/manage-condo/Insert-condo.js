import React, { Component } from 'react'
import axios from 'axios';

class Insertcondo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            img: [],
            saleType: null
        }
        this.setValueSaleType = this.setValueSaleType.bind(this)
        this.insertData = this.insertData.bind(this)
        this.onImageAdd = this.onImageAdd.bind(this)
        this.removeImage = this.removeImage.bind(this)
    }

    setValueSaleType = (value) => {
        this.setState({saleType: value}, () => {
            console.log(this.state.saleType)
        })
    }

    insertData(event) {
        event.preventDefault()
        let form = event.target
        let data = new FormData(form)
        let req = new FormData()
        for(let name of data.keys()) {
            const input = data.get(name)
            req.append(name, input)
        }
        req.append('sale_type', this.state.saleType)
        let json_img = JSON.stringify(this.state.img)
        req.append('img', json_img)
       
        axios.post('http://www.witrealty.co/api/estates', req).then((response) => {
            console.log(response.data)
        })
       // req.append('img', this.state.img)
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
                        console.log(tmp)
                          this.setState({img: [...this.state.img, btoa(tmp)] })
                    }
                    image.src = event.target.result
                } else {
                    console.log(event.target.result)
                     this.setState({img: [...this.state.img, event.target.result] })
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
        console.log(imagePos)
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

    render() {
        return(
            <div class="ui text container grid pt-50 pb-50">
                <form class="ui form" onSubmit={this.insertData}>
                    <div class="field">
                        <label>Title</label>
                        <input type="text" name="title" placeholder="First Name" />
                    </div>
                    <div class="field">
                        <label>State</label>
                            <select name="type_id" class="ui fluid dropdown">
                            <option value="1">Condo</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Size</label>
                        <input type="number" name="size" placeholder="First Name" />
                    </div>
                    <div class="field">
                        <label>Bedroom</label>
                            <select name="bedroom" class="ui fluid dropdown">
                            <option value="2">Two</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Bathroom</label>
                            <select name="bathroom" class="ui fluid dropdown">
                            <option value="1">One</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Selltype</label>
                        <div class="ui buttons">
                            <button class="ui button" onClick={() => {this.setValueSaleType(true)}}>Sell</button>
                            <div class="or"></div>
                            <button class="ui positive button" onClick={() => {this.setValueSaleType(false)}}>Rent</button>
                        </div>
                    </div>
                    <div class="field">
                        <label>Price</label>
                        <input type="number" name="price" placeholder="First Name" />
                    </div>
                    <div class="field">
                        <label>Address</label>
                        <input type="text" name="address" placeholder="First Name" />
                    </div>
                    <div class="field">
                        <label>Description</label>
                        <textarea name="description"></textarea>
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
                    <input type="file" id="img" onChange={this.onImageAdd}/>
                    <button class="ui button" type="submit">Submit</button>
                </form>
                   
            </div>
        )
    }
}

export default Insertcondo;