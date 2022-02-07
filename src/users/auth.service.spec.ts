import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

describe('AuthService', () => {
    
    beforeEach(async () => {
        fakeUsersService  = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => 
                Promise.resolve({id: 1, email, password} as User)
        }
    
        const module = await Test.createTestingModule({
            providers: [AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService,
            }],
        }).compile();
    
        service = module.get(AuthService);        
    })


    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('create a new user with a salted and hashed password', async () => {
        const user =  await service.signup('kiran@gmail.com', 'pwd123');

        expect(user.password).not.toEqual('pwd123');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

      it('throws an error when signin error when user exists', async () => {
        fakeUsersService.find = () => Promise.resolve([ {id: 1, email:'asdf@asdf.com', password: '1'} as User]);
        expect.assertions(2);
        try {
          await service.signup('kiran@gmail.com', 'pwd123');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('Email already exists.');
        }
      });

      it('throws if signin is called with an unused email', async () => {
        try {
          await service.signin('kiran65656555@gmail.com', 'pwd123');
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
            expect(err.message).toBe('User not found.');
        }
      });
})