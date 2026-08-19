"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, Button, FieldLabel, Input, Select } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirm_password") ?? "");
    const terms = form.get("terms");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!terms) {
      setError("You must accept the terms to create an account.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.get("full_name"),
        email: form.get("email"),
        password,
        account_type: form.get("account_type"),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Join SmartLib to save resources and get recommendations.</p>

        {error && (
          <div className="mt-4">
            <Alert tone="danger">{error}</Alert>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="full_name">Full name</FieldLabel>
            <Input id="full_name" name="full_name" required maxLength={100} placeholder="Jane Doe" />
          </div>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </div>
          <div>
            <FieldLabel htmlFor="account_type">Account type</FieldLabel>
            <Select id="account_type" name="account_type" defaultValue="student" required>
              <option value="student">Student</option>
              <option value="researcher">Researcher</option>
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
          </div>
          <div>
            <FieldLabel htmlFor="confirm_password">Confirm password</FieldLabel>
            <Input id="confirm_password" name="confirm_password" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" name="terms" className="mt-0.5 rounded border-border" />
            I agree to the terms of use and acknowledge this is a training demo with synthetic data.
          </label>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
