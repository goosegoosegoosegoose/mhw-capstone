import React, { useContext, useState } from "react";
import UserContext from "../auth/userContext";
import { Form, Button } from "react-bootstrap"


const ProfileForm = ({edit}) => {
  const currentUser = useContext(UserContext);
  const INITIAL_STATE = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: ""
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }))
  };

  const handleSubmit = evt => {
    const e = false;
    try {
      evt.preventDefault();
      edit({...formData});
      setFormData(INITIAL_STATE);
    } catch(err) {
      console.log(e)
      e = true;
      return;
    };
  };


  return (
    <div className="my-2 mx-2">
      <h2>Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-4">
          <Form.Label>Username</Form.Label>
          <p><b>{currentUser.username}</b></p>
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label htmlFor="firstName">First Name</Form.Label>
          <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label htmlFor="lastName">Last Name</Form.Label>
          <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label htmlFor="password">Confirm password to make changes:</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" variant="primary">Save Changes</Button>
      </Form>
    </div>
  )
}

export default ProfileForm;