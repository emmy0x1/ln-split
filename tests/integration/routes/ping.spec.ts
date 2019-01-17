import supertest from 'supertest';
import { app, server } from '../../../src/index';

describe('ping route', () => {
  afterEach(async () => {
    await server.close();
  });

  it('should return pong', done => {
    supertest(app)
      .get('/api/ping')
      .end((err: any, res: supertest.Response) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toBe('pong');
          done();
        }
      });
  });
});
