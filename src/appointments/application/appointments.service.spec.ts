import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { CreateAppointmentCommand } from '../domain/commands/create-appointment.command';

const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 1);

const pastDate = new Date();
pastDate.setMonth(pastDate.getMonth() - 1);

const fakeAppointment = {
  date: futureDate.toISOString(),
  start_time: '08:00',
  end_time: '18:00',
  space_id: randomUUID(),
  user_id: randomUUID(),
};

describe(AppointmentsService.name, () => {
  let appointmentsService: AppointmentsService;

  const commandBusStub = {
    execute: jest.fn().mockResolvedValue({
      ...fakeAppointment,
      id: randomUUID(),
      created_at: new Date(),
      updated_at: null,
    }),
  };

  const queryBusStub = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AppointmentsService,
        { provide: CommandBus, useValue: commandBusStub },
        { provide: QueryBus, useValue: queryBusStub },
      ],
    }).compile();

    appointmentsService = app.get<AppointmentsService>(AppointmentsService);
  });

  describe('createAppointment()', () => {
    it('should correctly execute the CreateAppointmentCommand', async () => {
      const { user_id, space_id, date, end_time, start_time } = fakeAppointment;
      const [startHour, startMinute] = start_time.split(':');
      const [endHour, endMinute] = end_time.split(':');
      const appointmentStartTime = new Date(date);
      appointmentStartTime.setUTCHours(Number(startHour), Number(startMinute));
      const appointmentEndTime = new Date(date);
      appointmentEndTime.setUTCHours(Number(endHour), Number(endMinute));

      await appointmentsService.createAppointment(fakeAppointment);

      const expectedCommand = new CreateAppointmentCommand(
        user_id,
        space_id,
        appointmentStartTime,
        appointmentEndTime,
      );

      expect(commandBusStub.execute).toBeCalledWith(expectedCommand);
    });

    it('should throw if CommandBus throws', async () => {
      const expectedError = new Error('something went wrong');
      commandBusStub.execute.mockRejectedValueOnce(expectedError);

      const promise = appointmentsService.createAppointment(fakeAppointment);

      expect(promise).rejects.toThrow();
    });
  });
});
