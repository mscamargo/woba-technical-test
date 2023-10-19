import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentsRepository } from '../appointments.repository';
import { GetAppointmentsByUserIdQuery } from './get-appointments-by-user-id.query';

@QueryHandler(GetAppointmentsByUserIdQuery)
export class GetAppointmentsByUserIdHandler
  implements IQueryHandler<GetAppointmentsByUserIdQuery>
{
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(query: GetAppointmentsByUserIdQuery) {
    return await this.appointmentsRepository.findByUserId(query.user_id);
  }
}
