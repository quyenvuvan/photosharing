import React ,{useState,useEffect}from "react";
import {Typography} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";
function UserDetail({users}) {
    const {userId} = useParams();
  
  const user=users.find(u=>u._id===userId);
    return (
      <div className="user-detail">
      <h2>User Detail</h2>
      <p>{user._id}</p>
      <p>{user.first_name}</p>
      <p>{user.last_name}</p>
      <p>{user.location}</p>
      <p>{user.occupation}</p>
      <p>{user.description}</p>
      <Link to={`/photos/${userId}`}>View Photos</Link>
    </div>
    );
}

export default UserDetail;
