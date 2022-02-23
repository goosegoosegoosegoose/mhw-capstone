import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap"

const SignupForm = ({signup}) => {
  const INITIAL_STATE = {
    username: "",
    password: "",
    email: ""
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const nav = useNavigate();

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }))
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    signup({...formData});
    setFormData(INITIAL_STATE);
    nav(-1);
  };

  return (
    <div className="container">
      <div className="my-2 mx-2">
        <h2 className="my-2">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-4">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="my-4">  
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="my-4">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Button type="submit" variant="primary">Submit</Button>
        </Form>
      </div>
    </div>
  )
}

export default SignupForm;