import React from "react";

import { Outlet, Link } from "react-router-dom";

const PostLayout = () => {
  return (
    <>
      <Link to="/postPage/1">Post1</Link>
      <br />
      <Link to="/postPage/2">Post2</Link>
      <br />
      <Link to="/postPage/3">Post3</Link>
      <br />
      <Link to="/postPage/newPost">NewPost</Link>
      <Outlet />
    </>
  );
};

export default PostLayout;
