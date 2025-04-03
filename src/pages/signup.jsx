import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

function signup() {
  const [formData, SetFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    SetFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(e);
    // console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
        // formData
      );
      console.log(res);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        console.log(data.statusCode);
        setLoading(false);
        return;
      }
      setError(null);
      console.log(data);
      console.log(data.statusCode);
      setLoading(false);
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }

    // setError(err.message)
    // setLoading(false);
  };
  return (
    
    <div className="p-3 max-w-xl mx-auto">
      <h2 className="text-4xl text-center p-5 m-3 ">Sign Up</h2>
      <div> 
        <form onSubmit={handleSubmit} action="" className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="username"
            id="username"
            className="border py-3 px-2 rounded-xl text-xl"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Email"
            id="email"
            className="border py-3 px-2 rounded-xl text-xl"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Password"
            id="password"
            className="border py-3 rounded-xl px-2 text-xl"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white uppercase py-4 rounded-xl text-xl hover:opacity-85"
          >
            {loading ? "loading.." : "Submit"}
          </button>
          <OAuth/>
        </form>
        <div className="flex gap-3">
          <p>Have an Account ?</p>
          <Link to={"/signin"}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default signup;
