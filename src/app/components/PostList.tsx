import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "./modal";
import Image from "next/image";
import PostModal from "./PostModal";
import styles from "./PostList.module.css";

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

const PostList: React.FC<PostListProps> = ({
  withModal = false,
  requireAuth = false,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

  // const handleMuteToggle = (index: number) => {
  //   const video = videoRefs.current[index];
  //   if (video) {
  //     video.muted = !video.muted;
  //   }
  // };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleDeletePost = async () => {
    if (selectedPost) {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${API_BASE_URL}/posts?id=${selectedPost._id}`,
          updatedPost,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowCreateModal(true)}
      >
        Create New Post
      </button>
      <div className="row">
        {posts.length === 0 ? (
          <div className="col-12 text-center">
            <p>No posts available. Be the first to create a post!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="col-12 d-flex justify-content-center mb-4"
            >
              <div className={styles.portraitModeContainer}>
                {post.mediaPath && (
                  <div className="card-img-top" style={{ cursor: "pointer" }}>
                    {post.mediaType?.startsWith("video") ? (
                      <div className={styles.media}>
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          muted
                          loop
                          controls
                          playsInline
                          className={styles.media}
                          src={`${API_BASE_URL}/posts/media?id=${post._id}`}
                        />
                      </div>
                    ) : post.mediaType?.startsWith("image") ? (
                      <div className={styles.media}>
                        <Image className={styles.media} src={`${API_BASE_URL}/posts/media?id=${post._id}`} width={300} height={400} alt={post.title} />
                      </div>
                    ) : post.mediaType?.startsWith("audio") ? (
                      <audio
                        controls
                        className={styles.media}
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
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewPost(post)}
                  >
                    View Post
                  </button>
                  <hr className={styles.separator} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {withModal && selectedPost && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={selectedPost.title}
          description={selectedPost.description}
          mediaPath={`${API_BASE_URL}/posts/media?id=${selectedPost._id}`}
          mediaType={selectedPost.mediaType}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost}
        />
      )}

      <PostModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreatePost}
      />
    </div>
  );
};

export default PostList;