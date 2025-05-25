import { useAuth } from "../../apis/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/input";
import Button from "../../components/button";
import { Link } from "react-router-dom";

function VerifyOTP() {
  const auth = useAuth();

  const schema = Yup.object().shape({
    otpCode: Yup.string().required("Please add this field"),
  });
  const email =
    localStorage.getItem("token") &&
    JSON.parse(localStorage.getItem("token") || "").email;

  return (
    <div className="login-container">
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Verify OTP</p>
      </div>

      <Formik
        validationSchema={schema}
        initialValues={{ otpCode: "" }}
        onSubmit={(values) => {
          auth.verifyOTP({
            OTPCode: values.otpCode,
            email: email,
            purpose: 0,
          });
        }}
      >
        {({ handleSubmit }) => (
          <div className="login">
            <form noValidate onSubmit={handleSubmit}>
              <Input
                type="text"
                name="otpCode"
                label="OTP Code"
                placeholder="Enter OTP sent to your email"
                id="otpCode"
              />
              <Button
                style={{ width: "100%", marginTop: "48px" }}
                variant="secondary"
                type="submit"
              >
                Verify
              </Button>
            </form>
            <div className="login-container-footer">
              <div className="login-container-footer-text">
                Back to login?{" "}
                <Link className="text-primary" to="/login">
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default VerifyOTP;
