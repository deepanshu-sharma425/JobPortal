import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import JobDetail from '../components/JobDetail';
import { Search, Filter, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { API_URL } from '../config/apiConfig';

const EmployeeDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [pagination.page, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.location && { location: filters.location })
      };

      const response = await axios.get(`${API_URL}/jobs`, { params });
      setJobs(response.data.jobs);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs/saved/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(new Set(response.data.map(job => job.id)));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleJobClick = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedJob(response.data);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (savedJobs.has(jobId)) {
        await axios.delete(`${API_URL}/jobs/${jobId}/save`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await axios.post(`${API_URL}/jobs/${jobId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0F13]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Explore Jobs</h1>
          <p className="text-gray-400">Find your next opportunity</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              icon={Search}
            />
            <Select
              options={typeOptions}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            />
            <Input
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-cyan-400 text-xl">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </Card>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <AnimatePresence>
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      hover
                      onClick={() => handleJobClick(job)}
                      className="h-full flex flex-col cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white flex-1">{job.title}</h3>
                          <button
                            onClick={(e) => handleSaveJob(job.id, e)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {savedJobs.has(job.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-cyan-400" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
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
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <Button variant="primary" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex gap-2">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={pagination.page === page ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                      return <span key={page} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedJob(null);
        }}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <JobDetail
            job={selectedJob}
            isSaved={savedJobs.has(selectedJob.id)}
            onSave={() => handleSaveJob(selectedJob.id, { stopPropagation: () => {} })}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedJob(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;

