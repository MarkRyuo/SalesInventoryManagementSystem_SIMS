import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Alert, Button, Container, InputGroup } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "./UserAuthContext";

const PhoneSignUp = () => {
    const [error, setError] = useState("");
    const [number, setNumber] = useState("");
    const [flag, setFlag] = useState(false);
    const [otp, setOtp] = useState("");
    const [result, setResult] = useState("");
    const { setUpRecaptha } = useUserAuth();
    const navigate = useNavigate();

    const getOtp = async () => {
        setError("");
        if (number === "" || number === undefined) {
            return setError("Please enter a valid phone number!");
        }
        try {
            const response = await setUpRecaptha(number);
            setResult(response);
            setFlag(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const verifyOtp = async () => {
        setError("");
        if (otp === "" || otp === null) return;
        try {
            await result.confirm(otp);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="p-4 box shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="mb-3 text-center">Firebase Phone Auth</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Phone Number Input Section */}
                {!flag && (
                    <>
                        <Form.Group className="mb-3" controlId="formPhoneNumber">
                            <InputGroup>
                                <PhoneInput
                                    defaultCountry="IN"
                                    value={number}
                                    onChange={setNumber}
                                    placeholder="Enter Phone Number"
                                    className="form-control"
                                />
                            </InputGroup>
                            <div id="recaptcha-container"></div>
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="primary" onClick={getOtp}>
                                Send OTP
                            </Button>
                        </div>
                    </>
                )}

                {/* OTP Verification Section */}
                {flag && (
                    <>
                        <Form.Group className="mb-3" controlId="formOtp">
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="primary" onClick={verifyOtp}>
                                Verify OTP
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Container>
    );
};

export default PhoneSignUp;
