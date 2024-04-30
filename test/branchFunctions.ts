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
          console.log('response', response.body);
          const branch = response.body.data.addBranch.branch;
          expect(branch).toHaveProperty('id');
          expect(branch).toHaveProperty('branch_name');
          resolve(response.body.data.addBranch);
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

export {postBranch, branches};
