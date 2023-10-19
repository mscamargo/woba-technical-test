import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './appointments.service';
import { APP_PIPE } from '@nestjs/core';
import { AppointmentsRepository } from './appointments.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentsController } from './appointments.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppointmentsController],
  providers: [
    AppService,
    AppointmentsRepository,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppointmentsModule {}
