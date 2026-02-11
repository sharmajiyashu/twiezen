import { Router, Request, Response } from 'express';
import Container from "typedi";
import { AuthenticationService } from "../../../services/common/AuthenticationService";


export default (router: Router) => {

    const authService = Container.get(AuthenticationService);

    


}