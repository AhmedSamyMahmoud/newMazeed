import { useAuth } from "../../apis/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/input";
import Button from "../../components/button";
import "./styles.scss";
import { Link } from "react-router-dom";

function Login() {
  const auth = useAuth();

  const schema = Yup.object().shape({
    email: Yup.string().required("Email is a required field"),
    password: Yup.string().required("Password is a required field"),
  });

  return (
    <div className="login-container" style={{ maxWidth: "100%" }}>
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Log in to your account</p>
        <p className="login-container-header-description">
          Welcome back! Please enter your details.
        </p>
      </div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full max-w-sm mx-auto p-5">
          <Formik
            validationSchema={schema}
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              auth.login({ email: values.email, password: values.password });
            }}
          >
            {({ handleSubmit }) => (
              <div className="login">
                <form noValidate onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    id="email"
                  />
                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    id="password"
                  />
                  <div style={{ textAlign: "right", marginTop: "8px" }}>
                    <Link
                      to="/forgot-password"
                      style={{
                        textDecoration: "none",
                        fontSize: "14px",
                        color: "var(--text-primary-light)",
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    style={{ width: "100%", marginTop: "35px" }}
                    variant="secondary"
                    type="submit"
                  >
                    Log in
                  </Button>
                </form>
                <div className="login-container-footer">
                  <div className="login-container-footer-text">
                    Don't have an account?{" "}
                    <Link className="text-primary" to="/signup">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </div>
        <div className="flex flex-col justify-center px-6 hidden lg:flex">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Transform Your Content Across Platforms
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Automatically convert your high-performing content for different
              social media platforms. Increase your reach and engagement without
              creating new content from scratch.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF7846]/10 flex items-center justify-center">
                  <span className="text-[#FF7846] font-bold">1</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Connect Your Accounts
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Link your Instagram, TikTok, and YouTube accounts to import
                    content.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF7846]/10 flex items-center justify-center">
                  <span className="text-[#FF7846] font-bold">2</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select High-Performing Content
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Choose your best-performing content from one platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF7846]/10 flex items-center justify-center">
                  <span className="text-[#FF7846] font-bold">3</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Transform Automatically
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Our AI optimizes your content for the target platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
