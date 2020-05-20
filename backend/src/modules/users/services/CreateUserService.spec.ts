import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'example@example.com',
      password: 'john_doe@password',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be not be able to create a new user with an existing email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'example@example.com',
      password: 'john_doe@password',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'example@example.com',
        password: 'john_doe@password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
