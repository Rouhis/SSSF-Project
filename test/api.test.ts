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
  modifyUser,
  tokenCheck,
} from './userFunctions';
import mongoose, {ObjectId} from 'mongoose';
import {getNotFound} from './testFunctions';
import randomstring from 'randomstring';
import {LoginResponse, OrganizationResponse} from '../src/types/MessageTypes';
import {
  BranchTest,
  KeyTest,
  Organization,
  OrganizationTest,
  UserTest,
} from '../src/types/DBTypes';
import {
  deleteOrganization,
  getAllOrganizations,
  modifyOrganization,
  organizationById,
  organizationByName,
  postOrganization,
} from './organizationFunctions';

import {branchById, deleteBranch, postBranch} from './branchFunctions';
import {
  addKey,
  deleteKey,
  keyById,
  keys,
  keysByBranch,
  keysByOrganization,
  keysByUser,
  keysOut,
  loanKey,
  modifyKey,
} from './keyFunctions';
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

  // create variables for tests
  let userData: LoginResponse;
  let userData2: LoginResponse;
  let adminData: LoginResponse;
  let branchData: BranchTest;
  let keyData: KeyTest;
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
  const testUser4: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    password: 'salsisalasana',
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

  const testBranch: BranchTest = {
    branch_name: 'Karamalmi' + randomstring.generate(5),
    organization: undefined,
  };

  const testKey: KeyTest = {
    key_name: 'Key ' + randomstring.generate(5),
    branch: undefined,
  };
  const testKey2: KeyTest = {
    key_name: 'Key ' + randomstring.generate(5),
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
  it('should modify user', async () => {
    await modifyUser(app, testUser4, adminData.token);
  });
  it('should create a employee (user)', async () => {
    await postEmployee(app, facilityManagerData.token, testUser3);
  });

  it('it should check user token', async () => {
    await tokenCheck(app, facilityManagerData.token);
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

  it('should get organization by id', async () => {
    await organizationById(app, organizationData.organization.id as string);
  });

  it('should get organization by name', async () => {
    const organizationName = organizationData.organization?.organization_name;
    if (organizationName) {
      await organizationByName(app, organizationName);
    } else {
      throw new Error('Organization name is undefined');
    }
  });
  it('should modify organization', async () => {
    await modifyOrganization(
      app,
      organizationData.organization as Partial<Organization>,
      adminData.token,
    );
  });

  it('should post branch', async () => {
    testBranch.organization = new mongoose.Types.ObjectId(
      organizationData.organization?.id,
    );
    branchData = (await postBranch(
      app,
      testBranch,
      adminData.token,
    )) as BranchTest;
    testKey.branch = new mongoose.Types.ObjectId(branchData.id);
  });

  it('should get branch by id', async () => {
    await branchById(app, branchData.id);
  });
  it('should add a key', async () => {
    keyData = (await addKey(
      app,
      testKey,
      facilityManagerData.token,
    )) as KeyTest;
  });
  it('should get all keys', async () => {
    await keys(app);
  });

  it('should get key by id', async () => {
    await keyById(app, keyData.id);
  });

  it('should loan a key', async () => {
    await loanKey(app, keyData.id, userData.token);
  });
  it('should get keys loaned by user', async () => {
    await keysByUser(app, userData.user.id);
  });
  it('should get keys that are out', async () => {
    await keysOut(app, userData.token);
  });
  it('should get keys by organization', async () => {
    await keysByOrganization(app, userData.token);
  });
  it('should get keys by branch', async () => {
    await keysByBranch(app, branchData.id);
  });
  it('should modify key', async () => {
    await modifyKey(app, keyData.id, facilityManagerData.token);
  });

  it('should delete key', async () => {
    await deleteKey(app, keyData.id, facilityManagerData.token);
  });
  it('should delete branch', async () => {
    await deleteBranch(app, branchData.id, adminData.token);
  });
  it('should delete organization', async () => {
    await deleteOrganization(
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
