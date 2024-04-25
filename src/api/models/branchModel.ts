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
