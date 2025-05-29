import { motion } from 'framer-motion';

function StepItem({ number, title, isActive, isCompleted, onClick }) {
  // Determine color classes based on step number and status
  const getStepColor = () => {
    if (isActive) return 'bg-blue-700 text-white';
    if (isCompleted) return 'bg-blue-400 text-primary-700';
    if (number === 2) return 'bg-amber-400 text-white';
    if (number === 3) return 'bg-green-500 text-white';
    return 'bg-blue-400 text-white';
  };

  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
      <motion.div
        className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold ${getStepColor()}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {number}
      </motion.div>
      <span
        className={`mt-2 text-center text-sm md:text-base font-medium
          ${isActive ? 'text-black' : 'text-neutral-700 group-hover:text-black'}
          transition-colors duration-250`}
      >
        {title}
      </span>
    </div>
  );
}

export default StepItem;
