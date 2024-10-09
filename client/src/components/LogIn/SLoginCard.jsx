

//* Child
function SLoginCard() {
    return (
        <>
            <Form>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Email or Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Email or Username'
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                    />
                </FloatingLabel>

                {/* Button of Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    onClick={handleLogin}
                    size='lg'>
                    Login
                </Button>
            </Form>
        </>
    )
}

export default SLoginCard ;
