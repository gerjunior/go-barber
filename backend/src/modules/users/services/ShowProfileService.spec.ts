import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const profile = await showProfile.execute(user.id);

    expect(profile.id).toBe(user.id);
    expect(profile.name).toBe(user.name);
    expect(profile.password).toBe(user.password);
    expect(profile.email).toBe(user.email);
  });

  it('should not be able to show the profile of a unexisting user', async () => {
    await expect(showProfile.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
