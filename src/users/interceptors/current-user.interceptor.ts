import {
    Injectable,
    NestInterceptor,
    CallHandler,
    ExecutionContext
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private usersService: UsersService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId) {
            const user = await this.usersService.findOne(userId); //go ahead and run the actual root handler
            request.CurrentUser = user;
        }
    
        return next.handle();
    }
    
}