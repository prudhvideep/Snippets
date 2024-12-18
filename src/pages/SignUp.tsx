import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import useUserStore from "../store/userStore";
import useThemeStore from "../store/themeStore";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { useEffect } from "react";

function SignUp() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    userName,
    setUserName,
    authError,
    setAuthError,
    authErrorMessage,
    setAuthErrorMessage
  } = useUserStore();

  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userName = user.displayName || "Anonymous User";
        setUserName(userName);
        setAuthError(false);
        setAuthErrorMessage(null);
        navigate("/folders");
      } 
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!email || !password || !userName) {
      setAuthErrorMessage("Please fill in all fields.");
      setAuthError(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: userName,
      });

      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;

      setAuthError(true);

      switch (errorCode) {
        case "auth/invalid-email":
          setAuthErrorMessage("This email address is invalid.");
          break;
        case "auth/user-disabled":
          setAuthErrorMessage("This email address is disabled by the administrator.");
          break;
        case "auth/user-not-found":
          setAuthErrorMessage("This email address is not registered.");
          break;
        case "auth/wrong-password":
          setAuthErrorMessage(
            "The password is invalid or the user does not have a password."
          );
          break;
        case "auth/invalid-credential":
          setAuthErrorMessage("The email or password combination is invalid.");
          break;
        case "auth/email-already-in-use":
          setAuthErrorMessage("The email is already in use.");
          break;
        default:
          setAuthErrorMessage(error.message);
          break;
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-sidebar" : "bg-gray-100"
      }`}
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {theme === "dark" ? (
            <RiSunLine className="h-5 w-5" />
          ) : (
            <RiMoonLine className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          className={`mt-6 text-center text-3xl font-extrabold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Sign up for an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className={`py-8 px-4 shadow rounded-lg sm:rounded-lg sm:px-10 ${
            theme === "dark" ? "bg-notearea" : "bg-white"
          }`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {authErrorMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="userName"
                className={`block text-sm font-medium leading-6 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Display Name
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="userName"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 pl-2.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-[#8860a9] sm:text-sm sm:leading-6 ${
                    theme === "dark"
                      ? "bg-sidebar text-white ring-gray-600 placeholder:text-gray-400"
                      : "bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400"
                  }`}
                  value={userName || ""}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium leading-6 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 pl-2.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-[#8860a9] sm:text-sm sm:leading-6 ${
                    theme === "dark"
                      ? "bg-sidebar text-white ring-gray-600 placeholder:text-gray-400"
                      : "bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400"
                  }`}
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium leading-6 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 pl-2.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-[#8860a9] sm:text-sm sm:leading-6 ${
                    theme === "dark"
                      ? "bg-sidebar text-white ring-gray-600 placeholder:text-gray-400"
                      : "bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400"
                  }`}
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#6d4d88] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#8860a9]"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    theme === "dark"
                      ? "bg-notearea text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="flex w-full justify-center rounded-md bg-[#6d4d88] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#8860a9]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
