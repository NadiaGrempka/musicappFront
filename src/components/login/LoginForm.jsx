import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                // Send POST request to the /auth endpoint
                const response = await fetch('http://localhost:8080/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    // If successful, get userId from response and store it in localStorage
                    const userId = await response.text(); // Assuming the response is just the userId
                    localStorage.setItem('userId', userId); // Save userId in localStorage
                    // Redirect or perform other actions
                    navigate('/home'); // Example: redirect to a dashboard after login
                } else {
                    // If authentication fails, throw an error to be caught below
                    const error = await response.text();
                    setErrorMessage(error);
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                // Handle network or other errors
                setErrorMessage('Something went wrong, please try again.');
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`mt-1 block w-full px-3 py-2 border text-white bg-gray-800 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                        ) : null}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className={`mt-1 block w-full px-3 py-2 border text-white bg-gray-800 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                        Login
                    </button>
                </form>

                {errorMessage && (
                    <div className="mt-4 text-center text-red-600">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="mt-2 text-center">
                    <p>
                        <span className="font-semibold text-white">New?</span>{' '}
                        <Link to="/register" className="underline text-blue-500 hover:text-blue-600">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
