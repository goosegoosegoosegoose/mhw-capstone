import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap"

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
    <div className="container">
      <div className="my-2 mx-2">
        <h2 className="my-2">Log In</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-4">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange}></Form.Control>
          </Form.Group>
          <Form.Group className="my-4">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">Submit</Button>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm;