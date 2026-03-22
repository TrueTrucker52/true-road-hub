import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "./Contact";

const trackContactSubmissionMock = vi.fn();

vi.mock("@/components/Navbar", () => ({
  default: () => <div data-testid="navbar" />,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/lib/trackContactSubmission", () => ({
  trackContactSubmission: (...args: unknown[]) => trackContactSubmissionMock(...args),
}));

const renderContactPage = () =>
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );

describe("Contact page forms", () => {
  beforeEach(() => {
    trackContactSubmissionMock.mockReset();

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  it("targets general contact fields by visible labels with distinct semantics", () => {
    renderContactPage();

    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email Address");
    const messageInput = screen.getByLabelText("Message");

    expect(nameInput).toHaveAttribute("name", "generalName");
    expect(nameInput).toHaveAttribute("autocomplete", "section-general name");
    expect(emailInput).toHaveAttribute("name", "generalEmail");
    expect(emailInput).toHaveAttribute("autocomplete", "section-general email");
    expect(messageInput).toHaveAttribute("name", "generalMessage");
  });

  it("shows the general contact confirmation after a valid submit", () => {
    renderContactPage();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Alex Driver" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Interested in working together." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    expect(trackContactSubmissionMock).toHaveBeenCalledWith("general");
    expect(
      screen.getByText(/your email app should open next so you can send your message directly to george/i),
    ).toBeInTheDocument();
  });

  it("blocks general contact submit for invalid email and missing message", () => {
    renderContactPage();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Alex Driver" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    expect(trackContactSubmissionMock).not.toHaveBeenCalled();
    expect(screen.getByText(/please complete all fields before sending your message/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Need more information." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    expect(trackContactSubmissionMock).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it("targets brand inquiry fields by visible labels with section-specific autocomplete", () => {
    renderContactPage();

    const companyInput = screen.getByLabelText("Company Name");
    const contactInput = screen.getByLabelText("Contact Name");
    const emailInput = screen.getByLabelText("Contact Email");
    const budgetSelect = screen.getByLabelText("Budget Range");
    const detailsInput = screen.getByLabelText("Campaign Details");

    expect(companyInput).toHaveAttribute("name", "brandCompany");
    expect(companyInput).toHaveAttribute("autocomplete", "section-brand organization");
    expect(contactInput).toHaveAttribute("name", "brandContactName");
    expect(contactInput).toHaveAttribute("autocomplete", "section-brand name");
    expect(emailInput).toHaveAttribute("name", "brandEmail");
    expect(emailInput).toHaveAttribute("autocomplete", "section-brand email");
    expect(budgetSelect).toHaveAttribute("name", "brandBudget");
    expect(detailsInput).toHaveAttribute("name", "brandCampaignDetails");
  });

  it("shows the brand inquiry confirmation after submit with the selected budget tier", () => {
    renderContactPage();

    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Roadline Partners" },
    });
    fireEvent.change(screen.getByLabelText("Contact Name"), {
      target: { value: "Morgan Lee" },
    });
    fireEvent.change(screen.getByLabelText("Contact Email"), {
      target: { value: "morgan@roadline.com" },
    });
    fireEvent.change(screen.getByLabelText("Budget Range"), {
      target: { value: "$5,000 - $10,000" },
    });
    fireEvent.change(screen.getByLabelText("Campaign Details"), {
      target: { value: "Need a sponsored integration for owner-operators this quarter." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit Brand Deal Inquiry" }));

    expect(trackContactSubmissionMock).toHaveBeenCalledWith("brand_deal", "$5,000 - $10,000");
    expect(
      screen.getByText(/your email app should open next so you can send the sponsorship inquiry directly to george/i),
    ).toBeInTheDocument();
  });

  it("blocks brand inquiry submit for missing details and invalid email", () => {
    renderContactPage();

    fireEvent.change(screen.getByLabelText("Company Name"), {
      target: { value: "Roadline Partners" },
    });
    fireEvent.change(screen.getByLabelText("Contact Name"), {
      target: { value: "Morgan Lee" },
    });
    fireEvent.change(screen.getByLabelText("Budget Range"), {
      target: { value: "$1,000 - $5,000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit Brand Deal Inquiry" }));

    expect(trackContactSubmissionMock).not.toHaveBeenCalled();
    expect(screen.getByText(/please complete all fields before sending your inquiry/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Contact Email"), {
      target: { value: "bad-email" },
    });
    fireEvent.change(screen.getByLabelText("Campaign Details"), {
      target: { value: "Owner-operator sponsorship test." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit Brand Deal Inquiry" }));

    expect(trackContactSubmissionMock).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter a valid contact email address/i)).toBeInTheDocument();
  });
});