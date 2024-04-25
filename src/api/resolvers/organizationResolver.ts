import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Branch, Organization} from '../../types/DBTypes';
import organizationModel from '../models/organizationModel';

export default {
  Branch: {
    // Add this resolver for the Branch type
    organization: async (parent: Branch): Promise<Organization> => {
      console.log('parent', parent);
      // parent is the Branch object. We assume it has an organizationId field.
      const organization = await organizationModel.findById(
        parent.organization,
      );
      console.log('organization', organization);
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
      console.log('organization', organization);
      if (!organization) {
        throw new GraphQLError('Cat not found', {
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
