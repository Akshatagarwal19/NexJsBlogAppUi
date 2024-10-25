import React, { useState } from "react";
import './modal.styles.css'; // Import the modal styles

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  description: string;
  mediaPath?: string;
  mediaType?: string;
  onDelete: () => void;
  onUpdate: (updatedPost: { title: string; description: string; mediaPath?: string; mediaType?: string }) => void;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  description,
  mediaPath,
  mediaType,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedMediaPath, setUpdatedMediaPath] = useState(mediaPath || "");
  const [updatedMediaType, setUpdatedMediaType] = useState(mediaType || "");

  if (!show) return null;

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost = {
      title: updatedTitle,
      description: updatedDescription,
      mediaPath: updatedMediaPath,
      mediaType: updatedMediaType,
    };
    console.log("Updated Post Data:", updatedPost);
    onUpdate(updatedPost);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {!isEditing ? (
          <>
            <h2>{title}</h2>
            <p>{description}</p>

            {mediaPath && mediaType?.startsWith("image") && (
              <img src={mediaPath} alt={title} className="img-fluid" />
            )}

            {mediaPath && mediaType?.startsWith("video") && (
              <video controls src={mediaPath} className="img-fluid" />
            )}

            {mediaPath && mediaType?.startsWith("audio") && (
              <audio controls src={mediaPath} />
            )}

            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={onDelete}>
                Delete
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmitUpdate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mediaPath">Media Path (optional)</label>
              <input
                type="text"
                id="mediaPath"
                className="form-control"
                value={updatedMediaPath}
                onChange={(e) => setUpdatedMediaPath(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mediaType">Media Type (optional)</label>
              <input
                type="text"
                id="mediaType"
                className="form-control"
                value={updatedMediaType}
                onChange={(e) => setUpdatedMediaType(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="btn btn-success mt-3">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary mt-3 ml-3"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
