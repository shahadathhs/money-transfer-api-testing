import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';

beforeAll(async () => {
  // Setup your database connection or any required server setup
  await mongoose.connect('mongodb://localhost:27017/moneyTransferDB')
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
});

describe('Users API Testing', () => {
  it('Get all users', async () => {
    const response = await supertest(app).get('/users');
    expect(response.status).toBe(200);
  }, 10000);
});
