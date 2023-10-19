import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppService } from './app.service';

@Controller({
  path: 'appointments',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appService.createAppointment(createAppointmentDto);
  }

  @Get()
  async list(@Headers('x-user-id') userId?: string) {
    return this.appService.getAppointmentsByUserId(userId);
  }
}
