import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import * as yup from "yup";
import "./App.css";
/// Time out Function
const sleep = (time: any) => new Promise((acc) => setTimeout(acc, time));

export const FormDisplay = () => {
  return (
    <div>
      <Card className="card" style={{ width: "50%" }}>
        <CardContent className="data">
          <FormikStepper
            initialValues={{
              firstname: "",
              lastname: "",
              age: "",
              email: "",
              password: "",
              accept: false,
              money: 0,
              description: "",
            }}
            onSubmit={async (values) => {
              await sleep(3000);
              console.log("values", values);
            }}
          >
            <FormikStep
              label="Personal"
              validationSchema={yup.object({
                firstname: yup.string().required().max(13, "Not valid"),
                lastname: yup.string().required().max(13, "Not valid"),
                age: yup
                  .number()
                  .required()
                  .min(18, "Under 18 are not allowed"),
              })}
            >
              <Box>
                <Field
                  fullWidth
                  type="text"
                  name="firstname"
                  component={TextField}
                  label="First Name"
                />
              </Box>
              <Box>
                <Field
                  fullWidth
                  name="lastname"
                  type="text"
                  component={TextField}
                  label="Last Name"
                />
              </Box>
              <Box>
                <Field
                  fullWidth
                  name="age"
                  type="number"
                  component={TextField}
                  label="Age"
                />
              </Box>
            </FormikStep>
            <FormikStep
              label="Account"
              validationSchema={yup.object({
                email: yup.string().email().required(),
                password: yup
                  .string()
                  .required()
                  .min(8, "Must be 8  characters"),
              })}
            >
              <Box>
                <Field
                  type="text"
                  label="Email"
                  name="email"
                  component={TextField}
                />
              </Box>
              <Box>
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  component={TextField}
                />
              </Box>
            </FormikStep>
            <FormikStep label="Financial">
              <Box>
                <Field
                  name="accept"
                  component={CheckboxWithLabel}
                  type="checkbox"
                  Label={{ label: "I am a millionare" }}
                />
              </Box>
              <Box>
                <Field
                  name="money"
                  type="number"
                  label="Money"
                  component={TextField}
                />
              </Box>
              <Box>
                <Field
                  type="text"
                  label="Desciption"
                  name="description"
                  component={TextField}
                />
              </Box>
            </FormikStep>
          </FormikStepper>
        </CardContent>
      </Card>
    </div>
  );
};

//type defined for each step in Form
export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

// A Single step in form that displays on browser
export const FormikStep = ({ children }: FormikStepProps) => {
  return <>{children}</>;
};

//The whole Form that that displays in browser and convert into steps
export const FormikStepper = ({
  children,
  ...props
}: FormikConfig<FormikValues>) => {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];
  const [step, setstep] = useState(0);
  const currentchildren = childrenArray[step];
  console.log(childrenArray.length - 1);
  return (
    <Formik
      {...props}
      validationSchema={currentchildren.props.validationSchema}
      onSubmit={async (values, action) => {
        if (step === childrenArray.length - 1) {
          await props.onSubmit(values, action);
        } else {
          setstep((s) => s + 1);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stepper activeStep={step} alternativeLabel>
            {childrenArray.map((child) => (
              <Step key={child.props.label}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentchildren}
          <br />
          <br />
          {step > 0 ? (
            <Button
              disabled={isSubmitting}
              variant="contained"
              color="primary"
              onClick={() => setstep((s) => s - 1)}
            >
              Back
            </Button>
          ) : null}
          &nbsp; &nbsp;
          <Button
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            variant="contained"
            color="primary"
            type="submit"
          >
            {step === childrenArray.length - 1 ? "Submit" : "Next"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
