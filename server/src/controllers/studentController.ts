import { Request, Response } from 'express';
import Student from '../models/Student';
import { serverEncrypt, serverDecrypt } from '../utils/crypto';

/**
 * Helper to parse server-decrypted JSON safely
 */
function safeParse(jsonStr: string) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Register a student
 * - Accepts encrypted field-by-field data
 * - Server encrypts entire payload again before saving (double encryption)
 */
export const registerStudent = async (req: Request, res: Response) => {
  try {
    // The incoming data is already field-by-field encrypted from frontend
    const encryptedFields = { ...req.body };
    delete encryptedFields._id; // remove accidental ID
    
    // Server encrypts the entire encrypted fields object again
    const payloadStr = JSON.stringify(encryptedFields);
    const wrapped = serverEncrypt(payloadStr);
    
    const student = new Student({ encryptedData: wrapped });
    await student.save();

    res.json({ id: student._id, message: 'Student registered successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Login student
 * - Server decrypts payload and compares email/password
 */
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const students = await Student.find().sort({ createdAt: -1 }).limit(1000);

    for (const s of students) {
      try {
        // First decrypt server-layer encryption
        const serverDecrypted = serverDecrypt(s.encryptedData);
        const encryptedFields = safeParse(serverDecrypted);
        
        if (encryptedFields) {
          // The fields are still encrypted with client key at this point
          // For login, we need to compare the encrypted values
          // Since we can't decrypt client-side encryption on server, we'll compare the encrypted versions
          const encryptedEmail = encryptField(email); // We need a helper to encrypt on server for comparison
          const encryptedPassword = encryptField(password);
          
          if (encryptedFields.email === encryptedEmail && encryptedFields.password === encryptedPassword) {
            return res.json({ message: 'Login successful', id: s._id });
          }
        }
      } catch {
        continue;
      }
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Get all students
 * - Decrypt server-layer encryption
 * - Return field-by-field encrypted data to frontend (frontend will decrypt each field)
 */
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).limit(100);
    const result = students.map(s => {
      try {
        // Decrypt server-layer encryption
        const serverDecrypted = serverDecrypt(s.encryptedData);
        const encryptedFields = safeParse(serverDecrypted);
        
        // Return the field-by-field encrypted data + ID
        // Frontend will decrypt each field individually
        return { id: s._id, ...encryptedFields };
      } catch {
        return { id: s._id, error: 'decrypt_failed' };
      }
    });
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Update a student
 * - Accepts field-by-field encrypted data
 * - Server encrypts again before saving
 */
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const encryptedFields = { ...req.body };
    delete encryptedFields._id;

    // Server encrypts the entire encrypted fields object again
    const payloadStr = JSON.stringify(encryptedFields);
    const wrapped = serverEncrypt(payloadStr);

    const updated = await Student.findByIdAndUpdate(id, { encryptedData: wrapped }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Student not found' });

    res.json({ id: updated._id, message: 'Student updated successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Delete a student
 */
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removed = await Student.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Student not found' });

    res.json({ id: removed._id, message: 'Student deleted successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

