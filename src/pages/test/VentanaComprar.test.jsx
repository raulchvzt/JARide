import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import VentanaComprar from "../VentanaComprar";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../components/ImageUploader", () => ({
  default: ({ setPhotos }) => (
    <button
      data-testid="mock-uploader"
      onClick={() => setPhotos([{ file: new File(["img"], "foto.jpg", { type: "image/jpeg" }) }])}
    >
      Subir foto
    </button>
  ),
}));

const mockFetch = vi.fn();
// eslint-disable-next-line no-undef
global.fetch = mockFetch;

const autosMock = [
  {
    id: 1, marca: "Toyota", modelo: "Corolla", precio: "15,000",
    anio: 2020, km: "30000", combustible: "Gasolina",
    verificado: false, categoria: "Sedanes", estado: "aprobado",
    photos: ["http://foto1.jpg"],
  },
  {
    id: 2, marca: "Ford", modelo: "Ranger", precio: "25,000",
    anio: 2021, km: "15000", combustible: "Diesel",
    verificado: false, category: "PickUps", estado: "aprobado",
    photos: ["http://foto2.jpg"],
  },
  {
    id: 3, marca: "Honda", modelo: "Civic", precio: "18,000",
    anio: 2019, km: "45000", combustible: "Gasolina",
    verificado: false, categoria: "Sedanes", estado: "pendiente",
    photos: [],
  },
];

const renderComprar = () => 
    render(<MemoryRouter>
        <VentanaComprar />
        </MemoryRouter>);

describe("VentanaComprar", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ json: async () => autosMock });
  });

  // --- RENDERIZADO  ---
  it("muestra el título principal", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByText(/autos para cada/i)).toBeInTheDocument();
    });
  });

  it("muestra el buscador", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/qué auto buscas/i)).toBeInTheDocument();
    });
  });

  it("muestra el botón de buscar", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
    });
  });

  it("muestra los filtros de categoría", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByText("SUVs")).toBeInTheDocument();
      expect(screen.getByText("Sedanes")).toBeInTheDocument();
      expect(screen.getByText("PickUps")).toBeInTheDocument();
    });
  });

  // --- CARGA DE AUTOS ---
  it("carga y muestra los autos aprobados desde la API", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByText("Corolla")).toBeInTheDocument();
      expect(screen.getByText("Ranger")).toBeInTheDocument();
    });
  });

  it("no muestra autos con estado pendiente", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.queryByText("Civic")).not.toBeInTheDocument();
    });
  });

  it("muestra el contador de autos disponibles", async () => {
    renderComprar();
    await waitFor(() => {
      expect(screen.getByText(/catálogo disponible \(2\)/i)).toBeInTheDocument();
    });
  });

  // --- BUSCADOR ---
  it("filtra autos al escribir en el buscador", async () => {
    const user = userEvent.setup();
    renderComprar();
    await waitFor(() => screen.getByText("Corolla"));

    await user.type(screen.getByPlaceholderText(/qué auto buscas/i), "ranger");

    await waitFor(() => {
      expect(screen.getByText("Ranger")).toBeInTheDocument();
      expect(screen.queryByText("Corolla")).not.toBeInTheDocument();
    });
  });

});