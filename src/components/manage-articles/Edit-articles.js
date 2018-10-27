import React , { Component } from 'react';
import axios from 'axios';
import { Button, Header, Modal, TransitionablePortal, Icon } from 'semantic-ui-react'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import Loader from '../settings/Loader.js';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class EditCondo extends React.Component {

    constructor(props) {
        super(props)

        const blocksFromHtml = htmlToDraft(this.props.data.forum_content)
        const { contentBlocks, entityMap } = blocksFromHtml
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)

        this.state = {
            editorState: EditorState.createWithContent(contentState),
            img: this.props.data[0].imgs,
            open: false,
            title: props.data.forum_title,
            content: props.data.forum_content,
            title_edit: props.title,
            updateDataOnParent: props.clickToUpdate,
            showerror: false,
            showedit: false,
            showsuccess: false,
            showloader: false,
        }   

        this.uploadImageCallBack = this.uploadImageCallBack.bind(this)
       // this.imageToDataUrl = this.imageToDataUrl.bind(this)
        this.onImageChange = this.onImageChange.bind(this)
        this.removeImage = this.removeImage.bind(this)
        this.handleTab = this.handleTab.bind(this);
        this.updateData = this.updateData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    
    onEditorStateChange: Function = (editorState) => {
        this.setState({
        editorState,
        });
    };

    componentDidMount() {
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

    closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
        this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
    }

    close = () => this.setState({ open: false })

    handleInputChange = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name

        this.setState({[name]: value})
    }

    removeImage(imagePos) {
        let filterImageArray = this.state.img.filter(item => item !== imagePos)
        this.setState({img: filterImageArray})
    }

    handleTab(event) {
        event.preventDefault()
        const tabCharacter = "    ";
        let currentState = this.state.editorState;
        let newContentState = Modifier.replaceText(
        currentState.getCurrentContent(),
        currentState.getSelection(),
        tabCharacter
        );

        this.setState({ 
        editorState: EditorState.push(currentState, newContentState, 'insert-characters')
        });
    }

     uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader(); // eslint-disable-line no-undef
        reader.onload = (e) => {
      
            let image = new Image()
            image.src = e.target.result
                image.onload = () => {          
                    let canvas = document.createElement("canvas")
                    var ctx = canvas.getContext("2d")

                    var MAX_WIDTH = 500;
                    var MAX_HEIGHT = 300;
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
              resolve({ data: { link: imgnaja } });
            }
        }
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
      });
  }

 /*   imageToDataUrl(img, width, height) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        return canvas.toDataURL()
    }*/

      onImageChange = (event) => {
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
            }
            render.readAsDataURL(file)
        }
        event.target.value = null
    }


    updateData = async (event) => {
        const mapImage = this.state.img.map(item => JSON.stringify(item.img_base).replace(/['"]+/g, '')) // replace for remove the double quotes
        const getMap = mapImage.reduce((r, e) => r.push(e) && r, [])

        this.setState({showedit: false, showloader: true})

        let req = new FormData()
        req.append('title', this.state.title)

        let contentHtml = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

        req.append('content', contentHtml)
        req.append('img', JSON.stringify(getMap))

        await axios.post(`http://www.witrealty.co/api/forums/update/${this.props.data.id}`, req).then((response) => {
            this.setState({showsuccess: true, showloader: false})
        })
    }

    render() {
        const { open, closeOnEscape, closeOnDimmerClick, editorState } = this.state
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
                            <div class="ui form">
                                <div class="field">
                                    <label>Title</label>
                                    <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />
                                </div>
                                <div class="field">
                                    <label>Content</label>
                                    <Editor
                                        editorState={editorState}
                                        editorClassName="articles-editor"
                                        onEditorStateChange={this.onEditorStateChange}
                                        onTab={this.handleTab}
                                        toolbar={{
                                        image: {
                                            uploadCallback: this.uploadImageCallBack,
                                            alt: { present: true, mandatory: false },
                                            previewImage: true
                                        },
                                        }}
                                    />
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
                                </div>
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
                        this.setState({ showsuccess: false }, () => this.state.updateDataOnParent());
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