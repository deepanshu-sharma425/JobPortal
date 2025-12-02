import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Zap, Sparkles } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F13] relative">

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              CareerLink
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </Motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32"
      >
        <Motion.div variants={itemVariants} className="text-center">
          <Motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-cyan-400" />
          </Motion.div>
          
          <Motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">Find Your Dream Job</span>
            <br />
            <span className="text-white">Or Post One</span>
          </Motion.h1>

          <Motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Connect talented professionals with amazing opportunities. 
            Built for the future of work.
          </Motion.p>

          <Motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </Motion.div>
        </Motion.div>

        {/* Features Grid */}
        <Motion.div
          variants={containerVariants}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Briefcase,
              title: 'For Job Seekers',
              description: 'Browse thousands of opportunities, save favorites, and apply with one click.'
            },
            {
              icon: Users,
              title: 'For Employers',
              description: 'Post jobs, manage applications, and find the perfect candidate for your team.'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Modern, responsive design with smooth animations and instant updates.'
            }
          ].map((feature, index) => (
            <Motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="inline-flex p-4 rounded-xl bg-black/40 mb-4">
                <feature.icon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Landing;
