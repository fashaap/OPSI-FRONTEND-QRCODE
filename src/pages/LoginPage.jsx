import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import AxiosInstance from "../auth/AxiosInstance";
import Swal from "sweetalert2"; // Import SweetAlert2

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await AxiosInstance.post("/api/v1/auth/admin/signin", {
        email,
        password,
      });
      if (response.data) {
        setIsLoading(false);

        // Store user information and token in localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        localStorage.setItem("userToken", response.data.token.refreshToken);

        navigate("/");
      } else {
        // Display error alert
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data
            ? response.data.error
            : "An unexpected error occurred",
        });
      }
    } catch (error) {
      // Display error alert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.error || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (values) => {
    setIsLoading(true);
    await login(values.email, values.password);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLoginSubmit,
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required("Email is required")
        .email("Invalid email address"),
      password: yup.string().required("Password is required"),
    }),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg ${
              isLoading ? "bg-blue-300" : "bg-blue-500"
            } text-white hover:bg-blue-600`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
