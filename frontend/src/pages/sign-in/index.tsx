import Cookies from "js-cookie";
import type React from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { useUserContext } from "../../context/auth";
import { getCustomer, medusaClient } from "../../utils/medusa";

export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setPartialUserState } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log("Sign in attempt with:", email, password);
    console.log("VITE_APP_MEDUSA_BACKEND_URL", import.meta.env.VITE_APP_MEDUSA_BACKEND_URL);
    console.log("VITE_APP_BASE_URL", import.meta.env.VITE_APP_BASE_URL);

    setIsLoading(true);
    setErrorMessage("");

    return medusaClient.auth
      .getToken(
        {
          email,
          password,
        },
        {
          next: {
            tags: ["auth"],
          },
        },
      )
      .then(async ({ access_token }) => {
        access_token && Cookies.set("_medusa_jwt", access_token);

        const customer = await getCustomer();

        if (!customer) {
          return setErrorMessage("Wrong email or password.");
        }

        setPartialUserState({
          email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          isAuthenticated: true,
        });

        navigate("/");
      })
      .catch((err) => {
        setErrorMessage("Wrong email or password.");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-medium text-emerald-900">
          <span className="font-bold">ClinicOS</span>
          <sup>®</sup> for patient
        </h2>
        <p className="text-base text-gray-600">Sign in to your account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white border border-gray-300 sm:rounded-lg sm:px-10">
          <form className="flex flex-col justify-between space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-base text-emerald-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-base text-emerald-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" loading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-3">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
