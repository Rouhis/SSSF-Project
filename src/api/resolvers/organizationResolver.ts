/**
 * This module provides resolvers for the `Branch` and `Query` types in a GraphQL schema.
 *
 * @module organizationResolver
 */
import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Branch, Organization} from '../../types/DBTypes';
import organizationModel from '../models/organizationModel';
/**
 * The resolvers for the `Branch` and `Query` types.
 *
 * @property {Object} Branch - The resolver for the `Branch` type.
 * @property {Function} Branch.organization - Returns the organization associated with a branch.
 *
 * @property {Object} Query - The resolver for the `Query` type.
 * @property {Function} Query.organizations - Returns all organizations.
 * @property {Function} Query.organizationById - Returns an organization by its ID.
 * @property {Function} Query.organizationByName - Returns an organization by its name.
 *
 * The resolvers for mutations
 * @property {Object} Mutation - The resolver for the `Mutation` type.
 * @property {Function} Mutation.addOrganization - Adds a new organization.
 * @property {Function} Mutation.modifyOrganization - Modifies an existing organization.
 * @property {Function} Mutation.deleteOrganization - Deletes an organization.
 */
export default {
  Branch: {
    // Add this resolver for the Branch type
    organization: async (parent: Branch): Promise<Organization> => {
      // parent is the Branch object. We assume it has an organizationId field.
      const organization = await organizationModel.findById(
        parent.organization,
      );
      if (!organization) {
        throw new GraphQLError('Organization not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return organization;
    },
  },
  Query: {
    organizations: async (): Promise<Organization[]> => {
      return await organizationModel.find();
    },
    organizationById: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Organization> => {
      const organization = await organizationModel.findById(args.id);
      if (!organization) {
        throw new GraphQLError('Cat not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return organization;
    },
    organizationByName: async (
      _parent: undefined,
      args: {organization_name: string},
    ): Promise<Organization> => {
      const organization = await organizationModel.findOne({
        organization_name: args.organization_name,
      });
      if (!organization) {
        throw new GraphQLError('Organization not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return organization;
    },
  },
  Mutation: {
    addOrganization: async (
      _parent: undefined,
      args: {organization: Organization},
      context: MyContext,
    ): Promise<{organization: Organization; message: string}> => {
      console.log('do we get here', args);
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Unauthorized');
      }
      const newOrganization = new organizationModel(args.organization);
      await newOrganization.save();
      return {message: 'Organization added', organization: newOrganization};
    },
    modifyOrganization: async (
      _parent: undefined,
      args: {organization: Organization; id: string},
      context: MyContext,
    ): Promise<{organization: Organization; message: string}> => {
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Unauthorized');
      }
      console.log('args', args);
      const organization = await organizationModel.findById(args.id);
      if (!organization) {
        throw new GraphQLError('Organization not found');
      }
      organization.organization_name = args.organization.organization_name;
      await organization.save();
      return {message: 'Organization modified', organization: organization};
    },
    deleteOrganization: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string}> => {
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Unauthorized');
      }
      const organization = await organizationModel.findByIdAndDelete(args.id);
      if (organization) {
        return {message: 'Organization deleted'};
      } else {
        return {message: 'Organization not deleted'};
      }
    },
  },
};
