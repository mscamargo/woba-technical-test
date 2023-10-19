import { IsISO8601, IsUUID, Matches } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateAppointmentDto {
  @IsUUID()
  space_id: string;

  @IsUUID()
  user_id: string;

  @IsISO8601({
    strict: true,
    strictSeparator: true,
  })
  date: string;

  @Matches(TIME_REGEX)
  start_time: string;

  @Matches(TIME_REGEX)
  end_time: string;
}
