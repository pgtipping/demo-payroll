import React from "react";
import {
  render,
  screen,
  waitFor,
  testAccessibility,
} from "@/lib/utils/test-utils";
import PayslipsPage from "../page";

// Mock data
const mockPayslipsData = {
  payslips: [
    {
      id: "1",
      month: "March 2024",
      grossPay: 5000,
      deductions: 1000,
      netPay: 4000,
      status: "Paid",
      paidOn: "2024-03-15",
    },
  ],
  ytdSummary: {
    totalEarnings: 15000,
    totalDeductions: 3000,
    netIncome: 12000,
  },
};

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve(new Response(JSON.stringify(mockPayslipsData)))
);

describe("PayslipsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes accessibility checks", async () => {
    await testAccessibility(<PayslipsPage />);
  });

  it("renders loading state initially", () => {
    render(<PayslipsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders payslips after loading", async () => {
    render(<PayslipsPage />);

    await waitFor(() => {
      expect(screen.getByText("March 2024")).toBeInTheDocument();
    });

    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
    expect(screen.getByText("-$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("$4,000.00")).toBeInTheDocument();
  });

  it("renders year-to-date summary", async () => {
    render(<PayslipsPage />);

    await waitFor(() => {
      expect(screen.getByText("Year-to-Date Summary")).toBeInTheDocument();
    });

    expect(screen.getByText("$15,000.00")).toBeInTheDocument();
    expect(screen.getByText("$3,000.00")).toBeInTheDocument();
    expect(screen.getByText("$12,000.00")).toBeInTheDocument();
  });

  it("handles download all functionality", async () => {
    const { user } = render(<PayslipsPage />);

    await waitFor(() => {
      expect(screen.getByText("Download All")).toBeInTheDocument();
    });

    const downloadButton = screen.getByText("Download All");
    await user.click(downloadButton);

    expect(screen.getByText("Downloading...")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<PayslipsPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load payslips/i)).toBeInTheDocument();
    });
  });
});
