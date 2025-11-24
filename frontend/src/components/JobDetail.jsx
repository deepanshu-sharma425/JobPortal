import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import Textarea from './Textarea';
import { MapPin, Briefcase, DollarSign, Bookmark, BookmarkCheck, Send } from 'lucide-react';
import { API_URL } from '../context/AuthContext';

const JobDetail = ({ job, isSaved, onSave, onClose }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/jobs/${job.id}/apply`,
        { coverLetter },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setApplied(true);
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{job.title}</h2>
            <p className="text-2xl text-cyan-400 mb-4">{job.company}</p>
          </div>
          <button
            onClick={onSave}
            className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-6 h-6 text-cyan-400" />
            ) : (
              <Bookmark className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 glass rounded-xl p-4">
            <MapPin className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">Location</div>
              <div className="text-white font-semibold">{job.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 glass rounded-xl p-4">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs text-gray-400">Type</div>
              <div className="text-white font-semibold capitalize">{job.type}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 glass rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-xs text-gray-400">Salary</div>
              <div className="text-white font-semibold">{job.salary}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Description</h3>
        <div className="glass rounded-xl p-6">
          <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {job.requirements && (
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Requirements</h3>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-300 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        </div>
      )}

      {!applied ? (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Apply for this position</h3>
          <Textarea
            label="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're a great fit for this role..."
            rows={6}
            className="mb-4"
          />
          <div className="flex gap-4">
            <Button
              variant="primary"
              onClick={handleApply}
              loading={applying}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-green-400 text-xl font-semibold mb-2">Application Submitted!</div>
          <p className="text-gray-400 mb-4">Your application has been sent successfully.</p>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

