"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconCheck,
  IconClock,
  IconMail,
  IconRefresh,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import {
  accountService,
  type AccountApprovalRequest,
  type AccountApprovalStatus,
} from "@/lib/commerce/account-service";

function formatSubmittedAt(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function ApprovalStatus({ status }: { status: AccountApprovalStatus }) {
  return (
    <span className={`admin-request__status admin-request__status--${status}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}

export function AdminAccountApproval() {
  const [requests, setRequests] = useState<AccountApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error" | "">("");

  const refreshRequests = useCallback(() => {
    const nextRequests = accountService
      .getAccountRequests()
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

    setRequests(nextRequests);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );
  const approvedRequests = useMemo(
    () => requests.filter((request) => request.status === "approved"),
    [requests],
  );
  const decidedRequests = useMemo(
    () => requests.filter((request) => request.status !== "pending"),
    [requests],
  );

  const handleDecision = (id: string, decision: "approve" | "reject") => {
    const result = decision === "approve"
      ? accountService.approveAccountRequest(id)
      : accountService.rejectAccountRequest(id);

    setFeedback(result.message ?? "The account request has been updated.");
    setFeedbackTone(result.ok ? "success" : "error");
    refreshRequests();
  };

  return (
    <div className="admin-approval">
      <header className="admin-approval__header">
        <p className="admin-eyebrow">ADMIN / PREVIEW</p>
        <h1>Account approval</h1>
        <p>
          Review new customer requests before they can access the PHENO account dashboard.
        </p>
      </header>

      <div className="admin-approval__summary" aria-label="Account approval summary">
        <article className="admin-summary-card">
          <span className="admin-summary-card__icon" aria-hidden="true"><IconClock size={24} stroke={1.6} /></span>
          <div>
            <strong>{pendingRequests.length}</strong>
            <span>Pending requests</span>
          </div>
        </article>
        <article className="admin-summary-card">
          <span className="admin-summary-card__icon" aria-hidden="true"><IconCheck size={24} stroke={1.6} /></span>
          <div>
            <strong>{approvedRequests.length}</strong>
            <span>Approved accounts</span>
          </div>
        </article>
        <article className="admin-summary-card">
          <span className="admin-summary-card__icon" aria-hidden="true"><IconUser size={24} stroke={1.6} /></span>
          <div>
            <strong>{requests.length}</strong>
            <span>Total requests</span>
          </div>
        </article>
      </div>

      <section className="admin-approval__panel" aria-labelledby="pending-accounts-title">
        <header className="admin-approval__panel-header">
          <div>
            <p className="admin-eyebrow">INBOX</p>
            <h2 id="pending-accounts-title">Pending account requests</h2>
          </div>
          <button className="admin-refresh" type="button" onClick={refreshRequests}>
            <IconRefresh size={16} stroke={1.7} aria-hidden="true" />
            Refresh
          </button>
        </header>

        {feedback ? (
          <p className={`admin-approval__feedback admin-approval__feedback--${feedbackTone}`} role={feedbackTone === "error" ? "alert" : "status"}>
            {feedback}
          </p>
        ) : null}

        {isLoading ? (
          <p className="admin-approval__empty">Loading account requests…</p>
        ) : pendingRequests.length === 0 ? (
          <div className="admin-approval__empty">
            <IconCheck size={25} stroke={1.5} aria-hidden="true" />
            <strong>No pending requests</strong>
            <p>New customer registrations will appear here for review.</p>
          </div>
        ) : (
          <div className="admin-request-list">
            {pendingRequests.map((request) => (
              <article className="admin-request" key={request.id}>
                <header className="admin-request__header">
                  <div className="admin-request__identity">
                    <span className="admin-request__avatar" aria-hidden="true"><IconUser size={20} stroke={1.5} /></span>
                    <div>
                      <h3>{request.firstName} {request.lastName}</h3>
                      <a href={`mailto:${request.email}`}><IconMail size={14} stroke={1.6} aria-hidden="true" />{request.email}</a>
                    </div>
                  </div>
                  <ApprovalStatus status={request.status} />
                </header>

                <dl className="admin-request__details">
                  <div>
                    <dt>Phone</dt>
                    <dd>{request.phone || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt>Requested</dt>
                    <dd>{formatSubmittedAt(request.submittedAt)}</dd>
                  </div>
                </dl>

                <div className="admin-request__actions">
                  <button
                    className="admin-request__button admin-request__button--approve"
                    type="button"
                    onClick={() => handleDecision(request.id, "approve")}
                  >
                    <IconCheck size={17} stroke={1.8} aria-hidden="true" />
                    Approve account
                  </button>
                  <button
                    className="admin-request__button admin-request__button--reject"
                    type="button"
                    onClick={() => handleDecision(request.id, "reject")}
                  >
                    <IconX size={17} stroke={1.8} aria-hidden="true" />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {decidedRequests.length > 0 ? (
        <section className="admin-approval__panel admin-approval__panel--history" aria-labelledby="decision-history-title">
          <header className="admin-approval__panel-header">
            <div>
              <p className="admin-eyebrow">HISTORY</p>
              <h2 id="decision-history-title">Recent decisions</h2>
            </div>
          </header>
          <div className="admin-decision-list">
            {decidedRequests.map((request) => (
              <article className="admin-decision" key={request.id}>
                <div>
                  <strong>{request.firstName} {request.lastName}</strong>
                  <span>{request.email}</span>
                </div>
                <ApprovalStatus status={request.status} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <aside className="admin-approval__note">
        <strong>Frontend preview only.</strong>
        Approval requests are stored in this browser until the real authentication and commerce platform are connected.
      </aside>
    </div>
  );
}
