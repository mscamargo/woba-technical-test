import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

describe(AppointmentsController.name, () => {
  let appointmentsController: AppointmentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentService],
    }).compile();

    appointmentsController = app.get<AppointmentsController>(
      AppointmentsController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appointmentsController.getHello()).toBe('Hello World!');
    });
  });
});
