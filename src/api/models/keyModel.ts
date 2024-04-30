import mongoose from 'mongoose';
import {Key} from '../../types/DBTypes';

const keyModel = new mongoose.Schema<Key>({
  key_name: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  loaned: {
    type: Boolean,
    required: true,
  },
  loanedtime: {
    type: Date,
  },
  returnedtime: {
    type: Date,
  },
});

export default mongoose.model('Key', keyModel);
