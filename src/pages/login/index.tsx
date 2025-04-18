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
    <div className="login-container">
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Log in to your account</p>
        <p className="login-container-header-description">
          Welcome back! Please enter your details.
        </p>
      </div>

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
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default Login;
