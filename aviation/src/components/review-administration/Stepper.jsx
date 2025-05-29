import { motion } from 'framer-motion';
import StepItem from './StepItem';

function Stepper({ steps, activeStep, onStepClick }) {
  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <div key={index} className="flex items-center flex-1 relative">
              {/* Step circle and title */}
              <div className="flex flex-col items-center z-2">
                <StepItem
                  number={step.number}
                  title={step.title}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onClick={() => onStepClick(index)}
                />
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-13 w-full h-px">
                  <div className="w-full h-full bg-neutral-300 relative">
                    {isCompleted && (
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-primary-300"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;
