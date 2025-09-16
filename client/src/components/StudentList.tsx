import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, Trash2, Edit3, User, Mail, Book, AlertCircle, RefreshCw, Phone } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function StudentList({ apiBase }: { apiBase: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    course: ''
  });

  async function load() {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.get(apiBase + '/students');
      setItems(res.data);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(apiBase + '/student/' + id);
      setMessage('Student deleted successfully');
      load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'Failed to delete student');
    }
  }

  function openEditModal(student: any) {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName || '',
      email: student.email || '',
      phone: student.phone || '',
      dob: student.dob || '',
      gender: student.gender || '',
      address: student.address || '',
      course: student.course || ''
    });
    setShowModal(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function saveChanges() {
    try {
      await axios.put(apiBase + '/student/' + editingStudent.id, formData);
      setMessage('Student updated successfully');
      setShowModal(false);
      load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'Failed to update student');
    }
  }

  const filteredItems = items.filter(item =>
    item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
        <h5>Registered Students</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => { setIsRefreshing(true); load(); }}
            className="btn btn-outline-secondary"
            disabled={isRefreshing}
            title="Refresh"
          >
            {isRefreshing ? <span className="spinner-border spinner-border-sm" /> : <RefreshCw />}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
          <AlertCircle className="me-2" /> {message}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-5 border rounded bg-light">
          <User className="mb-3 text-secondary" size={48} />
          <p className="mb-0">No students found</p>
          {searchTerm && <small className="text-muted">Try adjusting your search terms</small>}
        </div>
      )}

      {/* Table */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Course</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{width: 40, height: 40}}>
                        <User size={20} />
                      </div>
                      <div>
                        <div className="fw-semibold">{item.fullName}</div>
                        {item.gender && <small className="text-muted">{item.gender}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex align-items-center gap-1">
                        <Mail size={16} className="text-muted" /> {item.email}
                      </div>
                      {item.phone && (
                        <div className="d-flex align-items-center gap-1">
                          <Phone size={16} className="text-muted" /> {item.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {item.course ? (
                      <div className="d-flex align-items-center gap-1">
                        <Book size={16} className="text-muted" /> {item.course}
                      </div>
                    ) : <span className="text-muted">Not specified</span>}
                  </td>
                  <td className="text-end">
                    <button onClick={() => openEditModal(item)} className="btn btn-sm btn-outline-primary me-1" title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => remove(item.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Count */}
      {filteredItems.length > 0 && (
        <div className="small text-muted mt-2">
          Showing {filteredItems.length} of {items.length} students{searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Course</Form.Label>
              <Form.Control name="course" value={formData.course} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
