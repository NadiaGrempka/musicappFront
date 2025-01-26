import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        email: '',
        userName: '',
        age: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Pobieramy userId z localStorage lub innego miejsca
    const userId = localStorage.getItem('userId');

    const formik = useFormik({
        initialValues: {
            userName: '',
            age: '',
        },
        validationSchema: yup.object({
            userName: yup.string().min(2, 'Username must be at least 2 characters'),
            age: yup.number().typeError('Age must be a number').positive('Age must be greater than 0'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch(`http://localhost:8080/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUserData(updatedUser);
                    alert('User information updated successfully!');
                } else {
                    alert('Failed to update user information.');
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('An error occurred while updating user information.');
            }
        },
    });

    useEffect(() => {
        if (userId) {
            // Wykonaj zapytanie do backendu po dane użytkownika
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/users/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData({
                            email: data.email,
                            userName: data.userName,
                            age: data.age,
                        });
                        formik.setValues({
                            userName: data.userName || '',
                            age: data.age || '',
                        });
                    } else {
                        setError('Failed to fetch user data');
                    }
                    // eslint-disable-next-line no-unused-vars
                } catch (error) {
                    setError('Something went wrong, please try again later.');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/home');
    };

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
            {/* Back Arrow */}
            <button
                onClick={handleBack}
                className="flex items-center text-white mb-4">
                <FaArrowLeft className="mr-2" />
                Back to Home
            </button>

            {/* Header with centered title */}
            <div className="flex justify-center mb-6">
                <h1 className="text-xl font-semibold text-white">User Profile</h1>
            </div>

            {/* User Info */}
            <div className="text-center">
                <FaUserCircle className="text-gray-200 mx-auto mb-2" size={100} />
                <p className="text-gray-300 font-medium mb-4">{userData.email}</p>
            </div>

            {/* Form to Update User Info */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        id="username"
                        name="userName"
                        type="text"
                        className={`mt-1 block w-full h-10 rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3 pr-3 ${
                            formik.touched.userName && formik.errors.userName ? 'border-red-500' : ''
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                    />
                    {formik.touched.userName && formik.errors.userName && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.userName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                        Age
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        className={`mt-1 block w-full h-10 rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3 pr-3 ${
                            formik.touched.age && formik.errors.age ? 'border-red-500' : ''
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.age}
                    />
                    {formik.touched.age && formik.errors.age && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.age}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Confirm Changes
                </button>
            </form>

            {/* Logout Button */}
            <div className="mb-4 text-center">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 mt-3 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Logout
                </button>
            </div>
            </div>
        </div>
    );
};

export default UserProfile;
