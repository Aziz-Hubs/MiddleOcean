import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import 'dotenv/config';

async function main() {
  const token = process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf";
  
  if (!token) {
    console.error("No token found");
    return;
  }

  // MCP Sanity URL
  const url = new URL("https://mcp.sanity.io/v1/sse");
  url.searchParams.set("projectId", "hn27pyms");
  url.searchParams.set("dataset", "production");

  console.log("Connecting to:", url.toString());

  const transport = new SSEClientTransport(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const client = new Client(
    { name: "sanity-test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    await client.connect(transport);
    console.log("Successfully connected to Sanity MCP Server!");
    
    // Test a basic tool
    const resources = await client.listResources();
    console.log("Available Resources:", resources);

  } catch (error) {
    console.error("Connection failed:", error);
  }
}

main();
