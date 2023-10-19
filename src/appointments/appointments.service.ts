import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from './commands/create-appointment.command';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { GetAppointmentsByUserIdQuery } from './queries/get-appointments-by-user-id.query';

@Injectable()
export class AppService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    return await this.commandBus.execute(
      new CreateAppointmentCommand(
        createAppointmentDto.user_id,
        createAppointmentDto.space_id,
        createAppointmentDto.date,
        createAppointmentDto.start_time,
        createAppointmentDto.end_time,
      ),
    );
  }

  async getAppointmentsByUserId(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.queryBus.execute(
      new GetAppointmentsByUserIdQuery(userId),
    );
  }
}
