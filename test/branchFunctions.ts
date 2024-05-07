/* eslint-disable node/no-unpublished-import */
import {BranchTest} from '../src/types/DBTypes';
import {Application} from 'express';
import request from 'supertest';

const postBranch = (
  url: string | Application,
  branch: BranchTest,
  token: string,
): Promise<BranchTest> => {
  return new Promise((resolve, reject) => {
    console.log('branch', branch);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation Mutation($branch: BranchInput) {
            addBranch(branch: $branch) {
              message
              branch {
                id
                branch_name
                organization {
                  id
                  organization_name
                }
              }
            }
          }`,
        variables: {
          branch: branch,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('postBranch', response.body);
          const branch = response.body.data.addBranch.branch;
          expect(branch).toHaveProperty('id');
          expect(branch).toHaveProperty('branch_name');
          resolve(response.body.data.addBranch.branch);
        }
      });
  });
};

const branches = (url: string | Application) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Branches {
            branches {
              id
              branch_name
              organization {
                id
                organization_name
              }
            }
          }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.branches);
        }
      });
  });
};

const branchById = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Branch($branchById: ID!) {
            branchById(id: $branchById) {
              id
              branch_name
              organization {
                id
                organization_name
              }
            }
          }`,
        variables: {
          branchById: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('branchById id', id);
          console.log('branchById', response.body);
          const branch = response.body.data.branchById;
          expect(branch).toHaveProperty('id');
          expect(branch).toHaveProperty('branch_name');
          resolve(response.body.data.branchById);
        }
      });
  });
};

const branchesByOrganization = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Branches($organization: ID!) {
            branchesByOrganization(organization: $organization) {
              id
              branch_name
              organization {
                id
                organization_name
              }
            }
          }`,
        variables: {
          organization: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.branchesByOrganization);
        }
      });
  });
};

const branchByName = (url: string | Application, branch_name: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Branch($branch_name: String!) {
            branchByName(branch_name: $branch_name) {
              id
              branch_name
              organization {
                id
                organization_name
              }
            }
          }`,
        variables: {
          branch_name: branch_name,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.branchByName);
        }
      });
  });
};

const modifyBranch = (
  url: string | Application,
  branch: BranchTest,
  token: string,
): Promise<BranchTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation Mutation($branch: BranchInput) {
            modifyBranch(branch: $branch) {
              message
              branch {
                id
                branch_name
                organization {
                  id
                  organization_name
                }
              }
            }
          }`,
        variables: {
          branch: branch,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const branch = response.body.data.modifyBranch.branch;
          expect(branch).toHaveProperty('id');
          expect(branch).toHaveProperty('branch_name');
          resolve(response.body.data.modifyBranch);
        }
      });
  });
};
const deleteBranch = (url: string | Application, id: string, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation Mutation($deleteBranchId: ID!) {
            deleteBranch(id: $deleteBranchId) {
              message
            }
          }`,
        variables: {
          deleteBranchId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('deleteBranch', response.body);
          expect(response.body.data.deleteBranch).toHaveProperty('message');
          resolve(response.body.data.deleteBranch);
        }
      });
  });
};

export {
  postBranch,
  branches,
  branchById,
  branchesByOrganization,
  branchByName,
  modifyBranch,
  deleteBranch,
};
