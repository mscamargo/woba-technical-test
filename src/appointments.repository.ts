import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './create-appointment.dto';

interface Appointment {
  id: string;
  user_id: string;
  space_id: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date | null;
}

export type AppointmentCreationResult = Omit<Appointment, 'updated_at'>;

export type AppointmentList = Array<
  Omit<Appointment, 'created_at' | 'updated_at'>
>;

@Injectable()
export class AppointmentsRepository {
  #appointments: Appointment[] = [];

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentCreationResult> {
    const appointment: Appointment = {
      id: randomUUID(),
      space_id: createAppointmentDto.space_id,
      user_id: createAppointmentDto.user_id,
      date: createAppointmentDto.date,
      start_time: createAppointmentDto.start_time,
      end_time: createAppointmentDto.end_time,
      created_at: new Date(),
      updated_at: null,
    };

    this.#appointments.push(appointment);

    return appointment;
  }

  async findByUserId(userId: string): Promise<AppointmentList> {
    const appointments: AppointmentList = this.#appointments
      .filter((appointment) => appointment.user_id === userId)
      .map((appointment) => ({
        id: appointment.id,
        user_id: appointment.user_id,
        space_id: appointment.space_id,
        date: appointment.date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
      }));

    return appointments;
  }
}
