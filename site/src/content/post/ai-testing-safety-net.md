---
title: "The Safety Net: Why E2E Tests Matter More When AI Writes Your Code"
date: "2026-02-05"
category: "automation"
description: "When people's paychecks depend on your AI-generated code, Playwright tests become essential. Here's how E2E testing saved EVM in production."
tags:
  - "python"
  - "testing"
  - "ai"
---

Last week, I asked Claude Code to add a new field to the leave request form in Equestrian Venue Manager. "Add a notes field so staff can explain why they need time off."

Claude Code updated the Pydantic model. Modified the SQLAlchemy schema. Added the field to the form. Generated an Alembic migration. Updated the API endpoint. Everything looked good.

I deployed it. The leave request form loaded. Staff could add notes. Perfect.

Except I broke the leave approval workflow. Completely. Managers couldn't approve requests anymore - the approval button did nothing. The JavaScript event handler was looking for form data that no longer existed because Claude Code had refactored the form structure.

I discovered this three hours later when a manager texted: "I can't approve Alice's holiday request. She's booked flights. Help."

This is the problem with AI-assisted development in production: **changes cascade in unexpected ways**. And when people's paychecks depend on your code, "oops, didn't catch that" isn't acceptable.

## The Illusion of Correctness

Here's what happened with that leave request change:

**What I asked for**: Add a notes field
**What got changed**:
- Database model (added column)
- API endpoint (new field validation)
- Form template (new textarea)
- Form submission (restructured data format)
- **JavaScript handler (broke existing event listener)**

The last one was invisible. The code compiled. The tests I had written passed (they only tested the API, not the full workflow). The form submitted successfully. But the approval flow silently broke because the client-side JavaScript expected data in the old format.

Traditional development? I might have caught this because I'd be manually changing each file, thinking through dependencies. With AI-assisted development, Claude Code changed five files in seconds. I reviewed the diff, saw that each change made sense individually, and approved it.

The **integration failure** wasn't visible in the diff. It only appeared when a user tried to approve a request.

This is the AI development paradox: changes happen faster, but **breaking changes are harder to spot**.

## The User's Perspective

After the leave approval incident, I realized my testing strategy was wrong.

I had unit tests. They verified individual functions worked correctly. API endpoints returned the right status codes. Database queries executed. Alembic migrations applied cleanly. All good.

But I didn't have tests that answered: **"Can a manager approve a leave request?"**

Not "does the API endpoint accept a POST request with the right fields." Not "does the database update when you call the approval function." But literally: **Can a user open the leave approval page, click the approve button, and have it work?**

That's what E2E tests do. They test from the user's perspective. Not "does this function work?" but "does this workflow work?"

When AI generates code that touches multiple files across backend, frontend, and database, unit tests aren't enough. You need tests that verify **the whole system still does what users expect**.

## Enter Playwright

I added Playwright for E2E testing. Not to replace unit tests - to complement them.

Here's the test that would have caught the leave approval bug:

```python
def test_manager_can_approve_leave_request(page: Page):
    # Login as manager
    page.goto("/login")
    page.fill("#username", "manager@test.com")
    page.fill("#password", "password")
    page.click("#login-button")

    # Navigate to leave requests
    page.goto("/leave/requests")

    # Find pending request and approve it
    page.locator(".leave-request").first.click()
    page.click("#approve-button")

    # Verify approval succeeded
    expect(page.locator(".success-message")).to_be_visible()
    expect(page.locator("#leave-status")).to_have_text("Approved")
```

This test doesn't care about API internals. It doesn't care about database schemas. It does what a manager does: login, navigate, click approve, verify success.

If Claude Code changes the form structure and breaks the JavaScript handler, **this test fails**. Because it's testing the behavior users depend on, not the implementation details.

## The Testing Pyramid for AI-Assisted Development

Traditional testing pyramid: lots of unit tests, some integration tests, few E2E tests.

**AI-assisted development testing pyramid**: still lots of unit tests, but **E2E tests become critical**.

Why? Because AI changes are:
1. **Fast** - multiple files modified simultaneously
2. **Comprehensive** - touches frontend, backend, database
3. **Subtle** - can break integration points you didn't think about

Unit tests verify pieces work. E2E tests verify **pieces still work together** after AI refactoring.

Here's what I test with Playwright in EVM:

**Critical User Workflows:**
- Staff can clock in/out for timesheets
- Managers can approve leave requests
- Admins can generate payroll exports
- Livery owners can request services
- Staff can view their holiday balance

**Not Implementation Details:**
- API response formats
- Database query structures
- Form field names

If a user workflow breaks, Playwright catches it. Before deployment. Before real users see it.

## The CI Pipeline That Caught Everything

The leave approval bug made me rethink the entire deployment pipeline. Now, GitHub Actions runs this sequence on every push:

### 1. Unit Tests (Parallel)
```yaml
- name: Run Backend Tests
  run: pytest backend/tests --cov

- name: Run Frontend Tests
  run: pytest frontend/tests --cov
```

Fast feedback. Verify individual functions work. Takes 2 minutes.

### 2. Build Container Images
```yaml
- name: Build Images
  run: |
    docker build -t evm-backend:test ./backend
    docker build -t evm-frontend:test ./frontend
```

Ensure the code actually builds. Catches dependency issues. Takes 3 minutes.

### 3. Start Full Stack
```yaml
- name: Start Services
  run: docker compose up -d

- name: Wait for Health Checks
  run: ./scripts/wait-for-healthy.sh
```

Spin up the full application: database, cache, backend, frontend. Exactly like production. Takes 30 seconds.

### 4. Run E2E Tests
```yaml
- name: Run Playwright Tests
  run: playwright test --workers=4
```

Test critical user workflows against the running application. This is where integration failures appear. Takes 5 minutes.

### 5. Push Images (if all tests pass)
```yaml
- name: Push to GHCR
  if: success()
  run: |
    docker push ghcr.io/user/evm-backend:latest
    docker push ghcr.io/user/evm-frontend:latest
```

Only push images if **everything** passes. Unit tests, builds, E2E tests.

**Total time**: ~12 minutes. Cost of catching the leave approval bug before production: **$0**. Cost of breaking payroll because approvals didn't work: **priceless**.

## Alembic Migrations: The Unsung Hero

While we're talking about safety nets, Alembic database migrations deserve mention. They've been game-changing for EVM.

**Before Alembic**: "I need to add a column. Let me write SQL. Hope I don't typo. Hope I remember to run it in production."

**With Alembic**: Claude Code generates migrations automatically. They're versioned. Tested in CI. Applied automatically on deployment.

Example: adding the leave request notes field.

```python
# Claude Code generated this migration
def upgrade():
    op.add_column('leave_requests',
        sa.Column('notes', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('leave_requests', 'notes')
```

The migration is **code**. It's in git. It's reviewed. It's tested. And critically: **it's reversible**. If the deployment breaks, `alembic downgrade` rolls back the schema change.

When AI is changing your database schema, having **versioned, tested, reversible migrations** is essential. You can't just `ALTER TABLE` manually and hope it works.

## What Production Taught Me

EVM has been in production for a month. Real users. Real timesheets. Real paychecks calculated from those timesheets. Here's what that month taught me about AI-assisted development:

### 1. AI Code Gen is Fast, But Consequences Are Also Fast

Claude Code can refactor an entire feature in minutes. If that refactoring breaks something, **users discover it immediately**. E2E tests are your early warning system.

### 2. "It Compiles" Doesn't Mean "It Works"

Type checking catches syntax errors. Unit tests catch logic errors. Only E2E tests catch **integration errors** - when pieces that individually work don't work together.

### 3. The User's Perspective is Truth

You can have 100% unit test coverage and still ship broken features. If the E2E test for "manager approves leave request" passes, **that workflow works**. If it fails, it's broken. Simple.

### 4. CI Pipeline = Confidence

The 12-minute CI pipeline means I can deploy EVM changes without anxiety. If CI passes, it works. If CI fails, something broke, and I know before users do.

### 5. Database Migrations Need the Same Rigor as Code

Alembic migrations are code. They need tests. They need review. They need CI. Treating schema changes as scripts you run manually is asking for production disasters.

## The Practical Result

Since adding Playwright E2E tests and the full CI pipeline, I've:

**Caught Before Production:**
- 3 broken form submissions
- 2 authentication redirect loops
- 1 payroll calculation error
- The leave approval bug that started this story
- Countless integration failures

**Deployed to Production:**
- 15+ feature additions
- Dozens of bug fixes
- Multiple database schema changes
- Zero user-reported breakages

The yard owners don't know about Playwright. They don't care about CI pipelines. They know that **EVM works**. Timesheets calculate correctly. Leave requests get approved. Payroll exports every month. That's all that matters.

But I know why it works: because E2E tests catch what unit tests miss. Because the CI pipeline ensures every change is tested the same way, every time. Because Alembic makes database changes safe and reversible.

## The Cost of Not Testing

That leave approval bug? Three hours of broken functionality before I noticed. One frustrated manager. One stressed staff member worried about booked flights. One emergency fix deployed outside normal hours.

Total impact: low, because I caught it fast and fixed it fast. But imagine if payroll had been broken instead. Or if timesheets hadn't recorded hours correctly. Or if the entire leave system had crashed on Friday afternoon before a holiday weekend.

**When people's livelihoods depend on your code, "move fast and break things" isn't an option.** But "move slowly and test manually" kills productivity.

E2E tests + CI pipelines let you **move fast and break nothing**. Or at least, break nothing that reaches users.

## What This Means for AI-Assisted Development

AI makes writing code faster. That's transformative. But it also makes **breaking code** faster.

Traditional development: you change one file, you know what might break. AI development: Claude Code changes five files, and the breaking change might be in file six that you didn't touch.

The solution isn't to stop using AI. The solution is to **test differently**.

**Unit tests** verify pieces work individually.
**E2E tests** verify pieces work together after AI refactoring.
**CI pipelines** ensure every change gets both.
**Alembic migrations** make database changes as safe as code changes.

Together, they form a safety net. When Claude Code generates a change that cascades unexpectedly, the tests catch it. Before production. Before users. Before paychecks are affected.

## The Bottom Line

I asked Claude Code to add a notes field to a form. It broke the approval workflow. Playwright tests now catch that before deployment. That's the story.

But the **lesson** is bigger: AI-assisted development is incredibly powerful, and that power comes with responsibility. When you're moving 10x faster, you need safety nets that work at 10x speed too.

E2E tests aren't optional anymore. They're **essential**. Not just for peace of mind - for **production confidence**.

EVM processes real payroll. For real people. Who have rent and mortgages and bills. The stakes are real. The testing has to be too.

Playwright + CI + Alembic = the safety net that makes AI-assisted development safe in production. That's not theory. That's lived experience from the past month.

And when that manager texts "I can't approve this leave request," I can confidently reply: "That should work - let me check if it's a browser issue" instead of panicking about what Claude Code might have accidentally broken.

That confidence is worth the 12-minute CI pipeline. Every single time.

---

**Technical notes:**
- **Playwright**: E2E testing framework for web applications
- **Alembic**: Database migration tool for SQLAlchemy
- **GitHub Actions**: CI/CD platform for automated testing and deployment
- **Test coverage**: Unit tests (~85%), E2E tests (critical workflows only)
- **CI time**: ~12 minutes per push
- **Deployment confidence**: High enough to ship daily

The code is tested. The workflows are verified. The users are happy. That's what matters.
