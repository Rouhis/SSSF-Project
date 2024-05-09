/**
 * This module provides resolvers for the `Query` type in a GraphQL schema.
 *
 * @module userResolver
 */
import {GraphQLError} from 'graphql';
import {User, UserOutput} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import * as Randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
/**
 * The resolvers for the `Query` type.
 *
 * @property {Object} Query - The resolver for the `Query` type.
 * @property {Function} Query.users - Returns all users.
 * @property {Function} Query.usersByOrganization - Returns all users belonging to a specific organization.
 * @property {Function} Query.userFromToken - Returns the user associated with the current authentication token.
 * @property {Function} Query.userById - Returns a user by its ID.
 * @property {Function} Query.checkToken - Checks if the token is valid.
 *
 * The resolvers for the `Mutation` type.
 * @property {Object} Mutation - The resolver for the `Mutation` type.
 * @property {Function} Mutation.registerTestUser - Registers a test user.
 * @property {Function} Mutation.registerEmployee - Registers an employee.
 * @property {Function} Mutation.registerFaciltyManager - Registers a facility manager.
 * @property {Function} Mutation.login - Logs in a user.
 * @property {Function} Mutation.updateUser - Updates the user.
 * @property {Function} Mutation.updateUserAsAdmin - Updates the user as an admin.
 * @property {Function} Mutation.deleteUser - Deletes the user.
 * @property {Function} Mutation.deleteUserAsAdmin - Deletes the user as an admin.
 */
export default {
  Query: {
    users: async (): Promise<UserOutput[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth server URL not found');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      return users.map((user) => {
        user.id = user._id;
        return user;
      });
    },
    usersByOrganization: async (
      _parent: undefined,
      args: {organization: string},
    ): Promise<UserOutput[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth server URL not found');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');

      // Filter users by organization
      const filteredUsers = users.filter(
        (user) => user.organization === args.organization,
      );

      return filteredUsers.map((user) => {
        user.id = user._id;
        return user;
      });
    },
    userFromToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ): Promise<UserOutput> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      console.log('context.userdata:', context.userdata.user);
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + context.userdata.user._id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.userdata.token}`,
          },
        },
      );
      console.log('user:', user);
      user.id = user._id;
      return user;
    },
    userById: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<UserOutput> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth server URL not found');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + args.id,
      );
      user.id = user._id;
      return user;
    },
    checkToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.userdata?.token) {
        throw new GraphQLError('No token provided');
      }
      try {
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT secret not defined');
        }
        jwt.verify(context.userdata.token, process.env.JWT_SECRET);
        const response = {
          message: 'Token is valid',
          user: context.userdata.user,
        };
        return response;
      } catch (error) {
        throw new GraphQLError('Token is invalid');
      }
    },
  },
  Mutation: {
    registerTestUser: async (
      _parent: undefined,
      args: {user: Partial<User>},
    ): Promise<{user: UserOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      args.user.role = 'manager';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };
      console.log('args.user:', args.user);
      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );
      console.log('registerResponse:', registerResponse);

      if (!registerResponse.data || !registerResponse.data._id) {
        throw new GraphQLError('User registration failed');
      }

      return {
        user: {...registerResponse.data, id: registerResponse.data._id},
        message: registerResponse.message,
      };
    },
    registerEmployee: async (
      _parent: undefined,
      args: {user: Partial<User>},
      context: MyContext,
    ): Promise<{user: UserOutput; message: string; password: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      if (
        context.userdata?.role !== 'admin' &&
        context.userdata?.role !== 'manager'
      ) {
        throw new GraphQLError('Only admins and managers can create employees');
      }
      const password = Randomstring.generate(10);
      console.log('Password for testing:', password);
      args.user.password = password;
      args.user.role = 'user';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };
      console.log('args.user:', args.user);
      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );
      console.log('registerResponse:', registerResponse);

      if (!registerResponse.data || !registerResponse.data._id) {
        throw new GraphQLError('User registration failed');
      }
      return {
        user: {...registerResponse.data, id: registerResponse.data._id},
        message: registerResponse.message,
        password: password,
      };
    },
    registerFaciltyManager: async (
      _parent: undefined,
      args: {user: User},
      context: MyContext,
    ): Promise<{user: UserOutput; message: string; password: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the user is an admin
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Only admins can create facility managers');
      }
      const password = Randomstring.generate(10);
      console.log('Password for testing:', password);
      args.user.password = password;
      args.user.role = 'manager';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.userdata?.token}`,
        },
        body: JSON.stringify(args.user),
      };

      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );

      if (!registerResponse.data || !registerResponse.data._id) {
        throw new GraphQLError('Facility manager registration failed');
      }

      return {
        user: {...registerResponse.data, id: registerResponse.data._id},
        message: registerResponse.message,
        password: password,
      };
    },
    login: async (
      _parent: undefined,
      args: {credentials: {username: string; password: string}},
    ): Promise<MessageResponse & {token: string; user: UserOutput}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      };

      const loginResponse = await fetchData<
        MessageResponse & {token: string; user: UserOutput}
      >(process.env.AUTH_URL + '/auth/login', options);

      loginResponse.user.id = loginResponse.user._id;
      console.log('loginResponse:', loginResponse);
      return loginResponse;
    },
    updateUser: async (
      _parent: undefined,
      args: {user: Omit<User, 'role' | 'password'>},
      context: MyContext,
    ): Promise<{user: UserOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the user is authenticated
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.userdata?.token}`,
        },
        body: JSON.stringify(args.user),
      };

      const updateResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users/' + context.userdata.user._id,
        options,
      );

      updateResponse.data.id = updateResponse.data._id;

      return {user: updateResponse.data, message: updateResponse.message};
    },
    updateUserAsAdmin: async (
      _parent: undefined,
      args: {id: string; user: Omit<User, 'role' | 'password'>},
      context: MyContext,
    ): Promise<{user: UserOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the user is an admin
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Only admins can update other users');
      }
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.userdata?.token}`,
        },
        body: JSON.stringify(args.user),
      };

      const updateResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users/' + args.id,
        options,
      );

      updateResponse.data.id = updateResponse.data._id;

      return {user: updateResponse.data, message: updateResponse.message};
    },
    deleteUser: async (
      _parent: undefined,
      _args: {id: string},
      context: MyContext,
    ): Promise<{message: string; user: Omit<User, 'role' | 'password'>}> => {
      console.log('do we get here');
      console.log('context:', _args.id);
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the user is authenticated
      // Check if the user is an admin
      if (context.userdata?.role !== 'manager') {
        throw new GraphQLError(
          'Only managers and admins can delete other users',
        );
      }
      if (!_args.id) {
        throw new GraphQLError('No user id provided');
      }

      // Fetch the user before deleting
      const userResponse = await fetchData<{data: User}>(
        process.env.AUTH_URL + '/users/' + _args.id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.userdata?.token}`,
          },
        },
      );
      console.log('userResponse:', userResponse);
      if (!userResponse) {
        throw new GraphQLError('User not found');
      }
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${context.userdata?.token}`,
        },
      };

      const deleteResponse = await fetchData<MessageResponse>(
        process.env.AUTH_URL + '/users/' + _args.id,
        options,
      );

      return {message: deleteResponse.message, user: userResponse.data};
    },
    deleteUserAsAdmin: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; user: Omit<User, 'role' | 'password'>}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Only admins can delete other users');
      }

      const userResponse = await fetchData<{data: User}>(
        process.env.AUTH_URL + '/users/' + args.id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.userdata?.token}`,
          },
        },
      );

      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${context.userdata?.token}`,
        },
      };

      const deleteResponse = await fetchData<MessageResponse>(
        process.env.AUTH_URL + '/users/' + args.id,
        options,
      );

      return {message: deleteResponse.message, user: userResponse.data};
    },
  },
};
