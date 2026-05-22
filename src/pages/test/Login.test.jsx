import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }) => <>{children}</>,
  GoogleLogin: ({ onSuccess }) => (
    <button data-testid="google-login-btn" onClick={() => onSuccess({ credential: "mock-google-token" })}>
      Google
    </button>
  ),
}));

const mockFetch = vi.fn();
// eslint-disable-next-line no-undef
global.fetch = mockFetch;

describe("Login", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  // --- RENDERIZADO UNIFICADO (Ahorramos 20 líneas de código) ---
  it("renderiza todos los elementos iniciales del formulario", () => {
    render(<Login />);
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ejemplo@jaride.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByTestId("google-login-btn")).toBeInTheDocument();
  });

  // --- FLUJO MANUAL ---
  it("permite escribir en el campo de email", async () => {
    const user = userEvent.setup();
    render(<Login />);
    const input = screen.getByPlaceholderText("ejemplo@jaride.com");
    await user.type(input, "test@jaride.com");
    expect(input).toHaveValue("test@jaride.com");
  });

  const simularSubmit = async (user, email, pass) => {
    render(<Login />);
    await user.type(screen.getByPlaceholderText("ejemplo@jaride.com"), email);
    await user.type(screen.getByPlaceholderText("••••••••"), pass);
    await user.click(screen.getByRole("button", { name: /entrar/i }));
  };

  it("muestra toast de éxito y guarda en localStorage tras login correcto", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, nombre: "Juan", foto: "", rol: "admin", email: "test@jaride.com" }),
    });

    await simularSubmit(user, "test@jaride.com", "password123");

    await waitFor(() => {
      expect(screen.getByText(/sesión iniciada con éxito/i)).toBeInTheDocument();
      expect(localStorage.getItem("estaAutenticado")).toBe("true");
      expect(localStorage.getItem("usuarioNombre")).toBe("Juan");
    });
  });

  it("muestra toast de error si las credenciales son incorrectas", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: false, message: "Credenciales incorrectas" }) });

    await simularSubmit(user, "malo@jaride.com", "wrongpass");

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  it("muestra pantalla 2FA si el servidor lo requiere", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, requiere2FA: true }) });

    await simularSubmit(user, "test@jaride.com", "password123");

    await waitFor(() => {
      expect(screen.getByText(/verificación en dos pasos/i)).toBeInTheDocument();
    });
  });

  // --- FLUJO GOOGLE ---
  it("maneja el éxito y error del inicio de sesión con Google", async () => {
    const user = userEvent.setup();
    
    // Probar Éxito
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, nombre: "Ana", foto: "", rol: "user" }) });
    const { unmount } = render(<Login />);
    await user.click(screen.getByTestId("google-login-btn"));
    await waitFor(() => expect(screen.getByText(/sesión iniciada con google/i)).toBeInTheDocument());

    // Reiniciar y Probar Error de red
    unmount();
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));
    render(<Login />);
    await user.click(screen.getByTestId("google-login-btn"));
    await waitFor(() => expect(screen.getByText(/error al conectar con google/i)).toBeInTheDocument());
  });
});