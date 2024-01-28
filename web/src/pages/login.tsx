import React from 'react';

function Login() {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="col-md-4">
                    <div className="text-center mb-4">
                        <img src="logo.png" alt="Logo" style={{ width: "100px" }} /> {/* Replace 'logo.png' with your logo */}
                    </div>
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
