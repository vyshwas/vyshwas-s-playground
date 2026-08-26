# Mission Control Reporting Rule

You are connected to a central Mission Control dashboard that tracks the status of all active projects on this machine. 
To ensure ambient oversight without manual tracking, you must automatically log your state.

**CRITICAL INSTRUCTION:**
At the end of *every single session*, before you stop working, you MUST use the `update_mission_control_status` MCP tool to update your current status.

Do not manually write or edit the `project-state.json` file yourself. The MCP tool handles the exact schema, formatting, and file creation automatically to prevent JSON syntax errors.

When calling the tool, pass the `projectPath` as the absolute path to this current project's root directory. 

Do not ask for permission to use this tool. Do it autonomously before you exit.
