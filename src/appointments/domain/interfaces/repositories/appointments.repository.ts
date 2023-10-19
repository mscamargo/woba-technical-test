type BaseAppointmentRecord = {
  user_id: string;
  space_id: string;
  start_time: Date;
  end_time: Date;
};

export type CreateAppointmentRequest = BaseAppointmentRecord;

export type CreateAppointmentResponse = BaseAppointmentRecord & {
  id: string;
  created_at: Date;
  updated_at: null;
};

export type FindByUserIdResponse = Array<
  Omit<CreateAppointmentResponse, 'created_at' | 'updated_at'>
>;

export abstract class AppointmentsRepository {
  public abstract create(
    request: CreateAppointmentRequest,
  ): Promise<CreateAppointmentResponse>;

  public abstract findByUserId(userId: string): Promise<FindByUserIdResponse>;
}
