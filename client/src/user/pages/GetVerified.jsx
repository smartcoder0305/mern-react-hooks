import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const GetVerified = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const { userId, token } = useParams();
  const navigate = useNavigate()
  useEffect(() => {
    sendRequest(
        `http://localhost:5000/api/users/email-verify/${userId}/${token}`,
        "GET",
    ).then(response => {
      auth.login(response.userId, response.token)
      navigate("/reset-password", { replace: true })
    }).catch(error => {
      console.log(error)
    })
  }, []);
  return null;
}

export default GetVerified;