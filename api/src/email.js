import _ from 'lodash'
import {url} from "./config"

export class Email {
    constructor(app){
        this.app = app;
    }

     sendDownloadLink(post, callback = () => {}){

        const app = this.app
        const email = app.email;

        const from = _.get(post, 'from'); //post.from;
        const to = _.get(post, 'to');
        const message = _.get(post, 'message', '');
        const postId = _.get(post, '_id');
        const downloadLink = `${url}/share/${postId}`

        let messageOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: '[Share] Download Invitation', // Subject line
            text: message, // plain text body
            html: `<p>${from} has sent you a file. Click <a href="${downloadLink}">here</a> to download.</p>`, // html body
        };

        email.sendMail(messageOptions, (error, info) => {

            return callback(error, info);

            
        })




    }
}