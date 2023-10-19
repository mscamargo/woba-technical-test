export class CreateAppointmentCommand {
  constructor(
    readonly user_id: string,
    readonly space_id: string,
    readonly start_time: Date,
    readonly end_time: Date,
  ) {}
}

export class CreateAppointmentCommandResult {
  constructor(
    readonly id: string,
    readonly user_id: string,
    readonly space_id: string,
    readonly start_time: Date,
    readonly end_time: Date,
    readonly created_at: Date,
    readonly updated_at: Date,
  ) {}
}
