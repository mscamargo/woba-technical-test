import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './appointments.service';
import { APP_PIPE } from '@nestjs/core';
import { AppointmentsRepository } from './appointments.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentsController } from './appointments.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateAppointmentHandler } from './commands/create-appointment.handler';
import { GetAppointmentsByUserIdHandler } from './queries/get-appointments-by-user-id.handler';
import { AppointmentCreatedHandler } from './events/appointment-created.handler';

@Module({
  imports: [EventEmitterModule.forRoot(), CqrsModule],
  controllers: [AppointmentsController],
  providers: [
    AppService,
    AppointmentsRepository,
    CreateAppointmentHandler,
    GetAppointmentsByUserIdHandler,
    AppointmentCreatedHandler,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppointmentsModule {}
