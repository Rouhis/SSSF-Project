import mongoose from 'mongoose';
import {Organization} from '../../types/DBTypes';

const organizationModel = new mongoose.Schema<Organization>({
  organization_name: {
    type: String,
    required: true,
    unique: true,
  },
});
export default mongoose.model('Organization', organizationModel);
