# **📋 CONTEXT SUMMARY**

## **1. Project Overview**
The project aims to develop a real-time, collaborative task board for team sprints, targeting internal development teams including developers, project managers, and QA personnel. The core mission is to enable efficient task management with instant status updates and AI-assisted acceptance criteria generation, enhancing productivity and coordination in software development workflows.

## **2. Key Measurable Goals (Directly Quoted)**
- Create a real-time, collaborative task board for team sprints.
- Ensure all task status updates are instantly reflected for all connected users.
- Integrate the Gemini API to automatically generate acceptance criteria for new tasks based on a simple description.
- Achieve a 99.9% uptime for the API backend.

## **3. Technical Stack & Non-Negotiables**
- **Frontend Framework:** Next.js, React
- **Backend Framework:** FastAPI, Python
- **Database/Auth:** InstantDB
- **AI Models:** Gemini 2.5 Flash for Orchestration, Gemini 2.5 Pro for Code Generation, Gemini 2.5 Flash for Task Acceptance Criteria generation.
- **Deployment:** Vercel
- **Scalability:** Must support up to 25 concurrent users daily.
- **Performance:** All CRUD operations must complete in under 500ms.
- **Security:** Requires role-based access control (RBAC) defined in the InstantDB schema (e.g., only Project Managers can delete tasks).

## **4. Validation Statement**
This summary accurately reflects all requirements, constraints, and deliverables in the source document and is ready for architectural planning.