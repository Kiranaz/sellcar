import { Controller, Post, Body, Get, Patch, Delete, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        console.log(body)
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        console.log(body)
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@Session() session: any){
        return this.usersService.findOne(session.userId)
    }

    @Get('/whome')
    whoMe(@CurrentUser() user: string) {
        return user
    }
    
    //@UseInterceptors(ClassSerializerInterceptor) //Bad approach
    @Get('/:id')
    async findUser(@Param('id') id: string) { //we always get id as string from param so we need to parse into int when dealing with it
        console.log('handler is running');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user){
            throw new NotFoundException('User not found.')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) { //we always get id as string from param so we need to parse into int when dealing with it
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body)
    }
}
