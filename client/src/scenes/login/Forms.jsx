import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme, CircularProgress } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, showSnackbar } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import axios from "axios";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("This field is required").min(2, "Must be 2-50 characters").max(50, "Must be 2-50 characters"),
  lastName: yup.string().required("This field is required").min(2, "Must be 2-50 characters").max(50, "Must be 2-50 characters"),
  email: yup.string().email("Invalid email format").required("This field is required").max(50, "Must be 50 characters at most").lowercase(),
  password: yup
    .string()
    .required("This field is required")
    .min(8, "Password must be strong. Use at least 8 characters, including uppercase letters, digits, and symbols.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must be strong. Use at least 8 characters, including uppercase letters, digits, and symbols."
    ),
  location: yup.string(),
  occupation: yup.string(),
  picture: yup.string(),
});
  
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("This field is required").max(50, "Must be 50 characters at most"),
  password: yup
    .string()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must be strong. Use at least 8 characters, including uppercase letters, digits, and symbols."
    ),
});
  
  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
  };
  
  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const dbApi = process.env.REACT_APP_DB_API;

const Forms = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const [ isLoading, setIsLoading ] = useState(false);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(null);
  
    const register = async (values, onSubmitProps) => {
      setIsLoading(true);
      try {
        // this allows us to send form info with image
        const formData = new FormData();
        formData.append("firstName", values.firstName)
        formData.append("lastName", values.lastName)
        formData.append("email", values.email)
        formData.append("password", values.password)
        formData.append("picture", values.picture);        
        if (values.location) {
          formData.append("location", values.location)
        } else {
          formData.append("location", "Not set")
        }
        if (values.occupation) {
          formData.append("occupation", values.occupation)
        } else {
          formData.append("occupation", "Not set")
        }

        // console.log(...formData);

        const savedUserResponse = await axios.post(`${dbApi}/auth/register`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        const savedUser = await savedUserResponse.data;
        onSubmitProps.resetForm();
    
        if (savedUser) {
          setPageType("login");
          const message = `User ${values.firstName} ${values.lastName} has successfully registered.`;
          dispatch(showSnackbar({ open: true, message: message, severity: 'success', autoHideDuration: 3000 }));
          setError(null);
        }
      } catch (err) {
        console.log(err)
        setError(err.response.data.message || 'An error occurred')
      } finally {
        setIsLoading(false);
      }   
    };
  
    const login = async (values, onSubmitProps) => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${dbApi}/auth/login`, values);
        const loggedIn = response.data;
        
        if (loggedIn) {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            })
          );
          onSubmitProps.resetForm();
          navigate('/home');
          dispatch(showSnackbar({ open: true, message: "Welcome back user!", severity: 'success', autoHideDuration: 3000 }));
        }
      } catch (err) {
        console.error(err);
        setError(err.response.data.message || 'An error occurred')
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleFormSubmit = async (values, onSubmitProps) => {
      if (isLogin) await login(values, onSubmitProps);
      if (isRegister) await register(values, onSubmitProps);
    };
  
    return (
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={ Boolean(touched.location) && Boolean(errors.location) }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={ Boolean(touched.occupation) && Boolean(errors.occupation) }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      accept={{ 
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                        "image/jpg": [".jpg", ".jpeg"]
                      }}
                      // maxSize={2097152} // limit image size to 2MB
                      validator={file => {
                        if (file.size > 2097152) {
                          setImgError("Image must be less than 2mb")
                        } else {
                          setImgError(null)
                        }
                      }}
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                      }}
                      onDropRejected={(rejectedFiles) => setImgError("Invalid image format")}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box>
                        {!values.picture ? (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            <p>Add Picture (jpg, jpeg, png)</p>
                            <p style={{fontStyle: 'italic'}}>If none, default picture will be used.</p>
                          </Box>
                        ) : (
                          <FlexBetween>
                            <FlexBetween
                              {...getRootProps()}
                              border={`2px dashed ${palette.primary.main}`}
                              p="1rem"
                              sx={{ "&:hover": { cursor: "pointer" }, width: "100%", mr: 1 }}
                            >
                              <input {...getInputProps()} />
                              <p>{values.picture.name}</p>
                              <EditOutlinedIcon />
                            </FlexBetween>
                            
                            <DeleteOutlineOutlinedIcon 
                              onClick={() => {
                                setFieldValue("picture", null);
                                setImgError(null);
                              }} 
                              sx={{ "&:hover": { cursor: "pointer" } }}
                            /> 
                          </FlexBetween>   
                          )}
                        
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                  {imgError && <Typography variant="body1" sx={{color: '#f44336', gridColumn: "span 4"}}>{imgError}</Typography>}
                </>
              )}
  
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ 
                  gridColumn: "span 4"                  
                }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {error && <Typography variant="body1" color="error" sx={{gridColumn: "span 4", mt: 2}}>{error}</Typography>}

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                onClick={() => setError(null)}
                disabled={isLoading || !!imgError}
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{color: palette.background.alt}}/>
                ) : (
                  isLogin ? "LOGIN" : "REGISTER"
                )}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                  setError(null);
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    );
  };
  
  export default Forms;