import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 1);

const pastDate = new Date();
pastDate.setMonth(pastDate.getMonth() - 1);

const fakeAppointment = {
  date: futureDate.toISOString(),
  start_time: '08:00',
  end_time: '18:00',
  space_id: randomUUID(),
  user_id: randomUUID(),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/v1/appointments (POST)', () => {
    const requiredFields = [
      'date',
      'start_time',
      'end_time',
      'space_id',
      'user_id',
    ];

    describe.each(requiredFields)('when `%s` is missing', (field) => {
      it('should return 400 with the correct error response', async () => {
        const data = { ...fakeAppointment };
        Reflect.deleteProperty(data, field);

        const response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(data);

        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Bad Request');
        expect(response.body.statusCode).toEqual(400);
        expect(response.body.message).toBeInstanceOf(Array);
      });
    });

    describe("Let's fight with dates ¯\\_(ツ)_/¯", () => {
      describe('when `date` does not follow the ISO 8601', () => {
        it.each([
          '31/12/2022',
          '2023/12/31',
          '2022-13-01',
          '2022-01-32',
          '2022-01-01T25:00:00',
          '2022-01-01T00:61:00',
          '2022-01-01T00:00:61',
          '2022-01-01T00:00:00Z+03:00',
          '2023-10-18 21:29:42.853Z',
        ])('%s should return 400', async (invalidDate) => {
          const data = { ...fakeAppointment };
          data.date = invalidDate;

          const response = await request(app.getHttpServer())
            .post('/v1/appointments')
            .send(data);

          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('Bad Request');
          expect(response.body.statusCode).toEqual(400);
          expect(response.body.message).toBeInstanceOf(Array);
        });
      });

      describe('when `start_time` does not follow the format HH:MM (23:59)', () => {
        it.each([
          '1234',
          '1:00',
          '12:3',
          '24:00',
          '12:60',
          '12:00:00',
          'abc:def',
        ])('%s should return 400', async (invalidTime) => {
          const data = { ...fakeAppointment };
          data.start_time = invalidTime;

          const response = await request(app.getHttpServer())
            .post('/v1/appointments')
            .send(data);

          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('Bad Request');
          expect(response.body.statusCode).toEqual(400);
          expect(response.body.message).toBeInstanceOf(Array);
        });
      });

      describe('when `end_time` does not follow the format HH:MM (23:59)', () => {
        it.each([
          '1234',
          '1:00',
          '12:3',
          '24:00',
          '12:60',
          '12:00:00',
          'abc:def',
        ])('%s should return 400', async (invalidTime) => {
          const data = { ...fakeAppointment };
          data.end_time = invalidTime;

          const response = await request(app.getHttpServer())
            .post('/v1/appointments')
            .send(data);

          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('Bad Request');
          expect(response.body.statusCode).toEqual(400);
          expect(response.body.message).toBeInstanceOf(Array);
        });
      });
    });

    describe('when `user_id` is an invalid uuid', () => {
      it('should return 400', async () => {
        const data = { ...fakeAppointment };

        //@ts-expect-error: just fine
        data.user_id = 'invalid-uuid';

        const response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(data);

        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Bad Request');
        expect(response.body.statusCode).toEqual(400);
        expect(response.body.message).toBeInstanceOf(Array);
      });
    });

    describe('when `space_id` is an invalid uuid', () => {
      let response: request.Response;

      beforeEach(async () => {
        const data = { ...fakeAppointment };

        //@ts-expect-error: just fine
        data.space_id = 'invalid-uuid';

        response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(data);
      });

      it('should return 400', () => {
        expect(response.status).toEqual(400);
      });

      it('should contains the correct validation error in the message', () => {
        expect(
          response.body.message.find(
            (msg: string) => msg === 'space_id must be a UUID',
          ),
        ).toBeTruthy();
      });
    });

    describe('when `date` is in the past', () => {
      it('should return 422 and an error message', async () => {
        const data = { ...fakeAppointment };
        data.date = pastDate.toISOString();

        const response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(data);

        expect(response.status).toEqual(422);
        expect(response.body.message).toContain(
          'the appointment must start in the future',
        );
      });
    });

    describe('when `start_time` is after end_time', () => {
      it('should return 422 and an error message', async () => {
        const data = { ...fakeAppointment };
        data.date = futureDate.toISOString();
        data.start_time = '18:00';
        data.end_time = '08:00';

        const response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(data);

        expect(response.status).toEqual(422);
        expect(response.body.message).toContain(
          'the start of the appointment must be before the end',
        );
      });
    });

    describe('when everything is fine', () => {
      it('should return 201', async () => {
        const response = await request(app.getHttpServer())
          .post('/v1/appointments')
          .send(fakeAppointment);

        expect(response.status).toEqual(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.created_at).toBeDefined();
      });
    });
  });

  describe('/v1/appointments (GET)', () => {
    it('should return 401 when x-user-id is missing', () => {
      return request(app.getHttpServer()).get('/v1/appointments').expect(401);
    });

    it('should not return appointments from another user', async () => {
      const userAId = randomUUID();
      const userBId = randomUUID();

      const userAAppointments = Array.from({ length: 3 }).map(() => ({
        ...fakeAppointment,
        user_id: userAId,
      }));
      const userBAppointments = Array.from({ length: 2 }).map(() => ({
        ...fakeAppointment,
        user_id: userBId,
      }));

      const appointmentsToCreate = [...userAAppointments, ...userBAppointments];

      await Promise.all(
        appointmentsToCreate.map((appointmentData) =>
          request(app.getHttpServer())
            .post('/v1/appointments')
            .send(appointmentData),
        ),
      );

      const response = await request(app.getHttpServer())
        .get('/v1/appointments')
        .set('x-user-id', userAId);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(userAAppointments.length);
      expect(response.body.filter((a) => a.user_id === userBId).length).toBe(0);
    });

    it("should return a list of user's appointments", async () => {
      const userId = randomUUID();

      const appointmentsToCreate = Array.from({ length: 3 }).map(() => ({
        ...fakeAppointment,
        user_id: userId,
      }));

      await Promise.all(
        appointmentsToCreate.map((appointmentData) =>
          request(app.getHttpServer())
            .post('/v1/appointments')
            .send(appointmentData),
        ),
      );

      const response = await request(app.getHttpServer())
        .get('/v1/appointments')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(appointmentsToCreate.length);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].space_id).toBeDefined();
      expect(response.body[0].user_id).toBeDefined();
      expect(response.body[0].date).toBeDefined();
      expect(response.body[0].start_time).toBeDefined();
      expect(response.body[0].end_time).toBeDefined();
      expect(response.body[0].created_at).toBeUndefined();
      expect(response.body[0].updated_at).toBeUndefined();
      expect(response.body[0].user_id).toEqual(userId);
    });
  });
});
