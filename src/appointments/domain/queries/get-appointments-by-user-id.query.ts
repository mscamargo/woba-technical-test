export class GetAppointmentsByUserIdQuery {
  constructor(readonly user_id: string) {}
}

type AppointmentRecord = {
  id: string;
  user_id: string;
  space_id: string;
  start_time: Date;
  end_time: Date;
};

export class GetAppointmentsByUserIdQueryResult {
  constructor(readonly appointments: AppointmentRecord[]) {}
}
