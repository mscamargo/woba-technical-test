import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { AppointmentsService } from './appointments.service';

@Controller({
  path: 'appointments',
  version: '1',
})
export class AppointmentsController {
  constructor(private readonly appService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appService.createAppointment(createAppointmentDto);
  }

  @Get()
  async list(@Headers('x-user-id') userId?: string) {
    return this.appService.getAppointmentsByUserId(userId);
  }
}
