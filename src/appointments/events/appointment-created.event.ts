export class AppointmentCreatedEvent {
  constructor(
    readonly id: string,
    readonly created_at: Date,
  ) {}
}
