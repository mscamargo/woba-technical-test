import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AppointmentCreatedEvent } from '../events/appointment-created.event';
import { AppointmentsRepository } from '../interfaces/repositories/appointments.repository';
import {
  CreateAppointmentCommand,
  CreateAppointmentCommandResult,
} from './create-appointment.command';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
  implements ICommandHandler<CreateAppointmentCommand>
{
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateAppointmentCommand,
  ): Promise<CreateAppointmentCommandResult> {
    const { end_time, space_id, start_time, user_id } = command;

    const now = new Date();

    if (start_time < now) {
      throw new UnprocessableEntityException(
        'the appointment must start in the future',
      );
    }

    if (start_time > end_time) {
      throw new UnprocessableEntityException(
        'the start of the appointment must be before the end',
      );
    }

    const createdAppointment = await this.appointmentsRepository.create({
      end_time,
      space_id,
      start_time,
      user_id,
    });

    this.eventBus.publish(
      new AppointmentCreatedEvent(
        createdAppointment.id,
        createdAppointment.created_at,
      ),
    );

    const createAppointmentResult = new CreateAppointmentCommandResult(
      createdAppointment.id,
      createdAppointment.user_id,
      createdAppointment.space_id,
      createdAppointment.start_time,
      createdAppointment.end_time,
      createdAppointment.created_at,
      createdAppointment.updated_at,
    );

    return createAppointmentResult;
  }
}
