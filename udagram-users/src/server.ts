import express from 'express';
import { Request } from "express"
import { Response } from "express"
import bodyParser from 'body-parser';
import {sequelize} from './sequelize';
import {User} from './models/User';
import {AuthRouter} from './auth.router';

(async () => {

  await sequelize.addModels([User]);
  await sequelize.sync();
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8882;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.use('/api/v0/users/auth', AuthRouter);

  async function getUserById(req: Request, res: Response) {
    const {id} = req.params;
    const item = await User.findByPk(id);
    res.send(item);
  }

  app.get('/api/v0/users/:id', getUserById);

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