import { useAuth } from "../../apis/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/input";
import Button from "../../components/button";
import { Link } from "react-router-dom";

function Signup() {
  const auth = useAuth();

  const schema = Yup.object().shape({
    firstName: Yup.string().required("Please add this field"),
    lastName: Yup.string().required("Please add this field"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is a required field"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .required("Phone number is a required field"),
    password: Yup.string().required("Password is a required field"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is a required field"),
  });

  return (
    <div className="login-container">
      <div className="login-container-header">
        <div style={{ fontSize: "38px" }}>mazeed.ai</div>
        <p className="login-container-header-title">Create an account</p>
      </div>

      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => {
          auth.signUp({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            confirmPassword: values.confirmPassword,
          });
        }}
      >
        {({ handleSubmit }) => (
          <div className="login">
            <form noValidate onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder=""
                  id="firstName"
                />
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder=""
                  id="lastName"
                />
              </div>
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder=""
                id="email"
              />
              <Input
                type="text"
                name="phoneNumber"
                label="Phone Number"
                placeholder=""
                id="phoneNumber"
              />
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder=""
                id="password"
              />
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder=""
                id="confirmPassword"
              />

              <Button
                style={{ width: "100%", marginTop: "48px" }}
                variant="secondary"
                type="submit"
              >
                Sign up
              </Button>
            </form>
            <div className="login-container-footer">
              <div className="login-container-footer-text">
                Already have an account? <Link to="/login">Log in</Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
