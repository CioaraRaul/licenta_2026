import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { oauthExchange } from "~/api/auth.api";
import { useAuthStore } from "~/store/auth.store";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens, setUsers } = useAuthStore.getState();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) return;

    const code = searchParams.get("code");

    if (!code) {
      navigate("/auth/login", { replace: true });
      return;
    }

    hasExchanged.current = true;

    oauthExchange(code)
      .then((data) => {
        setTokens(data.accessToken, data.refreshToken);
        setUsers(data.user);
        navigate("/", { replace: true });
      })
      .catch(() => {
        navigate("/auth/login", { replace: true });
      });
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
