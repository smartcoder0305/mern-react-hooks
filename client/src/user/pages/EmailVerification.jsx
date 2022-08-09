import React, { useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_EMAIL } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";

const EmailVerification = () => {
    const [ alert, setAlert ] = useState("");
    const { sendRequest } = useHttpClient();
    const [ formState, inputHandler, setFormData ] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
        },
        false
    );
    const onSendEmail = async (e) => {
        e.preventDefault()
        setAlert("")
        sendRequest(
            "http://localhost:5000/api/users/email-verification",
            "POST",
            JSON.stringify({
                email: formState.inputs.email.value,
            }),
            {
                "Content-Type": "application/json",
            }
        ).then(response => {
            setAlert(response)
        }).catch(error => {
            setAlert("Oops! Something went Wrong.")
            console.log(error)
        })
    }
    return (
        <Card className="authentication">
            <form onSubmit={onSendEmail}>
                <Input 
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Enter a valid email address."
                    onInput={inputHandler}
                />
                <Button type="submit" inverse disabled={!formState.isValid}>
                <b>{alert ? "Resend" : "Send"}</b>
                </Button>
                {alert &&
                    <p>{alert}</p>
                }
            </form>
        </Card>
    );
}

export default EmailVerification;