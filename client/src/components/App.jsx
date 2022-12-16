import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Post from "./Post";
import UserPosts from "./UserPosts";
import { useState, createContext } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  //console.log("IsLoggedIn", isLoggedIn);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/home" element={<Dashboard />}></Route>
        <Route path="/userposts" element={<UserPosts />}></Route>
        <Route path="/post" element={"Page not Found"}>
          <Route path=":id"></Route>
        </Route>
        <Route path="/post">
          <Route path=":id">
            <Route path=":title" element={<Post />} />
          </Route>
        </Route>
        <Route path="*" element={"Page not Found"}></Route>
      </Routes>
    </div>
  );
}

export default App;
