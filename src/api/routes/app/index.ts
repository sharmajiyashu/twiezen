import { Router } from 'express';
import auth from './auth';

import { appAuthMiddleware } from '../../middleware/appAuthMiddleware';


export default (router: Router): Router => {


  
    // auth(router);
   
    return router;
};
