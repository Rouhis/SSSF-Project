import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Key, User} from '../../types/DBTypes';
import keyModel from '../models/keyModel';
import fetchData from '../../functions/fetchData';
import {checkToken} from '../checkToken';
import organizationModel from '../models/organizationModel';
import branchModel from '../models/branchModel';

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
      console.log('keys', keys);
      const filteredKeys = keys.filter(
        (key) => key.branch.toString() === args.branch,
      );
      return filteredKeys.map((key) => {
        key.id = key._id;
        return key;
      });
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
      const keys = await keyModel.find({loaned: false});
      console.log('keys', keys);
      const filteredKeys = [];
      for (const key of keys) {
        const branch = await branchModel.findById(key.branch);
        console.log('branch whole', branch);
        console.log('organization', organization._id.toString());
        console.log('branch', branch?.organization.toString());
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
  },
  Mutation: {
    addKey: async (
      _parent: undefined,
      args: {key: Omit<Key, 'id'>},
      context: MyContext,
    ): Promise<{key: Key; message: string}> => {
      console.log('do we get here', args);
      if (
        context.userdata?.role !== 'manager' &&
        context.userdata?.role !== 'admin'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      const newKey = new keyModel(args.key);
      newKey.loaned = false;
      await newKey.save();
      return {message: 'Key added', key: newKey};
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
    deleteKey: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string}> => {
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Unauthorized');
      }
      await keyModel.findByIdAndDelete(args.id);
      return {message: 'Key deleted'};
    },
  },
};
