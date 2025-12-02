import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import JobForm from '../components/JobForm';
import { Plus, Edit2, Trash2, Briefcase, Users } from 'lucide-react';
import { API_URL } from '../config/apiConfig';
const PosterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsJob, setApplicationsJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs/posted/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJob(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const openApplications = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/jobs/${job.id}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
      setApplicationsJob(job);
      setIsApplicationsOpen(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/applications/${applicationId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status } : a));
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingJob(null);
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0F13] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F13]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Job Posts</h1>
              <p className="text-gray-400">Manage your job listings</p>
            </div>
            <Button onClick={handleCreate} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Job
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <Briefcase className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{jobs.length}</div>
              <div className="text-gray-400 text-sm">Total Jobs</div>
            </Card>
            <Card className="text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Applications</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-white">
                {jobs.filter(job => new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-gray-400 text-sm">This Week</div>
            </Card>
          </div>
        </Motion.div>

        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Create your first job posting to get started</p>
            <Button onClick={handleCreate}>Create Your First Job</Button>
          </Card>
        ) : (
          <Motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs.map((job) => (
              <Motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <p className="text-cyan-400 mb-2">{job.company}</p>
                    <p className="text-gray-400 text-sm mb-4">{job.location}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs">
                        {job.salary}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3">{job.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => openApplications(job)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Applications
                    </Button>
                  </div>
                  {job.applicationCount > 0 && (
                    <div className="mt-2 text-sm text-cyan-400">
                      {job.applicationCount} application{job.applicationCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </Card>
              </Motion.div>
            ))}
          </Motion.div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? 'Edit Job' : 'Create New Job'}
        size="lg"
      >
        <JobForm
          job={editingJob}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setEditingJob(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isApplicationsOpen}
        onClose={() => {
          setIsApplicationsOpen(false);
          setApplicationsJob(null);
          setApplications([]);
        }}
        title={applicationsJob ? `Applications - ${applicationsJob.title}` : 'Applications'}
        size="lg"
      >
        {applications.length === 0 ? (
          <div className="text-gray-400">No applications yet</div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">{app.applicant?.name}</div>
                  <div className="text-gray-400 text-sm">{app.applicant?.email}</div>
                  <div className="text-gray-500 text-sm mt-2 whitespace-pre-wrap">{app.coverLetter}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-xs mr-2">{app.status}</span>
                  <Button size="sm" variant="primary" onClick={() => updateApplicationStatus(app.id, 'accepted')}>Accept</Button>
                  <Button size="sm" variant="danger" onClick={() => updateApplicationStatus(app.id, 'rejected')}>Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PosterDashboard;
