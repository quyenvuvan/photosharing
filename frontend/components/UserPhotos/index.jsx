import React,{useState,useEffect} from "react";
import { Typography } from "@mui/material";
import myphoto from '../../images/kenobi2.jpg';
import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";
import { Link } from "react-router-dom";

function UserPhotos ({users}) {
    const {userId} = useParams();
    let ar=models.photoOfUserModel(userId)
    const [commentData, setCommentData] = useState({});
    const [Cut,setCut]=useState([]);
   const handleInputChange = (event, photoId) => {
      setCommentData({
          ...commentData,
          [photoId]: event.target.value
      });
  };
  useEffect(() => {
    const fetchPhotos = async () => {
        try {
            const response = await fetch(`https://psrdvv-8081.csb.app/photosOfUser/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }
            const data = await response.json();
            setCut(data); 
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };
    fetchPhotos();
   
}, [userId]);
  const handleKeyPress = async (event, photoId) => {
      if (event.key === 'Enter') {
        
          const commentText = commentData[photoId];
          if (commentText && commentText.trim() !== "") {
            try {
              const response = await fetch(`https://psrdvv-8081.csb.app/commentsOfPhoto/${photoId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                  body: JSON.stringify({ comment: commentText })
              });
              if (!response.ok) {
                  throw new Error('Failed to add comment');
              }
              const recComment = await response.json();
              const newComment={
                user_id: recComment.user_id,
                comment: recComment.comment,
                date_time: recComment.date_time
              }
              const photoIndex = Cut.findIndex(photo => photo._id === photoId);
              Cut[photoIndex].comments = Cut[photoIndex].comments || [];
              Cut[photoIndex].comments.push(newComment);
              setCommentData({
                  ...commentData,
                  [photoId]: ""
              });
          } catch (error) {
              console.error('Error adding comment:', error);
          }
          }
      }
  };
    return (
      <div>
      {Cut.length>0? Cut.map((item, index) => (
        <div>
          <img src={`https://psrdvv-8081.csb.app/images/${item.file_name}`} style={{ width: '400px', height: '400px' }}  alt="User Photo" />
          <div>{item.date_time}</div>
          <div>
            {item.comments?item.comments.map(p=>(
              <div >
                <div>{p.comment} {p.date_time}</div>
                <Link to={`/users/${p.user_id}`}>{users.find(u=>u._id==p.user_id).first_name}</Link>
                </div>
                )):(<div>no comment</div>)}
          </div>
          <input
                        type='text'
                        value={commentData[item._id] || ""}
                        onChange={(event) => handleInputChange(event, item._id)}
                        onKeyPress={(event) => handleKeyPress(event, item._id)}
                        placeholder="Add a comment"
          />
          </div>
      )):<div>hell</div>}
  </div>
    );
}
export default UserPhotos;
// <img key={index} src={require('../../images/' + item.file_name)} />