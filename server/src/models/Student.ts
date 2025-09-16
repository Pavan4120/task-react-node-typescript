import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  encryptedData: string; // server-encrypted blob (which itself contains client-encrypted payload)
  createdAt: Date;
}

const StudentSchema: Schema = new Schema({
  encryptedData: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
