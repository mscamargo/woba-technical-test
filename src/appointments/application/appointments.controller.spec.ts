import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';

describe(AppointmentsController.name, () => {
  let appointmentsController: AppointmentsController;
  const appointmentsServiceStub = {
    createAppointment: jest.fn(),
    getAppointmentsByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: appointmentsServiceStub },
      ],
    }).compile();

    appointmentsController = app.get<AppointmentsController>(
      AppointmentsController,
    );
  });

  describe('create()', () => {
    const createAppointmentDto: CreateAppointmentDto = {
      date: 'any_valid_date',
      end_time: 'any_valid_end_time',
      space_id: 'any_valid_space_id',
      start_time: 'any_valid_start_time',
      user_id: 'any_valid_user_id',
    };

    it('should correctly call the AppointmentService', async () => {
      await appointmentsController.create(createAppointmentDto);

      expect(appointmentsServiceStub.createAppointment).toBeCalledWith(
        createAppointmentDto,
      );
    });

    it('should return the result from the AppointmentService', async () => {
      const expectedResult = {
        id: 'any_id',
      };
      appointmentsServiceStub.createAppointment.mockResolvedValueOnce(
        expectedResult,
      );
      const actualResult =
        await appointmentsController.create(createAppointmentDto);

      expect(actualResult).toEqual(expectedResult);
    });

    it('should throw if AppointmentService throws', async () => {
      const expectedError = new Error('something went wrong');
      appointmentsServiceStub.createAppointment.mockRejectedValueOnce(
        expectedError,
      );

      const promise = appointmentsController.create(createAppointmentDto);

      expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('list()', () => {
    it('should correctly call the AppointmentService', async () => {
      const userId = 'any_valid_user_id';
      await appointmentsController.list(userId);

      expect(appointmentsServiceStub.getAppointmentsByUserId).toBeCalledWith(
        userId,
      );
    });

    it('should return the result from the AppointmentService', async () => {
      const expectedResult = {
        id: 'any_id',
      };
      appointmentsServiceStub.getAppointmentsByUserId.mockResolvedValueOnce(
        expectedResult,
      );
      const actualResult = await appointmentsController.list('');

      expect(actualResult).toEqual(expectedResult);
    });

    it('should throw if AppointmentService throws', async () => {
      const expectedError = new Error('something went wrong');
      appointmentsServiceStub.getAppointmentsByUserId.mockRejectedValueOnce(
        expectedError,
      );

      const promise = appointmentsController.list('');

      expect(promise).rejects.toThrow(expectedError);
    });
  });
});
