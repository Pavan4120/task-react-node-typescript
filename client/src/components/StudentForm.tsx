import React, { useState } from 'react';
import axios from 'axios';
import { Save, Loader, User, Mail, Phone, Calendar, MapPin, Book, Key } from 'lucide-react';
import { encryptObject } from '../utils/crypto';

const initial = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  course: '',
  password: ''
};

export default function StudentForm({ apiBase }: { apiBase: string }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  function setField(k: string, v: any) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      setMessage('Name and email are required');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Encrypt each field individually before sending
      const encryptedData = encryptObject(form);
      
      await axios.post(apiBase + '/register', encryptedData);
      setMessage('Student registered successfully!');
      setMessageType('success');
      setForm(initial);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'An error occurred');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="row g-3">
        {/* Full Name */}
        <div className="col-md-6">
          <label className="form-label">
            <User className="me-1" /> Full Name *
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter full name"
            value={form.fullName}
            onChange={e => setField('fullName', e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">
            <Mail className="me-1" /> Email *
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="student@example.com"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            required
          />
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label">
            <Phone className="me-1" /> Phone
          </label>
          <input
            type="tel"
            className="form-control"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
          />
        </div>

        {/* Date of Birth */}
        <div className="col-md-6">
          <label className="form-label">
            <Calendar className="me-1" /> Date of Birth
          </label>
          <input
            type="date"
            className="form-control"
            value={form.dob}
            onChange={e => setField('dob', e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            value={form.gender}
            onChange={e => setField('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Course */}
        <div className="col-md-6">
          <label className="form-label">
            <Book className="me-1" /> Course
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Computer Science"
            value={form.course}
            onChange={e => setField('course', e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="col-12">
          <label className="form-label">
            <MapPin className="me-1" /> Address
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter full address"
            value={form.address}
            onChange={e => setField('address', e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="col-12">
          <label className="form-label">
            <Key className="me-1" /> Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Create a secure password"
            value={form.password}
            onChange={e => setField('password', e.target.value)}
          />
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
        {isLoading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" />
        ) : (
          <Save className="me-1" />
        )}
        {isLoading ? 'Registering...' : 'Register Student'}
      </button>

      {/* Message */}
      {message && (
        <div className={`alert mt-3 ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
    </form>
  );
}