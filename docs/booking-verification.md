# Online booking: Housecall Pro

**Checked November 18, 2026 · Destination verified; office approval pending.**

The [current homepage](https://advancedplumbingsf.com/) uses a button that opens a Housecall Pro dialog rather than an ordinary booking link. That explains why the destination was not apparent in the original page-text audit.

**[Open the existing customer booking page](https://book.housecallpro.com/book/Advanced-Plumbing-and-Drain-Inc/7473192c062a48e8a839d4c07eba026c?v2=true)**

## What was verified

- Clicking **Book online** on the live homepage opened a visible Housecall Pro frame at the URL above. Its document returned **HTTP 200**.
- Opening that same URL directly also returned **HTTP 200** and displayed the company logo, “What can we do for you?”, and three selectable services in a mobile-sized browser without requiring login to see the list.
- **Leak Detection Repair**, **Drain Cleaning**, and **Water Heater Repair** each displayed **$0.00**. This confirms what customers see, **not** that the visit, estimate, or repair is free. The intended meaning is unverified.

[Mobile first-screen capture, 390 × 844](booking-first-screen.png)

## Decision before enabling the link

Ask the office: **“Is this the Housecall Pro account you want customers to use? Each service currently shows $0.00. What should customers see there, and does completing the flow request a visit or confirm an appointment?”**

Have the office correct or clarify the price display if needed and expressly approve the destination. Then arrange an authorized test to verify appointment status, office notification, and customer confirmation. Keep the phone route for emergencies and the general request form for work not listed on this first screen.

Once approved, put the verified HTTPS URL in `content/business.ts` → `schedulerUrl`. Use the existing plain link; the redesign does not need the original widget script. Track a consented `scheduler_click` separately from a completion confirmed by the scheduler.

**Scope:** No service or appointment time was selected, no customer details were entered, and no booking, payment, email test, or account change was initiated. Availability, final price, account ownership, and notification delivery were not tested. The public redesign and its scheduler approval flag were left unchanged.
