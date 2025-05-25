import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/input";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../apis/auth";
import { ToasterContext } from "../../helpers/toasterProvider";
import { useContext } from "react";

function ResetPassword() {
  const auth = useAuth();
  const { showToast } = useContext(ToasterContext);
  const schema = Yup.object().shape({
    otpCode: Yup.string().required("OTP is a required field"),
    newPassword: Yup.string().required("Password is a required field"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
      .required("Confirm password is a required field"),
  });

  const handleSubmit = (values: {
    otpCode: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const userEmail = new URLSearchParams(window.location.search)
      ?.get("email")
      ?.replace(" ", "+");
    if (userEmail) {
      auth.resetPassword({ ...values, email: userEmail });
    } else {
      showToast({
        message: "Something went wrong",
        type: "error",
        title: "Error",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Reset Password</p>
        <p
          className="login-container-header-description"
          style={{ padding: "0px 10px" }}
        >
          Enter the OTP sent to your email address and reset your password.
        </p>
      </div>

      <Formik
        validationSchema={schema}
        initialValues={{ otpCode: "", newPassword: "", confirmNewPassword: "" }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <div className="login">
            <form noValidate onSubmit={handleSubmit}>
              <Input
                type="text"
                name="otpCode"
                label="OTP"
                placeholder="Enter the OTP sent to your email"
                id="otpCode"
              />
              <Input
                type="password"
                name="newPassword"
                label="New Password"
                placeholder="Enter your new password"
                id="newPassword"
              />
              <Input
                type="password"
                name="confirmNewPassword"
                label="Confirm Password"
                placeholder="Confirm your new password"
                id="confirmNewPassword"
              />
              <Button
                style={{ width: "100%", marginTop: "48px" }}
                variant="secondary"
                type="submit"
              >
                Reset Password
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

export default ResetPassword;
