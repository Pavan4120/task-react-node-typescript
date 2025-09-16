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
 * - Accepts raw JSON fields in body
 * - Server encrypts entire payload before saving
 */
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const bodyCopy = { ...req.body };
    delete bodyCopy._id; // remove accidental ID
    const payloadStr = JSON.stringify(bodyCopy);

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
        const decrypted = serverDecrypt(s.encryptedData);
        const data = safeParse(decrypted);
        if (data && data.email === email && data.password === password) {
          return res.json({ message: 'Login successful', id: s._id });
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
 * - Decrypt server-layer
 * - Return as JSON (no client encryption)
 */
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).limit(100);
    const result = students.map(s => {
      try {
        const decrypted = serverDecrypt(s.encryptedData);
        const data = safeParse(decrypted);
        return { id: s._id, ...data };
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
 * - Accepts raw JSON fields
 * - Server encrypts before saving
 */
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bodyCopy = { ...req.body };
    delete bodyCopy._id;

    const payloadStr = JSON.stringify(bodyCopy);
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
