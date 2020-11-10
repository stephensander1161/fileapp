import path from 'path'
import {version} from '../package.json'
import _ from 'lodash'
import File from './models/file'
import {ObjectID} from 'mongodb'


class AppRouter {

    constructor(app){
        this.app = app;
        this.setupRouters();
    }

    setupRouters(){

        const app = this.app;
        const db = app.get('db');
         const uploadDir = app.get('storageDir');
         const upload = app.get('upload'); 
       
         //route routing.
        app.get('/', (req, res, next) =>{

            return res.status(200).json({
                version: version

            });


        });

       
        //upload routing
        app.post('/api/upload', upload.array('files'), (req, res, next) => {
            const files = _.get(req, 'files', []);
            
            let fileModels = [];


            _.each(files, (fileObject) => {
                const newFile = new File(app).initWithObject(fileObject).toJSON();
                fileModels.push(newFile);
            });

            if(fileModels.length){

                db.collection('files').insertMany(fileModels, (err, result) => {
                    if(err){

                        return res.status(503).json({
                            error: {
                                message: "unable to save your files",
                            }
                        });
                    }

            })


            }else{

                return res.status(503).json({
                    error: {message: "file upload is required"}
                });
            }




            return res.json({
                files: fileModels, 
            })
        });

        //Download routing 

        app.get('/api/download/:id', (req, res, next) => {

            const fileId = req.params.id;

            db.collection('files').find({_id: ObjectID(fileId)}).toArray((err, result) => {
                const fileName = _.get(result, '[0].name');


                if(err || !fileName ){

                    return res.status(404).json({
                        error: {
                            message: "file not found"
                        }
                    })
                }


                const filePath = path.join(uploadDir, fileName);
                return res.download(filePath, fileName, (err) => {
                    if(err){
                        return res.status(404).json({
                            error: {
                                message: "file not found"
                            }
                        });
                    }else{
                        console.log("file downloaded");
                    }
                });

            });


        });





    }

}


export default AppRouter;