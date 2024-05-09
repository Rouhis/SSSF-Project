/**
 * Mongoose schema for a Branch document.
 *
 * @typedef Branch
 * @property {string} branch_name - The name of the branch. Required.
 * @property {mongoose.Schema.Types.ObjectId} organization - Reference to the organization the branch belongs to.
 */
import mongoose from 'mongoose';
import {Branch} from '../../types/DBTypes';

const branchModel = new mongoose.Schema<Branch>({
  branch_name: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
});

export default mongoose.model('Branch', branchModel);
