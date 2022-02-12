import React, { useState } from "react";
import MhwApi from "../api";
import { Button, Row } from "react-bootstrap"

const SearchForm = ({ type, header, get }) => {
  const [formData, setFormData] = useState("")

  const search = async (handle) => {
    const res = await MhwApi.search(type, header, handle);
    get(res);
  }

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFormData(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    search(formData);
    setFormData("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row className="my-3">
        <div className="input-group col-2">
          <input
            className="form-control"
            value={formData}
            placeholder="Enter search"
            onChange={handleChange}
          />
          <Button className="mx-1" type="submit" variant="primary" size="sm">Submit</Button>
        </div>
      </Row>
    </form>
  )
}

export default SearchForm;