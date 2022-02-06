import { createParamDecorator, ExecutionContext } from "@nestjs/common";


//in order to execute this decorator we first need to execute interceptor
export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.CurrentUser;
    }
)