import Header from "./Header";
import About from "./About";
import Footer from "./Footer";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Missing from "./Missing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts";

function App() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [posts, setPosts] = useState([]);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        const fetchedPosts = response.data;
        setPosts(fetchedPosts);
      } catch (err) {
        if (err.response) {
          console.log("Fetch error response:", err.response.data);
          console.log("Fetch error status:", err.response.status);
          console.log("Fetch error headers:", err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filterPosts = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filterPosts.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;
    const datetime = format(new Date(), "MMMM dd yyyy, pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message} `);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd yyyy, pp");
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) =>
          post.id === id
            ? { ...response.data, id: Number(response.data.id) }
            : post
        ) // Ensure ID is a number
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <Header title="Social Media Rant" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route path="post">
          <Route
            index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
              />
            }
          />
          <Route
            path=":id"
            element={<PostPage posts={posts} handleDelete={handleDelete} />}
          />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
