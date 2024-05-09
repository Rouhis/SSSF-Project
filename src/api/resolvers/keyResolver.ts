/**
 * This module provides resolvers for the `Query` and `Mutation` types in a GraphQL schema.
 *
 * @module keyResolver
 */
import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Key, User} from '../../types/DBTypes';
import keyModel from '../models/keyModel';
import fetchData from '../../functions/fetchData';
import {checkToken} from '../checkToken';
import organizationModel from '../models/organizationModel';
import branchModel from '../models/branchModel';
/**The resolvers for the `Query` type.
 * @property {Object} Query - The resolver for the `Query` type.
 * @property {Function} Query.keys - Returns all keys.
 * @property {Function} Query.keyById - Returns a key by its ID.
 * @property {Function} Query.keysByBranch - Returns all keys belonging to a branch.
 * @property {Function} Query.keysByOrganization - Returns all keys belonging to an organization.
 * @property {Function} Query.keysOut - Returns all keys that are currently loaned out.
 * @property {Function} Query.keysByUser - Returns all keys loaned by a user.
 * The resolvers for the `Mutation` type.
 *
 * @property {Object} Mutation - The resolver for the `Mutation` type.
 * @property {Function} Mutation.addKey - Adds a new key.
 * @property {Function} Mutation.loanKey - Loans a key to a user.
 * @property {Function} Mutation.modifyKey - Modifies an existing key.
 * @property {Function} Mutation.deleteKey - Deletes a key.
 */
export default {
  Query: {
    keys: async (): Promise<Key[]> => {
      return await keyModel.find();
    },
    keyById: async (_parent: undefined, args: {id: string}): Promise<Key> => {
      const key = await keyModel.findById(args.id);
      if (!key) {
        throw new GraphQLError('Key not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return key;
    },
    keysByBranch: async (
      _parent: undefined,
      args: {branch: string},
    ): Promise<Key[]> => {
      const keys = await keyModel.find();
      const filteredKeys = keys.filter(
        (key) => key.branch.toString() === args.branch,
      );
      return filteredKeys.map((key) => {
        key.id = key._id;
        return key;
      });
    },
    keysByOrganization: async (
      _parent: undefined,
      args: {token: string},
    ): Promise<Key[]> => {
      const userToken = checkToken(args.token);
      console.log('userToken', userToken);
      const organization = await organizationModel.findOne({
        organization_name: userToken.organization,
      });
      if (!organization) {
        throw new Error('Organization not found');
      }
      const keys = await keyModel.find();
      const filteredKeys = [];
      for (const key of keys) {
        const branch = await branchModel.findById(key.branch);
        if (
          branch &&
          branch.organization.toString() === organization._id.toString()
        ) {
          key.id = key._id;
          filteredKeys.push(key);
        }
      }
      console.log('filteredKeys', filteredKeys);
      return filteredKeys;
    },
    keysOut: async (
      _parent: undefined,
      args: {token: string},
    ): Promise<Key[]> => {
      const userToken = checkToken(args.token);
      const organization = await organizationModel.findOne({
        organization_name: userToken.organization,
      });
      if (!organization) {
        throw new Error('Organization not found');
      }
      const keys = await keyModel.find({loaned: true});
      const filteredKeys = [];
      for (const key of keys) {
        const branch = await branchModel.findById(key.branch);
        if (
          branch &&
          branch.organization.toString() === organization._id.toString()
        ) {
          key.id = key._id;
          filteredKeys.push(key);
        }
      }
      return filteredKeys;
    },
    keysByUser: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Key[]> => {
      const keys = await keyModel.find({user: args.id});
      return keys;
    },
  },
  Mutation: {
    addKey: async (
      _parent: undefined,
      args: {key: Omit<Key, 'id'>},
      context: MyContext,
    ): Promise<{key: Key; message: string}> => {
      try {
        console.log('do we get here', args);
        if (
          context.userdata?.role !== 'manager' &&
          context.userdata?.role !== 'admin'
        ) {
          throw new GraphQLError('Unauthorized');
        }
        const newKey = new keyModel(args.key);
        console.log('newKey', newKey);
        if (!newKey) {
          throw new GraphQLError('Failed to create key');
        }
        newKey.loaned = false;
        console.log('newKey2', newKey);
        await newKey.save();
        return {message: 'Key added', key: newKey};
      } catch (error) {
        console.error('Error in addKey mutation:', error);
        throw error;
      }
    },
    loanKey: async (
      _parent: undefined,
      args: {key: Key; id: string},
      context: MyContext,
    ): Promise<{key: Key; message: string}> => {
      if (!context.userdata?.role) {
        throw new GraphQLError('Unauthorized');
      }
      let updatedKey = await keyModel.findByIdAndUpdate(args.id, args.key, {
        new: true,
      });
      if (!updatedKey) {
        throw new GraphQLError('Key not found');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + context.userdata.user._id,
      );
      if (!user) {
        throw new GraphQLError('User not found');
      }
      updatedKey.user = user._id;

      if (updatedKey.loaned === false) {
        updatedKey.loanedtime = new Date();
        updatedKey.returnedtime = null;
      }
      if (updatedKey.loaned === true) {
        updatedKey.returnedtime = new Date();
        updatedKey.loanedtime = null;
      }
      updatedKey.loaned = !updatedKey.loaned;
      updatedKey = await updatedKey.save();
      return {message: 'Key modified', key: updatedKey};
    },
    modifyKey: async (
      _parent: undefined,
      args: {key: Key; id: string},
      context: MyContext,
    ): Promise<{key: Key; message: string}> => {
      if (
        context.userdata?.role !== 'manager' &&
        context.userdata?.role !== 'admin'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      console.log('args', args);
      const key = await keyModel.findById(args.id);
      if (!key) {
        throw new GraphQLError('Key not found');
      }
      key.key_name = args.key.key_name;
      key.loaned = args.key.loaned || false;
      await key.save();
      return {message: 'Key modified', key: key};
    },
    deleteKey: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string}> => {
      console.log('deleteKey', args);
      if (
        context.userdata?.role !== 'admin' &&
        context.userdata?.role !== 'manager'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      await keyModel.findByIdAndDelete(args.id);
      return {message: 'Key deleted'};
    },
  },
};
