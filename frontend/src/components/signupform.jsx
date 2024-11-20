import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const SignUpForm = () => {
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState(null);  // Store signup error messages


  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });


      if (!response.ok) {  // Check if the response is not ok
        const errorData = await response.json(); // Get error data from the response
        throw new Error(errorData.message || 'Signup failed'); // Throw an error with the message from the server
      }


      // Handle successful signup
      setSignupSuccess(true);
      setSignupError(null); // Clear any previous errors

      // Reset the form after successful submission (optional):
      // formik.resetForm();




    } catch (error) {
      console.error('Signup error:', error);
      setSignupSuccess(false);
      setSignupError(error.message);  // Display the error message to the user
    }
  };



  return (
    <div>
      {/* Conditionally render success or error messages */}
      {signupSuccess && <div>Signup Successful!</div>}
      {signupError && <div style={{ color: 'red' }}>{signupError}</div>}

      {!signupSuccess && ( // Only show the form if signup hasn't succeeded
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => ( // Access isSubmitting for the loading state
            <Form>
              <div>
                <Field type="text" name="username" placeholder="Username" />
                <ErrorMessage name="username" component="div" />
              </div>
              <div>
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage name="email" component="div" />
              </div>
              <div>
                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage name="password" component="div" />
              </div>
              <div>
                <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : 'Sign Up'} {/* Loading state */}
              </button>

            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};


export default SignUpForm;