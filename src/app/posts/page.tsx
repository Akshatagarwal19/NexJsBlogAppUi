"use client";
import React from "react";
import PostList from "@/app/components/PostList";

const PostsPage = () => {
  return (
    <div className="container">
      <h1 className="text-center my-4">All Posts</h1>
      {/* Render PostList with both modal and authentication enabled */}
      <PostList withModal={true} requireAuth={true} />
    </div>
  );
};

export default PostsPage;
