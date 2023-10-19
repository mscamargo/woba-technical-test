import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentsController } from './application/appointments.controller';
import { AppointmentService } from './application/appointments.service';
import { CreateAppointmentHandler } from './domain/commands/create-appointment.handler';
import { AppointmentCreatedHandler } from './domain/events/appointment-created.handler';
import { AppointmentsRepository } from './domain/interfaces/repositories/appointments.repository';
import { GetAppointmentsByUserIdHandler } from './domain/queries/get-appointments-by-user-id.handler';
import { InMemoryAppointmentsRepository } from './infra/repositories/in-memory-appointments.repository';

@Module({
  imports: [EventEmitterModule.forRoot(), CqrsModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentService,
    CreateAppointmentHandler,
    GetAppointmentsByUserIdHandler,
    AppointmentCreatedHandler,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: AppointmentsRepository,
      useClass: InMemoryAppointmentsRepository,
    },
  ],
})
export class AppointmentsModule {}
