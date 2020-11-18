import React,{Component} from 'react'
import _ from 'lodash'
import {getDownloadInfo} from "../helpers/download";
import {  FaDownload, FaPaperPlane } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { apiUrl} from '../config'
import {betterNumber} from "../helpers"
import {history} from "../history"



class View extends Component{
    constructor(props) {
        super(props);

        this.state = {
            post: null,
        }

        this.getTotalDownloadSize = this.getTotalDownloadSize.bind(this);
    }

    componentWillMount(){
        const {match} = this.props;

        const postId = _.get(match, 'params.id');

        getDownloadInfo(postId).then((response) => {

            this.setState({
                post: _.get(response, 'data' )
            });

            console.log("got post information ", response.data); 



        }).catch((err) => {
            console.log("an error fetching download data", err); //we redirect user not to found page later
        })
       

    }

    getTotalDownloadSize(){
        const {post} = this.state;

        let total = 0;
        const files =_.get(post, 'files', []);

        _.each(files, (file) => {
            total = total + _.get(file, 'size', 0);

        });

        return betterNumber(total);


    }

    render(){

        const {post} = this.state;
        const postId = _.get(post, '_id', null);

        const files =_.get(post, 'files', []);
        const totalSize = this.getTotalDownloadSize();
        return (
            <div className={'app-page-download'}>
                <div className={'app-top-header'}>
                <IconContext.Provider value={{ color: "white", size: "5em" }}>

    <FaPaperPlane/>
    </IconContext.Provider>
    <div >


    <h1 onClick={() => {

        history.push('/')

    }}>SHARE</h1>

    
</div>

                </div>
            <div className={'app-card app-card-download'}>
        
            <div className={'app-card-content'}>
            <div className={'app-card-content-inner'}>

            <IconContext.Provider value={{ color: "rgba(27,101,246,1)", size: "4em" }}>

                <div className={'app-download-icon'}>
                    <FaDownload />

                </div>
                </IconContext.Provider>

                <div className={'app-download-message app-text-center'}>

                    <h2>Ready to download</h2>
                    <ul>
                        <li>{files.length} Files </li>
                        <li>{totalSize} </li>
                        <li>Expires in 30 days </li>


                    </ul>
                </div>

                <div className={'app-download-file-list'}>
                    {
                        files.map((file, index) => {

                            return (
                                <div key={index} className={'app-download-file-list'}>
                                <div className={'app-download-file-list-item'}>
                                    <div className={'filename'}>
                                        {_.get(file,'originalName')}
                                    </div>
                                    <div className={'download-action'}><a href={`${apiUrl}/download/${_.get(file,'_id')}`}>Download</a>
                                       
                                    </div>
            
            
                                </div>
            
                            </div>


                            )
                        })
                    }


                </div>

               

               


                    <div className={'app-download-actions app-form-actions'}>

                        <a href={`${apiUrl}/posts/${postId}/download`} className={'app-button primary'} type={'button'}>Download All</a>
                        <button className={'app-button '} type={'button'}>Share</button>

                    </div>

                </div>
            </div>
            </div>
            </div>
        )
    }

}

export default View;