import React , { Component } from 'react';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';
import EditArticle from '../manage-articles/Edit-articles.js';
import Progress from '../settings/Progress.js';
import noimg from '../../images/noimg.png';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Redirect } from "react-router-dom";
import Loader from '../settings/Loader.js';

import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';

class InformationCondo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            item: [],
            loading: true,
            editorState: null,
            redirect: false,
            showdelete: false,
            showsuccess: false,
            showloader: false,
        }
        this.fetchArticleData = this.fetchArticleData.bind(this)
        this.deleteData = this.deleteData.bind(this)
    }

    async componentDidMount() {
        await this.fetchArticleData()
        window.addEventListener('popstate', this.hiddenAlert)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.hiddenAlert)
    }

    fetchArticleData = () => {
        this.setState({loading: true})
        axios.get(`http://www.witrealty.co/api/forums/${this.props.match.params.id}`).then((response) => {
            let data = response.data[0]
            this.setState({item: data, loading: false})

            const blocksFromHtml = htmlToDraft(this.state.item.forum_content)
            const { contentBlocks, entityMap } = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
            
            this.setState({editorState: EditorState.createWithContent(contentState)})

            this.forceUpdate()
        })
    }

    deleteData  =  () => {
        this.setState({showdelete: false}, () => this.setState({showloader: true}))

        let idarray = []
        idarray.push(this.props.match.params.id)

        let req = new FormData()
        req.append('id', JSON.stringify(idarray))

        axios.post(`http://www.witrealty.co/api/forums/delete`, req).then((response) => {
            this.setState({showsuccess: true,showloader: false})
        })
    } 

    render() {
        const { loading, editorState, redirect } = this.state
        if(loading) { return <Progress /> }
        if(redirect) { return <Redirect push to='/articles'/> }
        return(
            <div class="ui fluid pt-100 pb-50">
                <div class="ui container">
                    <div class="ui very padded piled green segment">
                        <div class="ui one column grid">
                                <div class="left floated six wide column">
                                    <h2 class="ui header">
                                        Title
                                        <div class="sub header">{this.state.item.forum_title}</div>
                                    </h2>
                                </div>
                                <div class="right floated six wide column middle right aligned"> 
                                    <EditArticle data={this.state.item} clickToUpdate={this.fetchArticleData} title={'Edit'} />
                                    <button className={"ui icon red button"} type="button" onClick={() => {this.setState({showdelete: true})}}><i class="delete icon"></i> Delete</button>
                                </div>
                            <div class="six wide column">
                                <h2 class="ui header">
                                    Images
                                </h2>
                                    <OwlCarousel
                                        className="owl-theme owl-carousel owl-demo"
                                        items={1}
                                        loop
                                        >
                                    
                                        {(!this.state.item[0].imgs.length > 0) ?
                                            <div class="item"><img src={noimg} alt={noimg} /></div>
                                        :
                                            this.state.item[0].imgs.map(item => {
                                                return <div class="item"><img src={atob(item.img_base)} alt={this.state.item.forum_title} style={{height:'500px',width:'auto'}}/></div>
                                            })
                                        }
                                    </OwlCarousel>
                            </div>
                            <div class="column">
                                <h2 class="ui header">
                                    Content (Read only)
                                </h2>
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
                                        readOnly={true}
                                    />
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