/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {OrganizationTest} from '../src/types/DBTypes';
import {Application} from 'express';

const postOrganization = (
  url: string | Application,
  organization: OrganizationTest,
  token: string,
): Promise<OrganizationTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `
                mutation AddOrganization($organization: OrganizationInput) {
                        addOrganization(organization: $organization) {
                            message
                            organization {
                                id
                                organization_name
                            }
                        }
                    }`,
        variables: {
          organization: organization,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const organization = response.body.data.addOrganization.organization;
          expect(organization).toHaveProperty('id');
          expect(organization).toHaveProperty('organization_name');
          resolve(response.body.data.addOrganization);
        }
      });
  });
};

const getAllOrganizations = (url: string | Application) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
        query Query {
            organizations {
              id
              organization_name
            }
          }
        `,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log(response.body.data);
          const organization = response.body.data.organizations;
          expect(organization[0]).toHaveProperty('id');
          expect(organization[0]).toHaveProperty('organization_name');
          resolve(response.body.data.organizations.organization);
        }
      });
  });
};

const modifyOrganization = (
  url: string | Application,
  organization: OrganizationTest,
  token: string,
) => {
  return new Promise((resolve, reject) => {
    console.log('mdify', organization);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `
        mutation Mutation($modifyOrganizationId: ID!, $organization: OrganizationModify) {
            modifyOrganization(id: $modifyOrganizationId, organization: $organization) {
              message
              organization {
                id
                organization_name
              }
            }
          }`,
        variables: {
          modifyOrganizationId: organization.id,
          organization: {organization_name: organization.organization_name},
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('mdify', response.body);
          const organization =
            response.body.data.modifyOrganization.organization;
          expect(organization).toHaveProperty('id');
          expect(organization).toHaveProperty('organization_name');
          resolve(response.body.data.modifyOrganization.organization);
        }
      });
  });
};

const deleteOrganization = (
  url: string | Application,
  organization: OrganizationTest,
  token: string,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `
            mutation Mutation($deleteOrganizationId: ID!) {
                deleteOrganization(id: $deleteOrganizationId) {
                  message
                }
              }`,
        variables: {
          deleteOrganizationId: organization.id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('delete', response.body);
          expect(response.body.data.deleteOrganization).toHaveProperty(
            'message',
          );
          resolve(response.body.data.deleteOrganization);
        }
      });
  });
};

const organizationById = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
        query Query($organizationById: ID!) {
            organizationById(id: $organizationById) {
              id
              organization_name
            }
          }`,
        variables: {
          organizationById: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('organizationById', response.body);
          const organization = response.body.data.organizationById;
          expect(organization).toHaveProperty('id');
          expect(organization).toHaveProperty('organization_name');
          resolve(response.body.data.organizationById);
        }
      });
  });
};

const organizationByName = (
  url: string | Application,
  organization_name: string,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
        query Query($organization_name: String!) {
            organizationByName(organization_name: $organization_name) {
              id
              organization_name
            }
          }`,
        variables: {
          organization_name: organization_name,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('organizationByName', response.body);
          const organization = response.body.data.organizationByName;
          expect(organization).toHaveProperty('id');
          expect(organization).toHaveProperty('organization_name');
          resolve(response.body.data.organizationByName);
        }
      });
  });
};

export {
  postOrganization,
  getAllOrganizations,
  modifyOrganization,
  deleteOrganization,
  organizationById,
  organizationByName,
};
