import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async(event) =>{
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();

      if(data.success === false) {
        setError(data.message)
        // console.log("you are getting error",data.message)
        setLoading(false)
        return;
      }

      setLoading(false)
      setError(null)
      navigate("/sign-in")
      // console.log(data)
    } catch (error) {
      setLoading(false)
      console.log("what is the error", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100"
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        className="w-full bg-indigo-500 text-white py-3 rounded hover:bg-indigo-600 transition duration-200"
                        type="submit" disabled={loading}
                    >
                        {loading ? "loading..." : "Sign Up"}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="text-indigo-500 hover:underline">Log In</Link>
                </p>
                <p className='text-red-700 '>
                  {error &&  error}
                </p>
            </div>
        </div>
  )
}
