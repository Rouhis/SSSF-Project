import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Branch, Key} from '../../types/DBTypes';
import branchModel from '../models/branchModel';
export default {
  Key: {
    branch: async (parent: Key): Promise<Branch> => {
      const branch = await branchModel.findById(parent.branch);
      if (!branch) {
        throw new GraphQLError('Branch not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return branch;
    },
  },
  Query: {
    branches: async (): Promise<Branch[]> => {
      return await branchModel.find();
    },
    branchById: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Branch> => {
      const branch = await branchModel.findById(args.id);
      if (!branch) {
        throw new GraphQLError('Branch not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return branch;
    },
    branchesByOrganization: async (
      _parent: undefined,
      args: {organization: string},
    ): Promise<Branch[]> => {
      const branches = await branchModel.find();
      console.log('branches', branches);
      console.log('args', args.organization);
      console.log('branches', branches);
      const filteredBranches = branches.filter(
        (branch) => branch.organization.toString() === args.organization,
      );
      console.log('filteredBranches', filteredBranches);
      return filteredBranches.map((branch) => {
        branch.id = branch._id;
        return branch;
      });
    },
  },
  Mutation: {
    addBranch: async (
      _parent: undefined,
      args: {branch: Omit<Branch, 'id'>},
      context: MyContext,
    ): Promise<{branch: Branch; message: string}> => {
      console.log('do we get here', args);
      if (
        context.userdata?.role !== 'manager' &&
        context.userdata?.role !== 'admin'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      const newBranch = new branchModel(args.branch);
      await newBranch.save();
      return {message: 'Branch added', branch: newBranch};
    },
    modifyBranch: async (
      _parent: undefined,
      args: {branch: Branch; id: string},
      context: MyContext,
    ): Promise<{branch: Branch; message: string}> => {
      if (
        context.userdata?.role !== 'manager' &&
        context.userdata?.role !== 'admin'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      console.log('args', args);
      const branch = await branchModel.findById(args.id);
      if (!branch) {
        throw new GraphQLError('Branch not found');
      }
      branch.branch_name = args.branch.branch_name;
      branch.organization = args.branch.organization;
      await branch.save();
      return {message: 'Branch modified', branch: branch};
    },
    deleteBranch: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string}> => {
      if (
        context.userdata?.role !== 'manager' &&
        context.userdata?.role !== 'admin'
      ) {
        throw new GraphQLError('Unauthorized');
      }
      await branchModel.findByIdAndDelete(args.id);
      return {message: 'Branch deleted'};
    },
  },
};
