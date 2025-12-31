# Cloud Bucket List

*A cloud-native, serverless system built to study data ownership, authentication boundaries, deployment determinism, and how real-world failures propagate across managed cloud infrastructure.*

---


## Problem Statement

Even simple personal data systems hide significant complexity once they move beyond local state.

Questions such as:
- Who owns the data?
- How is access enforced across services?
- What fails when permissions or environments drift?
- How do deployment and dependency decisions affect system reliability?

are often ignored in beginner projects.

This project uses a deliberately simple product surface—a personal bucket list with optional images—to explore **real production concerns**: authentication boundaries, authorization enforcement, cloud storage permissions, CI/CD failures, and infrastructure-driven behavior.

The goal was not to build features, but to **understand how cloud-native systems behave under real constraints**.

---


## Design Goals

1. **Enforce ownership at the infrastructure level**  
   All access control is enforced by managed cloud services—not frontend logic.

2. **Decouple identity, API logic, and storage**  
   Authentication, data access, and file storage are isolated layers to expose boundary failures.

3. **Prefer managed services over custom abstractions**  
   Security, scalability, and correctness are enforced through configuration and policy.

4. **Design for failure visibility**  
   The system intentionally surfaces misconfigurations, CI failures, and environment drift.

5. **Keep the product surface minimal**  
   UI simplicity ensures focus remains on backend behavior and system design.

6. **Treat deployment as part of the system**  
   CI/CD, reproducibility, and environment alignment are first-class concerns.

---


## System Architecture

### High-Level Flow

1. React frontend hosted on **AWS Amplify**
2. Authentication via **Amazon Cognito**
3. Requests handled by **AWS AppSync (GraphQL)**
4. Structured data stored in **DynamoDB**
5. Images stored in **Amazon S3** with identity-based access
6. Infrastructure provisioned via **Amplify CLI**

Each component is isolated, explicitly permissioned, and independently scalable.

---

### Component Overview

**Frontend (React + Amplify Hosting)**  
Static client with no credentials or direct backend access. CI/CD integrated via GitHub.

**Authentication (Amazon Cognito)**  
Managed identity service issuing JWTs. No auth logic exists in application code.

**API Layer (AWS AppSync – GraphQL)**  
Single entry point enforcing authorization rules and resolver-level access control.

**Data Storage (DynamoDB)**  
Serverless, low-latency storage with per-user ownership enforced by resolvers.

**File Storage (S3)**  
Binary data stored separately from structured data with IAM-based access control.

**Infrastructure (Amplify CLI)**  
Entire backend defined as code for reproducibility and environment consistency.

---


## Key Engineering Trade-offs

### GraphQL vs REST
- **Chosen:** GraphQL (AppSync)
- **Gained:** Schema as contract, fine-grained authorization, precise data fetching
- **Cost:** Higher conceptual complexity

### Serverless vs Custom Backend
- **Chosen:** Fully serverless
- **Gained:** Automatic scaling, no server management
- **Cost:** Harder debugging, less low-level control

### DynamoDB vs Relational DB
- **Chosen:** DynamoDB
- **Gained:** Scalability, simple access patterns
- **Cost:** No joins, upfront data modeling discipline

### Cognito vs Custom Auth
- **Chosen:** Cognito
- **Gained:** Security by default, reduced attack surface
- **Cost:** Limited customization, steeper learning curve

### Infrastructure as Code vs Manual Setup
- **Chosen:** Amplify CLI
- **Gained:** Reproducibility, auditability
- **Cost:** Abstracted infrastructure requires deeper understanding when debugging

---


## Authentication & Authorization Model

- Authentication via **Cognito User Pools**
- JWTs automatically attached to API requests
- Authorization enforced at the **GraphQL schema level**
- Owner-based access prevents cross-user data reads or writes

Security is enforced **before** any resolver executes.

---


## Failure Modes & Limitations

This system did not succeed on the first attempt.

### CI/CD Failures (npm + Amplify)
- Root cause: lockfile drift and transitive dependency mismatches
- Resolution: strict dependency alignment and deterministic builds
- Lesson: *If a build isn’t reproducible, it isn’t deployable*

### Environment Drift
- Local and cloud environments diverged during redeployments
- Fixed by treating the cloud environment as authoritative

### Windows Filesystem Constraints
- `npm ci` failures due to file locks
- Required manual cleanup and CI-first validation

### System Convergence
- Multiple failed deployments before stabilization
- Success occurred without code changes—only system alignment

---

### Current Limitations

- Owner-only authorization (no roles)
- No rate limiting or abuse protection
- No observability stack
- Single-region deployment

These limitations are intentional and documented.

---


## What I Learned & Future Work

### What I Learned

- Deployment is part of the system, not the final step
- Most failures occur at boundaries, not inside code
- Cloud abstractions reduce boilerplate, not responsibility
- Failure is signal, not noise

### Future Work

- Role-based authorization and field-level auth
- Observability (metrics, tracing, structured logs)
- Cost-aware access patterns and caching
- Multi-environment deployment strategy

---


## Final Reflection

This project represents a transition:

From  
> “Can I build something?”

To  
> “Can I reason about a system when it breaks?”

The deployed application is not the outcome.  
The **engineering mindset** is.
