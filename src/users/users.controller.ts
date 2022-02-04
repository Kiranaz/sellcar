import { Controller, Post, Body, Get, Patch, Delete, Param, Query, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto){
        console.log(body)
        this.authService.signup(body.email, body.password);
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
