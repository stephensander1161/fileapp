import React,{Component} from 'react'
import _ from 'lodash'


export default class HomeForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            form: {
                to: '',
                from: '',
                message: ''

            },

            errors: {
                to: null,
                from: null, 
                message: null,
            }
        };

        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this)
        this._formValidation = this._formValidation.bind(this);
    }

    _isEmail(emailAddress) {

        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return emailRegex.test(emailAddress);

    }

    _formValidation(fields = [], callback){

        let {form, errors} = this.state;


        const validations = {
            from: [
                {
                    errorMessage: 'From is required.',
                    isValid: () => {
                        return form.from.length;
                    }
                    },
                    {
                        errorMessage: 'Email is not valid',
                        isValid: () => {
                            return this._isEmail(form.from);
                        }
                }
            ],
            to: [
                {
                    errorMessage: 'To is required.',
                    isValid: () => {
                        return form.to.length;
                    }
                    },
                    {
                        errorMessage: 'Email is not valid',
                        isValid: () => {
                            return this._isEmail(form.to);
                        }
                }
            ],

        }

        _.each(fields, (field) => {

            let fieldValidations = _.get(validations, field, []); //validations[field];

            errors[field] = null;

            _.each(fieldValidations, (fieldValidation) => {

                const isValid = fieldValidation.isValid();
                if(!isValid){
                    errors[field] = fieldValidation.errorMessage;
                }
            });


        });


        this.setState({
            errors: errors
        }, () => {
            let isValid = true;
            _.each(errors, (err) => {

               if(err !==null){
                   isValid = false;
               } 

            });

            return callback(isValid);

        });


    }

    _onSubmit(event){
        event.preventDefault();
        this._formValidation(['from', 'to'], (isValid) => {
            console.log("the form is valid " + isValid);
        });
    }

    _onTextChange(event) {
        let {form} = this.state;
        console.log("Event", event.target.name, event.target.value);

        const fieldName = event.target.name; 
        const fieldValue = event.target.value; 

        form[fieldName] = fieldValue;

        this.setState({form: form});
    }

    render(){

        const {form}= this.state;
        return (
            <div className={'app-card'}>
                <form onSubmit={this._onSubmit}>
            <div className={'app-card-header'}>
                <div className={'app-card-header-inner'}>
                    <div className={'app-file-select-zone'}>
                    <label htmlFor={'input-file'}>
                        <input id={'input-file'} type="file" multiple={true} />
                        <span className={'app-upload-icon'}></span>
                        <span className={'app-upload-description'}>Drag and drop your files here.</span>
                    </label>
                    </div>
                   
                    
                </div>
                </div>
            <div className={'app-card-content'}>
            <div className={'app-card-content-inner'}>
                <div className={'app-form-item'}>
                    <label htmlFor={'to'}>Send to</label>
                    <input onChange={this._onTextChange} value={form.to} name={'to'} placeholder={'Email address'} type={'text'} id={'to'}/>
                </div>

                <div className={'app-form-item'}>
                    <label htmlFor={'from'}>From</label>
                    <input  onChange={this._onTextChange} name={'from'} placeholder={'Your email address'} type={'text'} id={'from'}/>
                </div>

                <div className={'app-form-item'}>
                    <label htmlFor={'to'}>Message</label>
                    <textarea  onChange={this._onTextChange} placeholder={'Add a note (optional)'} id={'message'} name={'message'} />                   
                </div>

                <div className={'app-form-actions'}>
                    <button type={'submit'} className={'app-button primary'}> Send</button>
                </div>


            </div>
            </div>

            </form>
            </div>
        )
    }
}