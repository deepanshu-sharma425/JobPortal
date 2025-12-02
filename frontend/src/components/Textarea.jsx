import { motion as Motion } from 'framer-motion';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <Motion.textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 glass rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 bg-white/5 text-white placeholder-gray-500 resize-none ${className}`}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      {error && (
        <Motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </Motion.p>
      )}
    </div>
  );
};

export default Textarea;
