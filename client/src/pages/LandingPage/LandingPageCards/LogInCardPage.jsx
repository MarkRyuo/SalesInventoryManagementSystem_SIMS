import { Button } from "react-bootstrap";
import LogInCardPagecss from './LandingPageCards.module.scss' ;
import { Link } from "react-router-dom";

function LogInCardPage() {
    return (
        <div className={LogInCardPagecss.LogInContainer}>

            <div className={LogInCardPagecss.LoginText}>
                <h1>
                    Manage your entire inventory in a single system
                </h1>
            </div>

            <div className={LogInCardPagecss.LoginFormContainer}>
                <div className={LogInCardPagecss.LoginForm}>
                    <form>
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

                    <Link to={''}>

                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LogInCardPage;
