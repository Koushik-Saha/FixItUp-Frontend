/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAuth } from "@/hooks/useAuth";

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("SignupPage", () => {
    const mockRegister = vi.fn();
    const mockInit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: null,
            register: mockRegister,
            isLoading: false,
            init: mockInit,
        });
    });

    it("renders signup form", () => {
        render(<SignupPage />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it("shows validation errors on empty submit", async () => {
        render(<SignupPage />);

        fireEvent.click(screen.getByRole("button", { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it("shows error when passwords do not match", async () => {
        render(<SignupPage />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password456" } });

        fireEvent.click(screen.getByRole("button", { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it("calls register with correct data when form is valid", async () => {
        render(<SignupPage />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /create account/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                full_name: "John Doe",
                email: "john@example.com",
                phone: undefined,
                password: "password123",
            });
        });
    });
});
