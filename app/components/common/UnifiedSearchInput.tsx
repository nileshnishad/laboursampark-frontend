"use client";

interface UnifiedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showClearButton?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

export default function UnifiedSearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Type to search...",
  showClearButton = true,
  containerClassName = "",
  inputClassName = "",
}: UnifiedSearchInputProps) {
  return (
    <div className={containerClassName}>
      <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition ${inputClassName}`.trim()}
      />
      {showClearButton && value && (
        <button
          onClick={() => onChange("")}
          className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
