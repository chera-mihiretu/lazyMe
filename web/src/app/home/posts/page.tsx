"use client";
import React from "react";
import HomeNavBar from "@/components/home/HomeNavBar";
import PostsList from "@/components/home/PostsList";
import UserSuggestionsList from "@/components/home/UserSuggestionsList";
import ProtectedRoute from "@/app/ProtectedRoute";

const PostsPage = () => {
  return (
    <ProtectedRoute role="student">
      <HomeNavBar />
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        maxWidth: 1100,
        margin: "2.5rem auto 0 auto",
        padding: "0 1.5rem",
        gap: 36,
        fontFamily: "Poppins, sans-serif",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <PostsList />
        </div>
        <div className="hidden xl:block" style={{ width: 280, minWidth: 240 }}>
          <UserSuggestionsList />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostsPage;