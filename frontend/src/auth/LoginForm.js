import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({login}) => {
  const INITIAL_STATE = {
    username: "",
    password: ""
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const navigate = useNavigate();

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }))
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    login({...formData});
    setFormData(INITIAL_STATE);
    navigate("/");
  };

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange}></input>
        <label htmlFor="password">Password</label>
        <input type="text" name="password" value={formData.password} onChange={handleChange}></input>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default LoginForm;