import mongoose, {Document, Types} from 'mongoose';

type User = Partial<Document> & {
  user_name: string;
  email: string;
  organization: string;
  role: 'user' | 'admin' | 'manager';
  password: string;
};

type UserOutput = Omit<User, 'password'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserTest = Partial<User>;

type BranchTest = Partial<Branch>;

type LoginUser = Omit<User, 'password'>;

type OrganizationTest = Partial<Organization>;

type OrganizationOutPut = Partial<Organization>;

type TokenContent = {
  role: string;
  token: string;
  user: LoginUser;
  organization: string;
};

type Organization = {
  id?: Types.ObjectId | string;
  organization_name: string;
};

type Branch = Partial<Document> & {
  branch_name: string;
  organization: mongoose.Types.ObjectId;
};

type Key = Partial<Document> & {
  key_name: string;
  branch: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  loaned: boolean;
  loanedtime: Date | null;
  returnedtime: Date | null;
  loantime: Date | null;
};

export {
  User,
  UserOutput,
  UserInput,
  UserTest,
  LoginUser,
  TokenContent,
  Organization,
  OrganizationTest,
  OrganizationOutPut,
  Branch,
  BranchTest,
  Key,
};
