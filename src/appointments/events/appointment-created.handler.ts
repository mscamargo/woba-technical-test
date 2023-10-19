import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppointmentCreatedEvent } from './appointment-created.event';

@EventsHandler(AppointmentCreatedEvent)
export class AppointmentCreatedHandler
  implements IEventHandler<AppointmentCreatedEvent>
{
  handle(event: AppointmentCreatedEvent) {
    console.log({ event });
  }
}
