import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Vender from "../Vender";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";

const mockFetch = vi.fn();
// eslint-disable-next-line no-undef
global.fetch = mockFetch;

// Helper que simula tener fotos cargadas en el estado
// Se hace hackeando el input de archivo oculto
const subirFotoMock = async () => {
  const file = new File(["img"], "foto.jpg", { type: "image/jpeg" });
  const input = document.querySelector('input[type="file"]');
  fireEvent.change(input, { target: { files: [file] } });
};

const renderVender = () => render(<MemoryRouter><Vender /></MemoryRouter>);

describe("Vender", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
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
    // Hay múltiples elementos con "Sedanes", usamos getAllByText
    const elementos = screen.getAllByText(/sedanes/i);
    expect(elementos.length).toBeGreaterThan(0);
  });

  // --- FLUJO PUBLICAR ---
  it("muestra alerta si intenta publicar sin fotos", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderVender();
    await user.click(screen.getByRole("button", { name: /publicar auto/i }));
    expect(alertMock).toHaveBeenCalledWith("Sube al menos una foto");
    alertMock.mockRestore();
  });

  it("muestra mensaje de éxito tras publicar como usuario normal", async () => {
    const user = userEvent.setup();
    localStorage.setItem("usuarioRol", "user");
    localStorage.setItem("usuarioNombre", "Carlos");
    localStorage.setItem("usuarioEmail", "carlos@jaride.com");

    mockFetch
      .mockResolvedValueOnce({ json: async () => ({ success: true, url: "http://foto.jpg" }) })
      .mockResolvedValueOnce({ json: async () => ({ success: true }) });

    renderVender();
    await subirFotoMock();
    await user.click(screen.getByRole("button", { name: /publicar auto/i }));

    await waitFor(() => {
      expect(screen.getByText(/tu auto será publicado/i)).toBeInTheDocument();
    });
  });

  it("muestra mensaje de aprobación automática si el usuario es admin", async () => {
    const user = userEvent.setup();
    localStorage.setItem("usuarioRol", "admin");
    localStorage.setItem("usuarioNombre", "Admin");
    localStorage.setItem("usuarioEmail", "admin@jaride.com");

    mockFetch
      .mockResolvedValueOnce({ json: async () => ({ success: true, url: "http://foto.jpg" }) })
      .mockResolvedValueOnce({ json: async () => ({ success: true }) });

    renderVender();
    await subirFotoMock();
    await user.click(screen.getByRole("button", { name: /publicar auto/i }));

    await waitFor(() => {
      expect(screen.getByText(/aprobado automáticamente/i)).toBeInTheDocument();
    });
  });



  it("deshabilita el botón mientras se envía la publicación", async () => {
    const user = userEvent.setup();
    localStorage.setItem("usuarioRol", "user");
    mockFetch.mockImplementation(() => new Promise(() => {})); // nunca resuelve

    renderVender();
    await subirFotoMock();
    await user.click(screen.getByRole("button", { name: /publicar auto/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
    });
  });
});