/**
 * Mongoose schema for an Organization document.
 *
 * @typedef Organization
 * @property {string} organization_name - The name of the organization. Required and unique.
 */
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
