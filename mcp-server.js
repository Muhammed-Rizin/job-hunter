import "./helper/dns.js";
import "./helper/global.js";
import { setupErrorHandlers } from "./helper/error.js";
import { resolveUser } from "./services/user.service.js";

// Global Error Handling for MCP (Stderr)
setupErrorHandlers("MCP", false);

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import connectDB from "./database/index.js";
import models from "./model/index.js";
import { createLead } from "./services/lead.service.js";
import { generateLetter, submitApplication } from "./services/application.service.js";

const server = new Server(
  { name: "job-hunter", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_and_plan_leads",
      description: "Ingests new job leads into the database.",
      inputSchema: {
        type: "object",
        properties: {
          leads: {
            type: "array",
            items: {
              type: "object",
              properties: {
                companyName: { type: "string" },
                jobLink: { type: "string" },
                email: { type: "string" },
                priority: { type: "string" },
                techStack: { type: "string" },
                theHook: { type: "string" },
              },
              required: ["companyName"],
            },
          },
        },
        required: ["leads"],
      },
    },
    {
      name: "generate_tailored_letter",
      description: "Generates a JD-matched cover letter.",
      inputSchema: {
        type: "object",
        properties: {
          planId: { type: "string" },
          customHook: { type: "string" },
        },
        required: ["planId"],
      },
    },
    {
      name: "send_job_application",
      description: "Sends the final application via SMTP.",
      inputSchema: {
        type: "object",
        properties: {
          planId: { type: "string" },
          customBody: { type: "string" },
        },
        required: ["planId"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    await connectDB();
    const user = await resolveUser();

    let result;
    switch (name) {
      case "search_and_plan_leads":
        const results = await Promise.all(args.leads.map((lead) => createLead(user._id, lead)));
        result = new Response("Leads processed", { results }, 200);
        break;

      case "generate_tailored_letter":
        const plan = await models.Plan.findById(args.planId);
        const letter = await generateLetter(plan, { customHook: args.customHook });
        result = new Response("Letter generated", { letter }, 200);
        break;

      case "send_job_application":
        const targetPlan = await models.Plan.findById(args.planId);
        const letterRes = await generateLetter(
          targetPlan,
          args.customBody ? { customBody: args.customBody } : {},
        );
        const subject = `Application for ${targetPlan?.roleTitle || "Developer"} role - Muhammed Rizin`;

        const sendRes = await submitApplication(user, {
          planId: targetPlan?._id,
          to: targetPlan?.email,
          subject,
          body: letterRes.body,
          letterFile: letterRes.filename,
          company: targetPlan?.companyName,
          role: targetPlan?.roleTitle,
          source: "mail",
        });

        result = new Response("Sent", { data: sendRes }, 200);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }],
      isError: true,
    };
  }
});

const runServer = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Job Hunter MCP Server running");
};

runServer().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
