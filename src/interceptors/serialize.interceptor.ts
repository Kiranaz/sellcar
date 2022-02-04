import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { plainToClass } from "class-transformer";
import { map } from "rxjs";
import { argv } from "process";

interface classConstructor {
    new (...args: any[] ): {} //This type specifies a function that accepts any number of arguments that are any type, returns any value, and can be invoked with new.
}

export function Serialize(dto: classConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: classConstructor) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //Run something before a request is handled by request handler
        //console.log('Running before the handler', context);

        return next.handle().pipe(
            map((data: any) => {

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
                //Run something before a request is sent out
                //console.log('Running before request is sent out',data);
            })
        )        
    }
}