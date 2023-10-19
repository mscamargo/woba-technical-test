import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetAppointmentsByUserIdQuery,
  GetAppointmentsByUserIdQueryResult,
} from './get-appointments-by-user-id.query';
import { AppointmentsRepository } from '../interfaces/repositories/appointments.repository';

@QueryHandler(GetAppointmentsByUserIdQuery)
export class GetAppointmentsByUserIdHandler
  implements IQueryHandler<GetAppointmentsByUserIdQuery>
{
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(query: GetAppointmentsByUserIdQuery) {
    const appointments = await this.appointmentsRepository.findByUserId(
      query.user_id,
    );
    return new GetAppointmentsByUserIdQueryResult(appointments);
  }
}
