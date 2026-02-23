🧠 Personal Memory Agent

A conversational, memory-first system designed to act as a private “second brain.”
Unlike traditional todo or reminder applications, this project focuses on long-term memory, contextual retrieval, and reflection, enabling users to store life events in natural language and query them conversationally.

📌 Overview

Most productivity tools treat data as temporary: tasks are completed, reminders are dismissed, and context disappears. This project rethinks that model by introducing a memory-based architecture, where every interaction becomes part of a structured, searchable timeline.

The system allows users to:

Store events and thoughts naturally

Retrieve past memories contextually

Schedule reminders using natural language

Generate short summaries (daily/weekly)

Build a long-term personal timeline

The goal is not task management — it is context retention and reflective intelligence.

🚀 Core Features
1️⃣ Conversational Interaction

Chat-first experience designed to feel like speaking to an AI assistant.

Examples:

remember I studied system design for 2 hours
remind me tomorrow at 6 pm to revise GRE
show what I did yesterday
summarize my week
2️⃣ Memory-Based Storage Model

Each entry is stored as a structured memory:

Raw text

Primary category (study, job, task, health, event, note)

Flexible tags

Event time

Created time

Optional reminder time

Metadata (duration, mood, etc.)

Memories are never deleted by default — they become part of a persistent timeline.

3️⃣ Natural Time Parsing (Rule-Based)

Supports expressions like:

tomorrow

yesterday

next Monday

in 2 hours

this week / last week

explicit dates and times

No dependency on external LLM services for core functionality.

4️⃣ Smart Retrieval

Memories can be filtered by:

Time range

Category

Tags

Recent activity

Custom queries

The system responds concisely and contextually.

5️⃣ Short, Insightful Summaries

Generates 2–3 line summaries for:

Daily activity

Weekly activity

Category-specific summaries

Designed for reflection, not data overload.

🏗 Architecture
Frontend

React

TypeScript

Tailwind CSS

Chat-style UI

Dark-first modern design

Responsive layout

Smooth conversational experience

Backend

Node.js

Express

Modular architecture (routes, controllers, services, models)

Clean separation of concerns

Rule-based natural language parsing

Database

MongoDB

Structured memory schema

Indexed fields for fast time-based queries

Extensible metadata storage
