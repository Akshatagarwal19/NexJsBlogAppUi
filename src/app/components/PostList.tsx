import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./modal";
import PostModal from "./PostModal"; // Import the CreatePostModal component
import styles from './PostList.module.css'; // Import the CSS module

interface Post {
  _id: string;
  title: string;
  description: string;
  mediaPath?: string;
  mediaType?: string;
  createdAt: string;
  userId: string;
}

interface NewPost {
  title: string;
  description: string;
  mediaFile: File | null;
}

interface PostListProps {
  withModal?: boolean;
  requireAuth?: boolean;
}

const PostList: React.FC<PostListProps> = ({ withModal = false, requireAuth = false }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for Create Post Modal
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = requireAuth ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_BASE_URL}/posts`, { headers });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, [API_BASE_URL, requireAuth]);

  const handleViewPost = (post: Post) => {
    if (withModal) {
      setSelectedPost(post);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleDeletePost = async () => {
    if (selectedPost) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`${API_BASE_URL}/posts?id=${selectedPost._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(posts.filter((post) => post._id !== selectedPost._id));
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting post", error);
      }
    }
  };

  const handleUpdatePost = async (updatedPost: Partial<Post>) => {
    if (selectedPost) {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      try {
        await axios.put(`${API_BASE_URL}/posts?id=${selectedPost._id}`, updatedPost, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        // Update the post list with the new data
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? { ...post, ...updatedPost } : post
          )
        );

        handleCloseModal();
      } catch (error) {
        console.error("Error updating post", error);
      }
    }
  };

  const handleCreatePost = async (Post: NewPost) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
  
    formData.append("title", Post.title);
    formData.append("description", Post.description);
  
    if (Post.mediaFile) {
      formData.append("mediaPath", Post.mediaFile);
    }
    formData.forEach((value, key) => {
      console.log(key, value); // Log to verify the appended data
    });
  
    console.log(Post); // For debugging purposes
  
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Removed Content-Type
        },
      });
  
      setPosts((prevPosts) => [...prevPosts, response.data.post]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating post", error);
    }
  };
  

  return (
    <div className="container my-4">
      <h2 className="mb-4">Blog Posts</h2>
      <button className="btn btn-primary mb-4" onClick={() => {console.log("Create New Post clicked"); setShowCreateModal(true)}}>
        Create New Post
      </button>
      <div className="row">
        {posts.length === 0 ? (
          <div className="col-12 text-center">
            <p>No posts available. Be the first to create a post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="col-12 mb-4"> {/* Ensure only one post per line */}
              <div className={`card ${styles.card}`}>
                {post.mediaPath && (
                  <div className="card-img-top">
                    {post.mediaType?.startsWith("image") ? (
                      <img
                        className={styles.media} // Apply the media class
                        src={`${API_BASE_URL}/posts/media?id=${post._id}`}
                        alt={post.title}
                      />
                    ) : post.mediaType?.startsWith("video") ? (
                      <video
                        controls
                        className={styles.media} // Apply the media class
                        src={`${API_BASE_URL}/posts/media?id=${post._id}`}
                      />
                    ) : post.mediaType?.startsWith("audio") ? (
                      <audio
                        controls
                        className={styles.media} // Apply the media class
                        src={`${API_BASE_URL}/posts/media?id=${post._id}`}
                      />
                    ) : null}
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <p className="text-muted">
                    Published on: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <button className="btn btn-primary" onClick={() => handleViewPost(post)}>
                    View Post
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing post details */}
      {withModal && selectedPost && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={selectedPost.title}
          description={selectedPost.description}
          mediaPath={`${API_BASE_URL}/posts/media?id=${selectedPost._id}`}
          mediaType={selectedPost.mediaType}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost} // Pass the handleUpdatePost function here
        />
      )}

      {/* Create Post Modal */}
      <PostModal isOpen={showCreateModal} onClose={handleCloseCreateModal} onCreate={handleCreatePost} />
    </div>
  );
};

export default PostList;
