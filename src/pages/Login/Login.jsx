import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signup } from "../../firebase";

const Login = () => {
    const [signState, setSignState] = useState("Sign In");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const user_auth = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            if (signState === "Sign In") {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login fade-in">
            <img src={logo} className="login-logo" alt="Netflix Logo" onClick={() => window.location.href = '/'} />
            
            <div className="login-form-container">
                <div className="login-form scale-in">
                    <h1>{signState}</h1>
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={user_auth}>
                        {signState === "Sign Up" && (
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span 
                                className="password-toggle" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? <div className="btn-loader"></div> : signState}
                        </button>

                        <div className="form-help">
                            <label className="remember">
                                <input type="checkbox" />
                                <span>Remember Me</span>
                            </label>
                            <p>Need Help?</p>
                        </div>
                    </form>

                    <div className="form-switch">
                        {signState === "Sign In" ? (
                            <p>
                                New to Netflix?{" "}
                                <span onClick={() => setSignState("Sign Up")}>
                                    Sign Up Now
                                </span>
                            </p>
                        ) : (
                            <p>
                                Already have Account?{" "}
                                <span onClick={() => setSignState("Sign In")}>
                                    Sign In Now
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <footer className="login-footer">
                <div className="footer-content">
                    <p>Questions? Contact us.</p>
                    <div className="footer-links">
                        <a href="#">FAQ</a>
                        <a href="#">Help Center</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Privacy</a>
                        <a href="#">Cookie Preferences</a>
                        <a href="#">Corporate Information</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
