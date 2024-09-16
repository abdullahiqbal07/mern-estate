import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector ,useDispatch } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/UserSlice';

export default function SignIn() {

  const {error, loading} = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async(event) =>{
    event.preventDefault();
    // setLoading(true);
    dispatch(signInStart())
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();

      if(data.success === false) {
        // setError(data.message)
        console.log("you are getting error",data.message)
        // setLoading(false)
        dispatch(signInFailure(data.message))
        return;
      }

      dispatch(signInSuccess(data))
      // setError(null)
      navigate("/")
      // console.log(data)
    } catch (error) {
      dispatch(signInFailure(error.message))
      console.log("what is the error", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    
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
                        {loading ? "loading..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Dont have an account?{' '}
                    <Link to="/sign-up" className="text-indigo-500 hover:underline">Sign Up</Link>
                </p>
                <p className='text-red-700 '>
                  {error &&  error}
                  {/* {userData} */}
                </p>
            </div>
        </div>
  )
}
