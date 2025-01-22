import "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";

export default function RegistrationForm() {
    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        age: Yup.number()
            .required("Age is required")
            .positive("Age must be greater than 0")
            .integer("Age must be a number"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number"),
        repeatPassword: Yup.string()
            .required("Please confirm your password")
            .oneOf([Yup.ref("password")], "Passwords must match"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            age: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log("Form values:", values);
            alert("Registration successful!");
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <form
                onSubmit={formik.handleSubmit}
                className="w-full max-w-md p-6 bg-gray-900 rounded shadow-md"
            >
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Register
                </h2>

                {/* Username */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className={`mt-1 block w-full bg-gray-800 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.username}</p>
                    ) : null}
                </div>

                {/* Age */}
                <div className="mb-4">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.age}
                        className={`mt-1 block w-full bg-gray-800 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            formik.touched.age && formik.errors.age ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {formik.touched.age && formik.errors.age ? (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.age}</p>
                    ) : null}
                </div>

                {/* Email */}
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
                        className={`mt-1 block w-full bg-gray-800 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                    ) : null}
                </div>

                {/* Password */}
                <div className="mb-4">
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
                        className={`mt-1 block w-full bg-gray-800 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                    ) : null}
                </div>

                {/* Repeat Password */}
                <div className="mb-4">
                    <label
                        htmlFor="repeatPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Repeat Password
                    </label>
                    <input
                        id="repeatPassword"
                        name="repeatPassword"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repeatPassword}
                        className={`mt-1 block w-full bg-gray-800 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            formik.touched.repeatPassword && formik.errors.repeatPassword
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                        <p className="text-sm text-red-500 mt-1">
                            {formik.errors.repeatPassword}
                        </p>
                    ) : null}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Register
                </button>
                <div className="mt-2 text-center">
                    <p className="text-white">
                        Already have an account?{' '}
                        <Link to="/login" className="underline text-blue-500 hover:text-blue-600">
                            Login here
                        </Link>
                    </p>
                </div>
            </form>

        </div>
    );
};
