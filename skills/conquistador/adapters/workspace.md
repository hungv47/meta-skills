# Workspace host adapter

Use this behavior in ChatGPT workspaces, Slack, Buzz, and other shared rooms.

## Input

Use the current thread, named actor, accessible channel history, attached files, linked sources, and
explicitly connected tools. Do not assume access that the host has not granted.

## Conversation

- Respond in the originating thread or room.
- Acknowledge the interpreted outcome in one sentence.
- Ask at most one bundled question; mention the user only when their answer is required.
- Keep progress updates short and meaningful.
- Return the review packet in the thread. Put long-form work in an attached document or canvas only
  when that makes review materially easier.
- Continue from thread history; do not require a resume command.

## Shared-workspace safety

- Treat room membership as an audience boundary, not blanket authorization.
- Do not move private context across channels, rooms, communities, or workspaces.
- Respect the host's actor identity and audit trail.
- Request approval from a human with authority immediately before any send, publish, spend, or other
  write action.
- If approval state is ambiguous, leave a ready-to-use draft and stop.

For Slack, prefer app threads and concise channel messages when the workspace agent exposes them. For
Buzz, operate only through an ACP-compatible backing agent and use only the room context that agent
actually supplies.

This package does not install a Slack or Buzz app, authenticate a workspace, provide identity or
memory, or add publishing tools. The marketing contract stays identical; identity, context transport,
durability, tools, and rendering remain host-owned.
