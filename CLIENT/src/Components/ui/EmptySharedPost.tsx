import React from "react";
import { Camera } from "lucide-react"; 

interface EmptySharedPostProps {
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
}

const EmptySharedPost: React.FC<EmptySharedPostProps> = ({
  title = "Share Photos",
  description = "When you share photos, they will appear on your profile.",
  actionText = "Share your first photo",
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-200 py-10">
      {/* Circle Icon */}
      <div className="w-20 h-20 flex items-center justify-center border border-gray-400 rounded-full mb-6">
        <Camera size={36} className="text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>

      {/* Description */}
      <p className="text-gray-400 mb-3">{description}</p>

      {/* Action link */}
      <button
        onClick={onActionClick}
        className="text-blue-500 font-medium hover:underline"
      >
        {actionText}
      </button>
    </div>
  );
};

export default EmptySharedPost;
