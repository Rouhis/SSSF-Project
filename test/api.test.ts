/* eslint-disable @typescript-eslint/no-unused-vars */
import app from '../src/app';
import {
  getUser,
  getUsersByOrganization,
  getUserById,
  registerTestUser,
  loginUser,
  postFacilityManager,
  postEmployee,
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
  let facilityManagerData: LoginResponse;

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

  const testUser3: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    organization: 'Metropolia',
    password: 'testisalasana',
  };

  const facilityManager: UserTest = {
    user_name: 'Facility Manager ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@facility.fi',
    organization: 'Metropolia',
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
  it('should login user', async () => {
    const vars = {
      credentials: {
        username: testUser.email!,
        password: testUser.password!,
      },
    };
    userData = await loginUser(app, vars);
  });
  // test get all users
  it('should return array of users', async () => {
    await getUser(app);
  });

  it('should return users by organization', async () => {
    const organization = testUser.organization || 'metropolia';
    await getUsersByOrganization(app, userData.user.organization);
  });

  it('should return user by id', async () => {
    await getUserById(app, userData.user.id!);
  });

  it('should login second user', async () => {
    const vars = {
      credentials: {
        username: testUser2.email!,
        password: testUser2.password!,
      },
    };
    userData2 = await loginUser(app, vars);
  });

  it('should login admin', async () => {
    const vars = {
      credentials: {
        username: adminUser.email!,
        password: adminUser.password!,
      },
    };
    adminData = await loginUser(app, vars);
  });
  it('should add a facility manager', async () => {
    await postFacilityManager(app, facilityManager, adminData.token);
  });

  it('should login facility manager', async () => {
    const vars = {
      credentials: {
        username: testUser.email!,
        password: testUser.password!,
      },
    };
    facilityManagerData = await loginUser(app, vars);
  });

  it('should create a employee (user)', async () => {
    await postEmployee(app, facilityManagerData.token, testUser3);
  });
});
