import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentCreatedEvent } from './events/appointment-created.event';

@Injectable()
export class AppService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
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

  async getAppointmentsByUserId(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.appointmentsRepository.findByUserId(userId);
  }
}
