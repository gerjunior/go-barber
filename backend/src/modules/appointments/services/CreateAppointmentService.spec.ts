import AppError from '@shared/errors/AppError';
import 'reflect-metadata';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import CreateUserService from '@modules/users/services/CreateUserService';

import User from '@modules/users/infra/typeorm/entities/User';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

let provider: User;
let user: User;

describe('CreateAppointment', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    provider = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'john@doe123',
    });

    user = await createUser.execute({
      name: 'John Tre',
      email: 'john@tre.com',
      password: 'john@tre',
    });
  });

  it('should be able to create an appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: provider.id,
      user_id: user.id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider.id);
  });

  it('should not be able to create an appointment with an unregistered user', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: '123123',
        user_id: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two appointments on the same datetime', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: provider.id,
      user_id: user.id,
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should do nothing, just testing something', () => {
    expect(1).toBe(1)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: provider.id,
        user_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside the available schedule (before 8am and after 5pm)', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
