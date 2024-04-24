import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {Organization} from '../../types/DBTypes';
import organizationModel from '../models/organizationModel';

export default {
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
  },
};
