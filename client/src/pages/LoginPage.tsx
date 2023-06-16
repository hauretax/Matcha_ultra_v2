import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import {Bport} from "../../../comon_src/constant";


function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username") as string;
    let password = formData.get("password") as string;

    auth.signin(username, password, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don"t create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won"t end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true })
    });
  }

  function handleClick() {
    axios.post('http://localhost:'+Bport+'/api/profile/login')
    .then(response => {
      // Handle success
      console.log(response.data);
    })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  }

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{" "}
        <label>
          Password: <input name="password" type="password" />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleClick}>TEST</button>
    </div>
  );
}

export default LoginPage