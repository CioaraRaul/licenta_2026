import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/home");
    } else {
      navigate("/auth/login");
    }
  }, [searchParams, navigate]);

  return (
    <div>
      {" "}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Logging you in...</p>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;
