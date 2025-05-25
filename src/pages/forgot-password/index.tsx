import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/input";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../apis/auth";

function ForgotPassword() {
  const auth = useAuth();
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
  });

  const handleSubmit = (values: { email: string }) => {
    auth.sendResetEmail(values.email);
    console.log("Forgot password request for:", values.email);
  };

  return (
    <div className="login-container">
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Forgot Password</p>
        <p
          className="login-container-header-description"
          style={{ padding: "0px 10px" }}
        >
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
      </div>

      <Formik
        validationSchema={schema}
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
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
              <Button
                style={{ width: "100%", marginTop: "48px" }}
                variant="secondary"
                type="submit"
              >
                Send Reset Instructions
              </Button>
            </form>
            <div className="login-container-footer">
              <div className="login-container-footer-text">
                Remember your password?{" "}
                <Link className="text-primary" to="/login">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
