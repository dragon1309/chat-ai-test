interface FileChipProps {
  file: {
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
  };
  onRemove: (fileName: string) => void;
}

export function FileChip({ file, onRemove }: FileChipProps) {
  return (
    <div className="flex items-center space-x-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-sm">
      <svg
        className="w-5 h-5 text-indigo-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-indigo-900 font-medium">{file.originalName}</span>
      <button
        onClick={() => onRemove(file.fileName)}
        className="text-indigo-400 hover:text-indigo-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default FileChip;
