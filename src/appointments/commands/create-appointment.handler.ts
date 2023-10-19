import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from './create-appointment.command';
import { AppointmentsRepository } from '../appointments.repository';
import { UnprocessableEntityException } from '@nestjs/common';
import { AppointmentCreatedEvent } from '../events/appointment-created.event';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
  implements ICommandHandler<CreateAppointmentCommand>
{
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAppointmentCommand) {
    const now = new Date();

    const [startHour, startMinute] = command.start_time.split(':');
    const [endHour, endMinute] = command.end_time.split(':');

    const appointmentStartTime = new Date(command.date);
    appointmentStartTime.setHours(Number(startHour), Number(startMinute));

    const appointmentEndTime = new Date(command.date);
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

    const appointment = await this.appointmentsRepository.create(command);

    this.eventBus.publish(
      new AppointmentCreatedEvent(appointment.id, appointment.created_at),
    );

    return appointment;
  }
}
