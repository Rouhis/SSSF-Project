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
  deleteUser,
  deleteUserAsAdmin,
} from './userFunctions';
import mongoose from 'mongoose';
import {getNotFound} from './testFunctions';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import {LoginResponse, OrganizationResponse} from '../src/types/MessageTypes';
import {Organization, OrganizationTest, UserTest} from '../src/types/DBTypes';
import {
  getAllOrganizations,
  modifyOrganization,
  postOrganization,
} from './organizationFunctions';

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
  let organizationData: OrganizationResponse;
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

  const testOrganization: OrganizationTest = {
    organization_name: 'Metropolia' + randomstring.generate(5),
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

  it('should return array of users', async () => {
    await getUser(app);
  });

  it('should return users by organization', async () => {
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

  it('should create an organization', async () => {
    organizationData = (await postOrganization(
      app,
      testOrganization,
      adminData.token,
    )) as OrganizationResponse;
  });

  it('should get all organizations', async () => {
    await getAllOrganizations(app);
  });

  it('should modify organization', async () => {
    await modifyOrganization(
      app,
      organizationData.organization as Partial<Organization>,
      adminData.token,
    );
  });

  it('should delete user', async () => {
    await deleteUser(app, userData2.user.id, facilityManagerData.token);
  });

  it('should delete user as admin', async () => {
    await deleteUserAsAdmin(app, userData.user.id, adminData.token);
  });
});
