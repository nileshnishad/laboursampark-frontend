interface SkeletonProps {
  type: "card" | "text" | "paragraph" | "avatar" | "badge" | "line";
  width?: string;
  height?: string;
  className?: string;
  count?: number; // For paragraph type - number of lines
}

export default function Skeleton({
  type,
  width = "w-full",
  height = "h-4",
  className = "",
  count = 3,
}: SkeletonProps) {
  const baseClasses = "bg-gray-300 dark:bg-gray-600 animate-pulse rounded";

  switch (type) {
    case "card":
      return (
        <div className="px-1.5 sm:px-2">
          <div className={`${width} bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col ${className}`}>
            {/* Header Bar */}
            <div className="h-0.5 sm:h-1 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Card Content */}
            <div className="p-2 sm:p-3 flex flex-col h-full space-y-2">
              {/* Avatar and Info */}
              <div className="flex gap-2 sm:gap-3">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-md bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-2.5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-2.5 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-gray-200 dark:border-gray-700"></div>

              {/* Details */}
              <div className="space-y-1">
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>

              {/* Tags */}
              <div className="flex gap-1 flex-wrap">
                <div className="h-5 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-5 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>

              {/* Contact Info */}
              <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      );

    case "avatar":
      return (
        <div
          className={`${width} ${height} rounded-md bg-gray-300 dark:bg-gray-600 animate-pulse ${className}`}
        />
      );

    case "paragraph":
      return (
        <div className={`space-y-2 ${className}`}>
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} ${width} ${
                i === count - 1 ? "w-5/6" : "w-full"
              } ${height}`}
            />
          ))}
        </div>
      );

    case "text":
      return <div className={`${baseClasses} ${width} ${height} ${className}`} />;

    case "badge":
      return (
        <div className={`${baseClasses} ${width || "w-24"} ${height || "h-6"} rounded-full ${className}`} />
      );

    case "line":
      return (
        <div className={`${baseClasses} ${width} ${height || "h-1"} ${className}`} />
      );

    default:
      return <div className={`${baseClasses} ${width} ${height} ${className}`} />;
  }
}
