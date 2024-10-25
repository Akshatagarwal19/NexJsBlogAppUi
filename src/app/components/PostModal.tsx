import React, { useState } from 'react';
import './modal.styles.css'; // Import the modal styles

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newPost: { title: string; description: string; mediaFile: File | null, mediaType: string | null }) => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMediaFile(file);
    setMediaType(file ? file.type : null); // Set media type from the file's MIME type
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, description, mediaFile, mediaType });
    onClose(); // Close the modal after creating the post
  };

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
