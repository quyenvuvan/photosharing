import React ,{useState,useEffect}from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";
function UserList ({setUsers}) {
  const [users, setLocalUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://psrdvv-8081.csb.app/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setLocalUsers(data);
        setUsers(data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [setUsers]);
    return (
      <div>    
        <List component="nav">
        {users.map(user => (
          <li key={user._id}>
        <Link to={`/users/${user._id}`}>{`${user.first_name} ${user.last_name}`}</Link>
        </li>
        ))}
        </List>
      </div>
    );
}
export default UserList;
