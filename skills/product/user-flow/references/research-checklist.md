# Pre-Design Research Checklist

Foundational research elements to gather before creating user flows.

## 1. User Research

**Personas**
- Who are the primary users?
- What are their goals and motivations?
- What's their technical proficiency?
- What devices/platforms do they use?

**Pain points**
- What problems are they trying to solve?
- What frustrates them in current solutions?
- What causes them to abandon tasks?

**Use cases**
- What are the most common user scenarios?
- What are edge cases or unusual scenarios?
- What triggers users to start this flow?

**Research methods**
- User interviews (direct feedback)
- Analytics data (behavioral patterns)
- Support tickets (common issues)
- Usability tests (observed struggles)

## 2. Information Architecture

**Content hierarchy**
- What information is most important?
- How should content be grouped?
- What's the logical structure?

**Navigation structure**
- How do users move between sections?
- What's the primary navigation pattern?
- Where do secondary actions live?

**Mental models**
- How do users think about this domain?
- What metaphors or patterns are familiar?
- What terminology do they use?

## 3. User Stories & Jobs-to-be-done

**User story format**
"As a [user type], I want to [action] so that [benefit]"

**Jobs-to-be-done**
- What job is the user hiring this product to do?
- What progress are they trying to make?
- What obstacles prevent progress?

**Success criteria**
- How do users measure success?
- What outcomes matter most?
- What's the minimum viable experience?

## 4. Flow Logic

**Decision points**
- What conditions affect the path?
- What user attributes matter (logged in, subscription, permissions)?
- What external factors influence routing (location, time, availability)?

**Business rules**
- What policies or regulations apply?
- What are approval workflows?
- What validation is required?

**Edge cases**
- First-time users vs returning users
- Incomplete data or profiles
- Service unavailability
- Permission denied scenarios
- Timeout or session expiry

**Error handling**
- What can go wrong at each step?
- How should errors be communicated?
- What recovery paths exist?

## 5. Content Requirements

**Copy needs**
- Headlines and screen titles
- Button labels and CTAs
- Instructions and help text
- Error messages
- Empty state messages
- Success confirmations

**Data inputs**
- What information does the user provide?
- What's required vs optional?
- What validation rules apply?

**Data outputs**
- What information is displayed?
- Where does it come from?
- How is it formatted?

**States**
- Loading states
- Empty states (no data yet)
- Error states
- Success states
- Partial completion states

## 6. Technical Constraints

**Platform limitations**
- Device capabilities (GPS, camera, biometrics)
- Browser/OS restrictions
- Network requirements (offline capability?)
- Performance considerations

**Integration points**
- Third-party services (payment, auth, maps)
- APIs and data sources
- Webhooks or async processes
- Background jobs

**Security requirements**
- Authentication needs
- Authorization levels
- Data encryption
- Compliance (GDPR, HIPAA, etc.)

## Using This Checklist

**For simple flows**
Focus on user stories, decision points, and content requirements. Skip detailed persona work if user base is well understood.

**For complex flows**
Work through all sections systematically. Document findings before creating flows.

**For existing products**
Reference analytics, support data, and user feedback. Validate assumptions with real usage patterns.

**Iterative approach**
You don't need all answers upfront. Start with what you know, identify gaps, and fill them as needed. Some questions become clearer after mapping initial flows.