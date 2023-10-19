export class CreateAppointmentCommand {
  constructor(
    readonly user_id: string,
    readonly space_id: string,
    readonly date: string,
    readonly start_time: string,
    readonly end_time: string,
  ) {}
}
