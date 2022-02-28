import React, { useContext, useEffect, useState } from "react";
import UserContext from "./userContext";
import { Form, Button } from "react-bootstrap"


const EmailForm = ({edit}) => {
  const currentUser = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [email, setEmail] = useState(null);
  const INITIAL_VALUES = {
    email: "",
    password: ""
  }

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
      setEmail(formData.email);
      setFormData(INITIAL_VALUES);
    } catch(err) {
      console.log(e)
      e = true;
      return;
    };
  };


  return (
    <div className="container">
    <div className="my-2 mx-2">
      <h2>Edit Email</h2>
      {email ? <h4>Current Email: {email}</h4> : <h4>Current Email: {currentUser.email}</h4>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-4">
          <Form.Label htmlFor="email">Enter desired email:</Form.Label>
          <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label htmlFor="password">Confirm password to make changes:</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" variant="primary">Save New Email</Button>
      </Form>
    </div>
    </div>
  )
}

export default EmailForm;