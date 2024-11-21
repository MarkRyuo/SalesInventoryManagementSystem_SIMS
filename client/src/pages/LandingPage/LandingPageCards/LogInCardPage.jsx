import { Button } from "react-bootstrap";
import LogInCardPagecss from './LandingPageCards.module.scss' ;
import { Link } from "react-router-dom";

function LogInCardPage() {
    return (
        <div className={LogInCardPagecss.LogInContainer}>

            <div className={LogInCardPagecss.LoginText}>
                <h1>
                    Manage your entire Inventory in a single System
                </h1>
            </div>

            <div className={LogInCardPagecss.LoginFormContainer}>
                <div className={LogInCardPagecss.LoginForm}>
                    <form>
                        <h2>Welcome</h2>
                        <div>
                            <label>Username*</label>
                            <input type="text" placeholder="Enter your username" />
                        </div>
                        <div>
                            <label>Password*</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>
                    </form>

                    <Button variant="" className="">
                        Login
                    </Button>

                    <Link to={"/"}>
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LogInCardPage;
