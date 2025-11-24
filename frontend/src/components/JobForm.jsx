import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import { API_URL } from '../context/AuthContext';

const JobForm = ({ job, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        type: job.type || 'full-time',
        salary: job.salary || '',
        description: job.description || '',
        requirements: job.requirements || ''
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = job ? `${API_URL}/jobs/${job.id}` : `${API_URL}/jobs`;
      const method = job ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const typeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior Software Engineer"
          required
        />
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. San Francisco, CA"
          required
        />
        <Select
          label="Job Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
          required
        />
      </div>

      <Input
        label="Salary"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="e.g. $100,000 - $150,000"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the job role, responsibilities, and what you're looking for..."
        rows={6}
        required
      />

      <Textarea
        label="Requirements"
        name="requirements"
        value={formData.requirements}
        onChange={handleChange}
        placeholder="List the required skills, experience, and qualifications..."
        rows={4}
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          loading={loading}
        >
          {job ? 'Update Job' : 'Create Job'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobForm;

