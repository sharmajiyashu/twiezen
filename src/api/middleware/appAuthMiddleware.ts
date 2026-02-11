import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from './errors';
import _ from 'lodash';
import { AuthenticationService } from '../../services/common/AuthenticationService';
import Container from 'typedi';
import { appWhitelistRoutes } from '../../constants/appWhitelistRoutes';

export const appAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (appWhitelistRoutes.includes(req.path)) {
            return next();
        }

        const authHeader = req.headers.authorization;

        if (_.isEmpty(authHeader)) {
            return next(new UnauthorizedError(new Error('Authorization header missing')));
        }

        const [authType, accessToken] = authHeader!.split(' ');

        if (_.isEmpty(authType) || authType.toLowerCase() !== 'bearer') {
            return next(new UnauthorizedError(new Error('Invalid authorization type')));
        }

        if (_.isEmpty(accessToken)) {
            return next(new UnauthorizedError(new Error('Access token missing')));
        }

        const authService = Container.get(AuthenticationService);
        const user = await authService.verifyToken(accessToken);

        if (!user) {
            return next(new UnauthorizedError(new Error('Invalid token')));
        }

        // if (user.isActive !== true) {
        //     return next(new UnauthorizedError(new Error('User is inactive')));
        // }

        req.user = {
            id: user.id,
            userRole: user.userRole,
            adminRoleId: user.adminRoleId
        };
        next();
    } catch (error) {
        next(new UnauthorizedError(error));
    }
};
