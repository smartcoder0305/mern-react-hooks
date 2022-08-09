import React, { useContext } from "react"
import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css"

const ResetPassword = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const { sendRequest } = useHttpClient()
  const [formState, inputHandler, setFormData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const onResetPassword = async (e) => {
    e.preventDefault()
    await sendRequest(
      "http://localhost:5000/api/users/reset-password",
      "POST",
      JSON.stringify({
        userId: auth.userId,
        password: formState.inputs.password.value,
      }),
      {
        "Content-Type": "application/json",
      }
    ).then(response => {
      navigate("/", { replace: true })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Card className="authentication">
        <form onSubmit={onResetPassword}>
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Enter a valid password, must be at least 6 characters."
              onInput={inputHandler}
            />
            <Button type="submit" inverse disabled={!formState.isValid}>
              Set Password
            </Button>
        </form>
    </Card>
  );
}

export default ResetPassword;