import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import { API_URL } from '../config/apiConfig';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openEdit = (app) => {
    setEditing(app);
    setCoverLetter(app.coverLetter || '');
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/applications/${editing.id}`,
        { coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) => prev.map((a) => a.id === editing.id ? { ...a, coverLetter } : a));
      setEditing(null);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    }
  };

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F13]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Applications</h1>
        {loading ? (
          <div className="text-cyan-400">Loading...</div>
        ) : applications.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400">No applications yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="flex justify-between items-start">
                <div>
                  <div className="text-white font-semibold">{app.job?.title}</div>
                  <div className="text-cyan-400">{app.job?.company}</div>
                  <div className="text-gray-400 text-sm">Status: {app.status}</div>
                  <div className="text-gray-500 text-sm mt-2 whitespace-pre-wrap">{app.coverLetter}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(app)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => withdraw(app.id)}>Withdraw</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit Application - ${editing.job?.title}` : 'Edit Application'}
        size="md"
      >
        <Textarea
          label="Cover Letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={8}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={saveEdit}>Save</Button>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
