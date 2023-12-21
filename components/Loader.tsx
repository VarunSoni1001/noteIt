import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-neutral-900">
      <InfinitySpin width="200" color="#3b82f6" />
    </div>
  );
};

export default Loader;
