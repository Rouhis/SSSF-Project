import {Application} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import {KeyTest} from '../src/types/DBTypes';

const keys = (url: string | Application) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
            query Query {
                keys {
                id
                key_name
                branch {
                    id
                    branch_name
                    organization {
                    id
                    organization_name
                    }
                }
                }
            }
            `,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keys', response.body);
          expect(response.body.data.keys).toBeInstanceOf(Array);
          resolve(response.body.data.keys);
        }
      });
  });
};

const keyById = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Query($keyByIdId: ID!) {
            keyById(id: $keyByIdId) {
              id
              key_name
              user
              loaned
              loanedtime
              returnedtime
              loantime
              branch {
                id
                organization {
                  id
                  organization_name
                }
                branch_name
              }
            }
          }
                `,
        variables: {
          keyByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keyById', response.body);
          expect(response.body.data.keyById).toHaveProperty('id');
          resolve(response.body.data.keyById);
        }
      });
  });
};

const addKey = (url: string | Application, key: KeyTest, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($key: KeyInput) {
            addKey(key: $key) {
              message
              key {
                id
                key_name
                user
                loaned
                loanedtime
                returnedtime
                loantime
                branch {
                  id
                  branch_name
                  organization {
                    id
                    organization_name
                  }
                }
              }
            }
          }
                    `,
        variables: {
          key: {
            key_name: key.key_name,
            branch: key.branch,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('addKey', response.body);
          expect(response.body.data.addKey).toHaveProperty('key');
          expect(response.body.data.addKey).toHaveProperty('message');
          expect(response.body.data.addKey.key).toHaveProperty('id');
          expect(response.body.data.addKey.key).toHaveProperty('key_name');
          resolve(response.body.data.addKey.key);
        }
      });
  });
};

const loanKey = (url: string | Application, id: string, token: string) => {
  return new Promise((resolve, reject) => {
    const loanTime = new Date();
    loanTime.setHours(loanTime.getHours() + 5);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($loanKeyId: ID!, $key: LoanKey) {
            loanKey(id: $loanKeyId, key: $key) {
              message
              key {
                id
                key_name
                user
                loaned
                loanedtime
                returnedtime
                loantime
              }
            }
          }
            `,
        variables: {
          loanKeyId: id,
          key: {
            loantime: loanTime,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('loanKey id', id);
          console.log('loanKey', response.body.data.loanKey);
          expect(response.body.data.loanKey).toHaveProperty('key');
          expect(response.body.data.loanKey).toHaveProperty('message');
          expect(response.body.data.loanKey.key).toHaveProperty('id');
          expect(response.body.data.loanKey.key).toHaveProperty('key_name');
          resolve(response.body.data.loanKey.key);
        }
      });
  });
};

const keysByUser = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Query($user: ID!) {
            keysByUser(user: $user) {
              id
              key_name
              user
              loaned
              loanedtime
              returnedtime
              loantime
              branch {
                id
                branch_name
              }
            }
          }
                `,
        variables: {
          user: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keysByUser', response.body);
          expect(response.body.data.keysByUser).toBeInstanceOf(Array);
          resolve(response.body.data.keysByUser);
        }
      });
  });
};

const keysOut = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query KeysOut($token: String!) {
            keysOut(token: $token) {
              id
              key_name
              user
              loaned
              loanedtime
              returnedtime
              loantime
            }
          }
                    `,
        variables: {
          token: token,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keysOut', response.body);
          expect(response.body.data.keysOut).toBeInstanceOf(Array);
          resolve(response.body.data.keysOut);
        }
      });
  });
};
const keysByOrganization = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query KeysByOrganization($token: String!) {
            keysByOrganization(token: $token) {
              id
              key_name
              user
              loanedtime
              loaned
              returnedtime
              loantime
              branch {
                id
                branch_name
              }
            }
          }
                    `,
        variables: {
          token: token,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keysByOrganization', response.body);
          expect(response.body.data.keysByOrganization).toBeInstanceOf(Array);
          resolve(response.body.data.keysByOrganization);
        }
      });
  });
};

const keysByBranch = (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Query($branch: ID!) {
                keysByBranch(branch: $branch) {
                id
                key_name
                user
                loaned
                loanedtime
                returnedtime
                loantime
                branch {
                    id
                    branch_name
                }
                }
            }
                    `,
        variables: {
          branch: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('keysByBranch', response.body);
          expect(response.body.data.keysByBranch).toBeInstanceOf(Array);
          resolve(response.body.data.keysByBranch);
        }
      });
  });
};

const modifyKey = (url: string | Application, key: KeyTest, token: string) => {
  return new Promise((resolve, reject) => {
    const newKeyName = key.key_name + 'new';
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($modifyKeyId: ID!, $key: KeyModify) {
            modifyKey(id: $modifyKeyId, key: $key) {
              message
              key {
                id
                key_name
                loaned
                branch {
                  id
                  branch_name
                }
              }
            }
          }
                        `,
        variables: {
          modifyKeyId: key,
          key: {
            key_name: newKeyName,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('modifyKey', response.body);
          expect(response.body.data.modifyKey).toHaveProperty('key');
          expect(response.body.data.modifyKey).toHaveProperty('message');
          expect(response.body.data.modifyKey.key).toHaveProperty('id');
          expect(response.body.data.modifyKey.key).toHaveProperty('key_name');
          resolve(response.body.data.modifyKey.key);
        }
      });
  });
};

const deleteKey = (url: string | Application, id: string, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($deleteKeyId: ID!) {
                deleteKey(id: $deleteKeyId) {
                message
                }
            }
                        `,
        variables: {
          deleteKeyId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('deleteKey', response.body);
          expect(response.body.data.deleteKey).toHaveProperty('message');
          resolve(response.body.data.deleteKey);
        }
      });
  });
};
export {
  keys,
  keyById,
  addKey,
  loanKey,
  keysByUser,
  keysOut,
  keysByOrganization,
  keysByBranch,
  modifyKey,
  deleteKey,
};
