import { motion as Motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  return (
    <Motion.div
      className={`glass rounded-2xl p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Motion.div>
  );
};

export default Card;
