// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import {UserTest} from '../src/types/DBTypes';
import {Application} from 'express';

// get user from graphql query users
const getUser = (url: string | Application): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: '{users{id user_name email organization}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('organization');
          resolve(response.body.data.users);
        }
      });
  });
};

// Get users by organization from graphql query usersByOrganization test
const getUsersByOrganization = (
  url: string | Application,
  organization: string,
): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `{usersByOrganization(organization:"${organization}"){id user_name email organization}}`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.usersByOrganization;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('organization');
          resolve(response.body.data.usersByOrganization);
        }
      });
  });
};

// Get user by id from graphql query userById test
const getUserById = (
  url: string | Application,
  id: string,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `{userById(id:"${id}"){id user_name email organization}}`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('organization');
          resolve(response.body.data.userById);
        }
      });
  });
};

// Register test user from graphql mutation registerTestUser test
const registerTestUser = (
  url: string | Application,
  employee: UserTest,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation RegisterTestUser($user: UserInputTests!) {
            registerTestUser(user: $user) {
              message
              user {
                id
                user_name
                email
                organization
                
              }
            }
          }`,
        variables: {
          user: {
            user_name: employee.user_name,
            email: employee.email,
            organization: employee.organization,
            password: employee.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.registerTestUser.user;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('organization');
          resolve(response.body.data.registerTestUser);
        }
      });
  });
};

// Register another test user from graphql mutation registerAnotherTestUser test
const registerAnotherTestUser = (
  url: string | Application,
  employee: UserTest,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation RegisterTestUser($user: UserInputTests!) {
              registerTestUser(user: $user) {
                message
                user {
                  id
                  user_name
                  email
                  organization
                  
                }
              }
            }`,
        variables: {
          user: {
            user_name: employee.user_name,
            email: employee.email,
            organization: employee.organization,
            password: employee.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.registerAnotherTestUser.user;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('organization');
          resolve(response.body.data.registerAnotherTestUser);
        }
      });
  });
};

export {
  getUser,
  getUsersByOrganization,
  getUserById,
  registerTestUser,
  registerAnotherTestUser,
};
