import React from "react";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  onClick?: () => void;
}

const statusStyles = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const priorityStyles = {
  low: "text-gray-600",
  medium: "text-yellow-600",
  high: "text-red-600",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
          {status.replace("_", " ")}
        </span>
      </div>
      {description && <p className="mb-3 text-sm text-gray-600">{description}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{id}</span>
        {priority && <span className={`text-xs font-medium ${priorityStyles[priority]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>}
      </div>
    </div>
  );
};
