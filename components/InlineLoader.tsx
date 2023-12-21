import { InfinitySpin } from "react-loader-spinner";

const InlineLoader = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <InfinitySpin width="140" color="#3b82f6" />
    </div>
  );
};

export default InlineLoader;
