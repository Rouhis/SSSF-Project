/**
 * This module provides resolvers for the `Key`,`Query` and `Mutation `types in a GraphQL schema.
 *
 * @module branchResolver
 */
import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Branch, Key} from '../../types/DBTypes';
import branchModel from '../models/branchModel';
import keyModel from '../models/keyModel';
/**
 * Resolvers for branch queries and mutations.
 *
 * @property {Object} Key - The resolver for the `Key` type.
 * @property {Function} Key.branch - Returns the branch associated with a key.
 *
 * Queries
 * @property {Object} Query - The resolver for the `Query` type.
 * @property {Function} Query.branches - Returns all branches.
 * @property {Function} Query.branchById - Returns a branch by its ID.
 * @property {Function} Query.branchByName - Returns a branch by its name.
 * @property {Function} Query.branchesByOrganization - Returns all branches belonging to an organization.
 *
 * Mutations
 * @property {Function} Mutation.addBranch - Adds a new branch.
 * @property {Function} Mutation.modifyBranch - Modifies an existing branch.
 * @property {Function} Mutation.deleteBranch - Deletes a branch.
 *
 */
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
    branchByName: async (
      _parent: undefined,
      args: {branch_name: string},
    ): Promise<Branch> => {
      const branch = await branchModel.findOne({
        branch_name: args.branch_name,
      });
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
      console.log('args', args.organization);
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
      if (!args.branch) {
        throw new GraphQLError('No branch data provided');
      }
      const newBranch = new branchModel(args.branch);
      if (!newBranch) {
        throw new GraphQLError('Failed to create branch');
      }
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
      if (!args.branch || !args.id) {
        throw new GraphQLError('No branch data or id provided');
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
      const branch = await branchModel.findByIdAndDelete(args.id);
      if (branch) {
        await keyModel.deleteMany({branch: args.id});
        return {message: 'Branch deleted'};
      } else {
        return {message: 'Branch not deleted'};
      }
    },
  },
};
