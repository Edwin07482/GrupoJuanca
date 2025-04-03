import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importar Link
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQHj26rrEEHI0ffSYsEFCdhKdi7MGUJ1E",
  authDomain: "registrousuario-6c46e.firebaseapp.com",
  projectId: "registrousuario-6c46e",
  storageBucket: "registrousuario-6c46e.firebasestorage.app",
  messagingSenderId: "799110280998",
  appId: "1:799110280998:web:5c69d6d5651008253ff3e7",
  measurementId: "G-T3695TLVS6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "",
    acceptTerms: false,
    receiveEmails: false,
  });

  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const isFormValid =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 6 &&
      formData.birthdate !== "" &&
      formData.gender !== "" &&
      formData.acceptTerms; // Se debe aceptar los términos
    setIsValid(isFormValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify(formData));
      setRegistered(true);
      setLoading(false);
      navigate("/profile");
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setFormData({
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email,
        password: "",
        birthdate: "",
        gender: "",
        acceptTerms: false,
        receiveEmails: false,
      });
      setRegistered(true);
      navigate("/profile");
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      alert(
        "Error al iniciar sesión con Google. Revisa la consola para más detalles."
      );
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="left-section">
          <h1>SALAZAR</h1>
          <p>
            "Tu próximo gran paso comienza aquí. ¿Buscas empleo o necesitas
            talento? Lo tenemos todo, Unete ahora mismo."
          </p>
        </div>
        <div className="right-section">
          <div className="card">
            <h2>REGÍSTRATE</h2>
            {registered && (
              <div className="success-message">
                🎉 ¡Registro exitoso, {formData.firstName}! 🎉
              </div>
            )}
            <form onSubmit={handleSubmit} className="form">
              <div className="name-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Nueva contraseña (mín. 6 caracteres)"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
                max="2007-01-01"
              />
              <label>Género:</label>
              <div className="gender-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    required
                  />{" "}
                  Hombre
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    required
                  />{" "}
                  Mujer
                </label>
              </div>

              {/* Checkboxes */}
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="receiveEmails"
                    checked={formData.receiveEmails}
                    onChange={handleChange}
                  />
                  Envíame correos electrónicos con consejos sobre cómo encontrar
                  talento que se ajuste a mis necesidades.
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                  />
                  Sí, comprendo y acepto los{" "}
                  <Link to="/terms" className="terms-link">
                    términos de FIXTER
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={!isValid || loading}
              >
                {loading ? "Registrando..." : "Registrarte"}
              </button>
            </form>
            <button
              className="btn"
              onClick={handleGoogleSignIn}
              style={{ backgroundColor: "#db4437", marginTop: "10px" }}
            >
              Iniciar sesión con Google
            </button>
            <p className="login-link">
              ¿Ya tienes cuenta? <Link to="/Login">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
