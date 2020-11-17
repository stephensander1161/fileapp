import React,{Component} from 'react'
import _ from 'lodash'


class View extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {match} = this.props;
        console.log(match);
        console.log("Id of post is", _.get(match, 'params.id'));


    }

    render(){
        return (
            <div> Here is the download view.  
            </div>
        )
    }

}

export default View;