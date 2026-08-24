import React from "react";
import "./form.css";

function Form() {
  return (
    <div className="form-container">
      <h2>Registration Form</h2>

      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;