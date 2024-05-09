/**
 * Mongoose schema for a Key document.
 *
 * @typedef Key
 * @property {string} key_name - The name of the key. Required.
 * @property {mongoose.Schema.Types.ObjectId} branch - Reference to the branch the key belongs to.
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the user who has the key (if loaned).
 * @property {boolean} loaned - Indicates if the key is currently loaned out. Required.
 * @property {Date} loanedtime - Date and time the key was loaned (if loaned).
 * @property {Date} returnedtime - Date and time the key was returned (if returned).
 * @property {Date} loantime - (Potentially deprecated) Date and time the key was loaned (might be replaced by loanedtime).
 */
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
  loantime: {
    type: Date,
  },
});

export default mongoose.model('Key', keyModel);
