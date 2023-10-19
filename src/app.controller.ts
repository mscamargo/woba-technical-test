import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentCreatedEvent } from './appointment-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller({
  path: 'appointments',
  version: '1',
})
export class AppController {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const now = new Date();

    const [startHour, startMinute] = createAppointmentDto.start_time.split(':');
    const [endHour, endMinute] = createAppointmentDto.end_time.split(':');

    const appointmentStartTime = new Date(createAppointmentDto.date);
    appointmentStartTime.setHours(Number(startHour), Number(startMinute));

    const appointmentEndTime = new Date(createAppointmentDto.date);
    appointmentEndTime.setHours(Number(endHour), Number(endMinute));

    if (appointmentStartTime < now) {
      throw new UnprocessableEntityException(
        'the appointment must start in the future',
      );
    }

    if (appointmentStartTime > appointmentEndTime) {
      throw new UnprocessableEntityException(
        'the start of the appointment must be before the end',
      );
    }

    const appointment =
      await this.appointmentsRepository.create(createAppointmentDto);

    this.eventEmitter.emit(
      'appointment.created',
      new AppointmentCreatedEvent(appointment.id, appointment.created_at),
    );

    return appointment;
  }

  @Get()
  async list(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.appointmentsRepository.findByUserId(userId);
  }
}
