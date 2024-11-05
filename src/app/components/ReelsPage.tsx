"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ReelsPage.module.css";

interface Post {
  _id: string;
  title: string;
  description: string;
  mediaPath?: string;
  mediaType?: string;
  createdAt: string;
  userId: string;
}

const ReelsPage: React.FC = () => {
  const [videoPosts, setVideoPosts] = useState<Post[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Adjust if using a different token key
        const response = await axios.get(`${API_BASE_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const videos = response.data.filter((post: Post) => post.mediaType === "video");
        setVideoPosts(videos);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  const handleMuteToggle = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !video.muted;
    }
  };

  return (
    <div className={styles.reelsContainer}>
      {videoPosts.map((post, index) => (
        <div key={post._id} className={styles.reelItem}>
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            muted
            loop
            playsInline
            className={styles.video}
            src={`${API_BASE_URL}/posts/media?id=${post._id}`}
            onClick={() => handleMuteToggle(index)}
          />
          {/* Overlay post details */}
          <div className={styles.overlay}>
            <h2 className={styles.title}>{post.title}</h2>
            <p className={styles.description}>{post.description}</p>
            <p className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsPage;
