import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  AppointmentsRepository,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  FindByUserIdResponse,
} from '../../domain/interfaces/repositories/appointments.repository';

@Injectable()
export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  #appointments: CreateAppointmentResponse[] = [];

  async create(request: CreateAppointmentRequest) {
    const appointment: CreateAppointmentResponse = {
      id: randomUUID(),
      space_id: request.space_id,
      user_id: request.user_id,
      start_time: request.start_time,
      end_time: request.end_time,
      created_at: new Date(),
      updated_at: null,
    };

    this.#appointments.push(appointment);

    return appointment;
  }

  async findByUserId(userId: string) {
    const appointments: FindByUserIdResponse = this.#appointments
      .filter((appointment) => appointment.user_id === userId)
      .map((appointment) => ({
        id: appointment.id,
        user_id: appointment.user_id,
        space_id: appointment.space_id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
      }));

    return appointments;
  }
}
