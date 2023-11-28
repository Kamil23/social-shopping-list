import { motion, AnimatePresence } from "framer-motion";

const ProgressBar = ({ allItemsCount, itemsCheckedCount }) => {
  const progressWithPercentage =
    ((itemsCheckedCount / allItemsCount) * 100).toFixed(0) + "%";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 100 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col justify-center items-center fixed bottom-0 z-10 px-5 py-6 bg-[#EFF7FF] border-t border-[#E4F2FF]"
      >
        <div className="text-[#000F1D] text-sm font-anek-latin mb-5">
          Umieściłeś w koszyku już{" "}
          <span className="font-semibold text-primary-blue">
            {itemsCheckedCount} z {allItemsCount}
          </span>{" "}
          produktów z listy!
        </div>
        <div className="h-1 w-full bg-[#E2E7EC] rounded relative mb-2">
          <div
            style={{ width: progressWithPercentage }}
            className={`h-1 absolute top-0 bg-primary-blue rounded transition-all duration-500 ease-in-out`}
          />
        </div>
        <div className="text-sm font-anek-latin font-semibold text-primary-blue">
          {progressWithPercentage}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgressBar;
