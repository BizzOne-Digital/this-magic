import { useRef, useState, useEffect } from 'react';
import { FiUpload, FiX, FiImage, FiRefreshCw } from 'react-icons/fi';

const ImageUpload = ({
  label,
  preview,
  onChange,
  onRemove,
  accept = 'image/*',
  required = false,
  className = '',
  uploading = false,
}) => {
  const inputRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError(false);
      onChange(file);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    setImageError(false);
    if (inputRef.current) inputRef.current.value = '';
    onRemove?.();
  };

  const showPreview = preview && !imageError;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {showPreview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-sm h-44 object-cover rounded-lg border border-gray-200"
              onError={() => setImageError(true)}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
              aria-label="Remove image"
              title="Remove image"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {(imageError || !preview) && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-sm">
            {imageError ? 'Current image could not load. Upload a new image below.' : 'No image uploaded yet.'}
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {uploading ? (
            <>Uploading...</>
          ) : showPreview ? (
            <>
              <FiRefreshCw className="w-4 h-4" />
              Change Image
            </>
          ) : (
            <>
              <FiUpload className="w-4 h-4" />
              Upload Image
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-teal hover:text-teal transition-colors bg-gray-50 disabled:opacity-50"
        >
          <FiImage className="w-7 h-7" />
          <span className="text-sm">Or click here to select image</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
