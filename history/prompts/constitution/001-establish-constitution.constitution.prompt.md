---
id: 1
title: Establish Constitution
stage: constitution
date: 2025-12-14
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user:
command: /sp.constitution
labels: [constitution, physical-ai, humanoid-robotics, setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
 -
---

## Prompt

You are Claude Code operating under Spec-Kit Plus.

Establish the CONSTITUTION for an AI-native textbook project.

Project Title:
Physical AI & Humanoid Robotics

Core Theme:
AI Systems in the Physical World — Embodied Intelligence.

Primary Goal:
Bridge the gap between the digital brain and the physical body by teaching students how to design, simulate, and deploy humanoid robots in simulated and real-world environments.

Foundational Pillars:
- Physical AI (Embodied Intelligence)
- Simulation-to-Real (Sim2Real)
- Humanoid Robotics
- ROS 2-based robotic control
- Physics-based simulation
- Vision-Language-Action (VLA)
- Conversational Robotics

Non-Negotiable Principles:
- Content must strictly follow the provided course document
- Engineering-first, no motivational fluff
- Industry-aligned tooling only (ROS 2, Gazebo, NVIDIA Isaac)
- All explanations must connect software intelligence to physical embodiment
- Each lesson must be usable independently for RAG-based retrieval
- Written for Docusaurus (Markdown / MDX only)

Audience:
- AI & Robotics students
- Engineers entering Physical AI
- Hackathon participants
- Startup-focused builders

Tone & Style:
- Instructor-grade
- Clear, precise, and technical
- Practical over theoretical

This constitution governs all specifications, plans, tasks, and implementations.

## Response snapshot

Constitution for Physical AI & Humanoid Robotics project has been successfully established. The constitution includes:

1. Core Principles aligned with the project's foundational pillars:
   - Physical AI (Embodied Intelligence)
   - Simulation-to-Real (Sim2Real)
   - Humanoid Robotics & ROS 2-based Control
   - Physics-based Simulation
   - Vision-Language-Action (VLA) & Conversational Robotics

2. Additional Requirements sections covering content standards and technology stack

3. Development Workflow section with course structure and audience alignment

4. Governance section establishing the constitution's authority

5. Templates have been updated to align with the new constitution:
   - plan-template.md now includes constitution checks specific to Physical AI
   - spec-template.md updated with target audience and content focus
   - tasks-template.md updated with technology stack and content focus

## Outcome

- ✅ Impact: Created foundational constitution for Physical AI & Humanoid Robotics textbook project
- 🧪 Tests: No tests required for constitution creation
- 📁 Files: Updated constitution.md and 3 template files
- 🔁 Next prompts: Plan and spec creation for initial features
- 🧠 Reflection: Constitution establishes clear principles for the Physical AI project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Begin feature specification for first lesson