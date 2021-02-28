import express from 'express';
import bodyParser from 'body-parser';
import  proxy from 'express-http-proxy';
import cors from 'cors';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  const feedMicroservice = process.env.FEED || 'http://localhost:8881';
  const usersMicroservice = process.env.USERS || 'http://localhost:8882';
   
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http://ab560bab59d6149a0adfddd7c1a74339-320872038.eu-west-3.elb.amazonaws.com:80',
  }));


  app.use('/api/v0/feed/*', proxy(feedMicroservice , {
    proxyReqPathResolver: req => new URL(req.baseUrl,feedMicroservice).pathname
  }));
  app.use('/api/v0/feed', proxy(feedMicroservice , {
    proxyReqPathResolver: req => new URL(req.baseUrl,feedMicroservice).pathname
  }));
  app.use('/api/v0/users/*', proxy(usersMicroservice, {
    proxyReqPathResolver: req => new URL(req.baseUrl,usersMicroservice).pathname
  }));
  app.use('/api/v0/users', proxy(usersMicroservice, {
    proxyReqPathResolver: req => new URL(req.baseUrl,usersMicroservice).pathname
  }));

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
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