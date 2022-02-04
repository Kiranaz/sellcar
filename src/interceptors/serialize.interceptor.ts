import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { plainToClass } from "class-transformer";
import { map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //Run something before a request is handled by request handler
        console.log('Running before the handler', context);

        return next.handle().pipe(
            map((data: any) => {
                //Run something before a request is sent out
                console.log('Running before request is sent out',data);
            })
        )        
    }
}