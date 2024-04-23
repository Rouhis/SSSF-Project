import app from '../src/app';
import {
  getUser,
  getUsersByOrganization,
  getUserById,
  registerTestUser,
} from './userFunctions';
import mongoose from 'mongoose';
import {getNotFound} from './testFunctions';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import {LoginResponse} from '../src/types/MessageTypes';
import {UserTest} from '../src/types/DBTypes';

describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  // test create user
  let userData: LoginResponse;
  let userData2: LoginResponse;
  let adminData: LoginResponse;

  const testUser: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    organization: 'Metropolia',
    password: 'testisalasana',
  };

  const testUser2: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    organization: 'Metropolia',
    password: 'testisalasana',
  };

  const adminUser: UserTest = {
    email: 'admin@metropolia.fi',
    password: '12345',
    organization: 'Metropolia',
  };

  it('should create a user', async () => {
    await registerTestUser(app, testUser);
  });
  it('should create another user', async () => {
    await registerTestUser(app, testUser2);
  });
  // test get all users
  it('should return array of users', async () => {
    await getUser(app);
  });

  it('should return users by organization', async () => {
    await getUsersByOrganization(app, 'metropolia');
  });

  it('should return user by id', async () => {
    await getUserById(app, '6626a6487c7d4f656d883e76');
  });
});
