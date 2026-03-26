---
name: code-explainer
description: Use when explaining code to team members, during onboarding, code walkthroughs, or when someone asks "what does this code do" - especially when the audience's experience level is known or mixed
---

# Code Explainer

Explain code clearly by adapting to the audience, showing how it fits in the system, and using visual aids.

## Workflow

1. **Determine audience** - Ask or infer experience level (junior, mid, senior, non-technical). When unclear, default to mid-level.
2. **Start with system context** - Where does this code live? What calls it? What does it call? Show a diagram.
3. **Progressive disclosure** - Overview first, then walkthrough, then deep dive. Don't front-load everything.
4. **Include a visual diagram** - Always. Even a simple flow diagram aids understanding more than text alone.

## Audience Adaptation

| Audience | Focus on | Avoid |
|----------|----------|-------|
| Junior | Analogies, step-by-step, common mistakes, learning pointers | Jargon without definition, assumed knowledge |
| Mid-level | Patterns, design decisions, testing considerations | Over-explaining language basics |
| Senior | Trade-offs, scalability, security, alternative approaches | Line-by-line walkthrough of obvious code |
| Non-technical | Business impact, what it enables, failure consequences | Implementation details |

## Explanation Structure

### 1. System Context (always include)
Show where this code fits. Use a simple ASCII diagram:
```
Request -> [Rate Limiter] -> Service -> Database
```

### 2. High-Level Overview
One paragraph: what it does, why it exists, core mechanism.

### 3. Walkthrough (depth varies by audience)
- **Junior**: Line-by-line with "what it does" and "why this way". Use real-world analogies.
- **Mid/Senior**: Key decisions and non-obvious behavior only. Skip the obvious.

### 4. Audience-Specific Additions

**For juniors** - always include:
- Common mistakes when using or modifying this code
- 2-3 concepts to study next (with specific terms to search for)
- One small exercise: "try modifying this to also do X"

**For seniors** - always include:
- Trade-offs of current approach vs alternatives
- Failure modes and edge cases
- Production readiness gaps

## Diagram Guidelines

Use ASCII box diagrams for data/request flow:
```
Input -> [Processing] -> Output
              |
              v
         [Side Effect]
```

Use step diagrams for algorithms:
```
1. Check window -> 2. Count requests -> 3. Allow/Deny
                                              |
                                    [Calculate retry-after]
```

Keep diagrams small (under 10 lines). One diagram per major concept.

## Common Mistakes

- Jumping into line-by-line without establishing what the code IS first
- Same explanation regardless of who asked
- Walls of text with no visual breaks or diagrams
- Explaining WHAT without WHY
- For juniors: assuming knowledge of patterns like closures, promises, or middleware
- For seniors: over-explaining basics instead of focusing on decisions and trade-offs
