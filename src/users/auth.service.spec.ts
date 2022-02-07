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
        expect.assertions(2); //The expect.assertions(2) call ensures that both callbacks actually get called.
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

      it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([ {id: 1, email:'asdf@asdf.com', password: '1'} as User]);
        expect.assertions(2);
        try {
          await service.signup('kiran@gmail.com', 'pwdsdsadsadas123');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('Email already exists.');
        }
      });
    
      it('returns a user if correct password is provided', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([
            {
              email: 'asdf@asdf.com',
              password:
                'bdaef91e25cc3a12.c8ee6407d0a981616c3b93adabbcaa824befe397da0fda03ad763680e1725994',
            } as User,
          ]);
    
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();

        // const user = await service.signup('asdf@asdf.com', 'mypassword');
        // console.log(user)
      });
    
})