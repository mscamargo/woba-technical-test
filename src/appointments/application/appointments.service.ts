import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateAppointmentCommand,
  CreateAppointmentCommandResult,
} from '../domain/commands/create-appointment.command';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import {
  GetAppointmentsByUserIdQuery,
  GetAppointmentsByUserIdQueryResult,
} from '../domain/queries/get-appointments-by-user-id.query';
import { CreatedAppointmentDto } from './dtos/created-appointment.dto';
import { AppointmentDetailDto } from './dtos/appointment-detail.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreatedAppointmentDto> {
    const { user_id, space_id, date, end_time, start_time } =
      createAppointmentDto;

    const [startHour, startMinute] = start_time.split(':');
    const [endHour, endMinute] = end_time.split(':');

    const appointmentStartTime = new Date(date);
    appointmentStartTime.setUTCHours(Number(startHour), Number(startMinute));

    const appointmentEndTime = new Date(date);
    appointmentEndTime.setUTCHours(Number(endHour), Number(endMinute));

    const { id, created_at, updated_at } = await this.commandBus.execute<
      CreateAppointmentCommand,
      CreateAppointmentCommandResult
    >(
      new CreateAppointmentCommand(
        user_id,
        space_id,
        appointmentStartTime,
        appointmentEndTime,
      ),
    );

    return {
      id,
      created_at,
      updated_at,
      user_id,
      space_id,
      date,
      start_time,
      end_time,
    };
  }

  async getAppointmentsByUserId(
    userId?: string,
  ): Promise<AppointmentDetailDto[]> {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { appointments } = await this.queryBus.execute<
      GetAppointmentsByUserIdQuery,
      GetAppointmentsByUserIdQueryResult
    >(new GetAppointmentsByUserIdQuery(userId));

    const formattedAppointments: AppointmentDetailDto[] = appointments.map(
      (appointment) => ({
        ...appointment,
        date: appointment.start_time.toISOString().split('T')[0],
        start_time: appointment.start_time
          .toISOString()
          .split('T')[1]
          .substring(0, 5),
        end_time: appointment.end_time
          .toISOString()
          .split('T')[1]
          .substring(0, 5),
      }),
    );

    return formattedAppointments;
  }
}
