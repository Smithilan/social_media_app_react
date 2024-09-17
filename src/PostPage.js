import React from "react";
import { useParams } from "react-router-dom";

const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams();
  // Convert id from useParams to number for comparison
  const numericId = Number(id);
  const post = posts.find((post) => post.id === numericId);

  return (
    <main className="PostPage">
      <article className="post">
        {post ? (
          <>
            <h1>{post.title}</h1>
            <p className="postDate">{post.datetime}</p>
            <p className="postBody">{post.body}</p>
            <button className="deleteButton" onClick={() => handleDelete(numericId)}>Delete Post</button>
          </>
        ) : (
          <>
            <h2>Page Not Found</h2>
            <p>Well, that's disappointing.</p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
