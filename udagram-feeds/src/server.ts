import express from 'express';
import { Request } from "express"
import { Response } from "express"
import bodyParser from 'body-parser';
import {sequelize} from './sequelize';
import {FeedItem} from './models/FeedItem';
import {NextFunction} from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from './aws';
import * as c from './config/config';


(async () => {

  await sequelize.addModels([FeedItem]);
  await sequelize.sync();
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8881;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization) {
      return res.status(401).send({message: 'No authorization headers.'});
    }
    
    const tokenBearer = req.headers.authorization.split(' ');
    
    if (tokenBearer.length != 2) {
      return res.status(401).send({message: 'Malformed token.'});
    }
  
    const token = tokenBearer[1];
    return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({auth: false, message: 'Failed to authenticate.'});
      }
      return next();
    });
  }
  
  // Get all feed items
  app.get('/api/v0/feed', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
  
    const promises = [];
    for (const item of items.rows){
      promises.push( AWS.getGetSignedUrl(item.url))
    }

    const results:string[] = await Promise.all(promises);
    let index=0;
    for (const item of items.rows){
      items.rows[index].url =  results[index];
      index=index+1;
    }

    res.send(items);
  });
  
  // Get a feed resource
  app.get('/api/v0/feed/:id',
      async (req: Request, res: Response) => {
        const {id} = req.params;
        const item = await FeedItem.findByPk(id);
        res.send(item);
      });
  
  // Get a signed url to put a new item in the bucket
  app.get('/api/v0/feed/signed-url/:fileName',requireAuth,
      async (req: Request, res: Response) => {
        const {fileName} = req.params;
        const url = await AWS.getPutSignedUrl(fileName);
        res.status(201).send({url: url});
      });
  
  // Create feed with metadata
  app.post('/api/v0/feed/',requireAuth,
      async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url; // same as S3 key name
  
        if (!caption) {
          return res.status(400).send({message: 'Caption is required or malformed.'});
        }
  
        if (!fileName) {
          return res.status(400).send({message: 'File url is required.'});
        }
  
        const item = await new FeedItem({
          caption: caption,
          url: fileName,
        });
  
        const savedItem = await item.save();
  
        savedItem.url = await AWS.getGetSignedUrl(savedItem.url);
        res.status(201).send(savedItem);
      });

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );

    
  // Start the Server
  app.listen( port, () => {
      console.log( `server running ${port}` );
      console.log( `press CTRL+C to stop server` );
  } );

})();