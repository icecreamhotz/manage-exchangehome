import React , {Compoent}from "react";
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import condo from '../../images/condo.png';
import axios from 'axios'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import { Redirect } from "react-router-dom";
import 'sweetalert/dist/sweetalert.css';

class Insertarticles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        editorState: EditorState.createEmpty(),
        img: [],
        title: '',
        showinsert: false,
        showerror: false,
        redirect: false,
        showloader: false,
    };

    this.uploadImageCallBack = this.uploadImageCallBack.bind(this)
  //  this.imageToDataUrl = this.imageToDataUrl.bind(this)
    this.onImageAdd = this.onImageAdd.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.handleTab = this.handleTab.bind(this);
    this.insertData = this.insertData.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onClickSuccess = this.onClickSuccess.bind(this)
  }

     componentDidMount() {
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

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

                    var MAX_WIDTH = 400;
                    var MAX_HEIGHT = 200;
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

  onImageAdd = (event) => {
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

  /*imageToDataUrl(img, width, height) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL()
  }*/

  onClickSuccess = () => {
      this.setState({ showsuccess: false}, () => this.setState({redirect: true}));
  }

  insertData =  async () => {
    const mapImage = this.state.img.map(item => JSON.stringify(item.img_base).replace(/['"]+/g, '')) // replace for remove the double quotes
    const getMap = mapImage.reduce((r, e) => r.push(e) && r, [])
    
    this.setState({showinsert: false, showloader: true})

    let req = new FormData()
    req.append('title', this.state.title)

    let contentHtml = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

    req.append('content', contentHtml)
    req.append('img', JSON.stringify(getMap))

    await axios.post('http://www.witrealty.co/api/forums', req).then((response) => {
      this.setState({showsuccess: true, showloader: false})
    })

  }

  render() {
       const { editorState } = this.state;
       if (this.state.redirect) {
            this.setState({redirect: false})
            return <Redirect push to={`/articles`}/>
      }
    return (
        <div class="ui fluid container pt-80 pb-50" style={{position: 'relative'}}>
          <div className={`loader-submit ${this.state.showloader ? '' : 'hide-loader'}`}>
            <div class="loader"></div>
          </div>
          <div class="ui text container form">
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
                  <label>Images</label>
                   <div class="ui two column stackable grid">
                    { this.state.img.map((item, index) => {
                      return  <div class="column">
                            <div class="image-area">
                                <div><img id="target" src={atob(item.img_base) }/>
                                 <button class="remove-image" style={{display:"inline"}} onClick={() => {this.removeImage(item)}}>&#215;</button></div>
                            </div>
                                </div>
                      })
                    }
                  </div> 
              </div>
              <div class="field mt-30">
                  <div class="ui fluid action input">
                      <label for="file" class="ui icon button">
                      <i class="file icon"></i>
                          Open File</label>
                      <input type="file" id="file" onChange={this.onImageAdd} style={{display:'none'}} />
                  </div>
              </div>
              <div class="field">
                 <button class="ui fluid inverted green button" type="button" onClick={() => {this.setState({showinsert: true})}}>Submit</button>
              </div>
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
                title="Insert Complete!"
                type="success"
                onConfirm={this.onClickSuccess}
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
        </div>
    );
  }
}


export default Insertarticles