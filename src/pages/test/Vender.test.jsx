import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Vender from "../Vender";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

  // --- CLON DEL SERVIDOR ---
const mockFetch = vi.fn();
// eslint-disable-next-line no-undef
global.fetch = mockFetch;


  // --- SUBIR FOTOS ---
const subirFotoMock = () => {
  const file = new File(["img"], "foto.jpg", { type: "image/jpeg" });
  const input = document.querySelector('input[type="file"]');
  if (!input) throw new Error("No se encontró el input tipo file en el componente");
  fireEvent.change(input, { target: { files: [file] } });
};

const renderVender = () => render(<MemoryRouter><Vender /></MemoryRouter>);

describe("Vender", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.stubEnv("VITE_API_URL", "http://localhost:3000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // --- RENDERIZADO ---
  it("muestra el título de la página", () => {
    renderVender();
    expect(screen.getByText(/vende tu auto en jaride/i)).toBeInTheDocument();
  });

  it("muestra el botón Publicar auto", () => {
    renderVender();
    expect(screen.getByRole("button", { name: /publicar auto/i })).toBeInTheDocument();
  });

  it("muestra la zona de subida de fotos", () => {
    renderVender();
    expect(screen.getByText(/arrastra tus fotos aquí/i)).toBeInTheDocument();
  });

  it("muestra el input de archivo", () => {
    renderVender();
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it("muestra la categoría seleccionada por defecto", () => {
    renderVender();
    const elementos = screen.getAllByText(/sedanes/i);
    expect(elementos.length).toBeGreaterThan(0);
  });

  // --- FLUJO PUBLICAR ---
  it("muestra alerta si intenta publicar sin fotos", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderVender();

    const boton = screen.getByRole("button", { name: /publicar auto/i });
    await act(async () => {
      await user.click(boton);
    });

    expect(alertMock).toHaveBeenCalledWith("Sube al menos una foto");
  });

  it("muestra mensaje de éxito tras publicar como usuario normal", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("usuarioRol", "user");
    sessionStorage.setItem("usuarioNombre", "Carlos");
    sessionStorage.setItem("usuarioEmail", "carlos@jaride.com");

    mockFetch.mockResolvedValue({
      json: async () => ({ success: true, url: "http://foto.jpg" }),
    });

    renderVender();
    subirFotoMock();

    const boton = screen.getByRole("button", { name: /publicar auto/i });
    await act(async () => {
      await user.click(boton);
    });

    await waitFor(() => {
      expect(screen.getByText(/recibido|administrador lo apruebe/i)).toBeInTheDocument();
    });
  });

  it("muestra mensaje de aprobación automática si el usuario es admin", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("usuarioRol", "admin");
    sessionStorage.setItem("usuarioNombre", "Admin");
    sessionStorage.setItem("usuarioEmail", "admin@jaride.com");

    mockFetch.mockResolvedValue({
      json: async () => ({ success: true, url: "http://foto.jpg" }),
    });

    renderVender();
    subirFotoMock();

    const boton = screen.getByRole("button", { name: /publicar auto/i });
    await act(async () => {
      await user.click(boton);
    });

    await waitFor(() => {
      expect(screen.getByText(/aprobado autom/i)).toBeInTheDocument();
    });
  });

  it("deshabilita el botón mientras se envía la publicación", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("usuarioRol", "user");

    mockFetch.mockResolvedValue({
      json: () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 5000)),
    });

    renderVender();
    subirFotoMock();

    const boton = screen.getByRole("button", { name: /publicar auto/i });
    await act(async () => {
      await user.click(boton);
    });

    expect(boton).toBeDisabled();
  });
});