import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SuccessfulPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-lg text-center">
        <h2 className="text-xl font-semibold text-emerald-900">Response is successfully submitted</h2>
        <p className="mb-8 text-gray-500">Redirecting to the main page...</p>
      </div>
    </div>
  );
};

export default SuccessfulPage;
