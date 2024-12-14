import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className="animate-spin h-12 w-12 " />
    </div>
  );
};

export default LoadingScreen;
