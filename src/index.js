const core = require("@actions/core");

const panelUrl = core.getInput("PTERO_PANEL_URL");
const apiToken = core.getInput("PTERO_PANEL_TOKEN");
const serverId = core.getInput("PTERO_PANEL_SERVER_ID");

if (!panelUrl) {
	core.error("Missing Pterodactyl Panel URL");
	process.exit(1);
}
if (!apiToken) {
	core.error("Missing Pterodactyl API Token");
	process.exit(1);
}
if (!serverId) {
	core.error("Missing Pterodactyl Server ID");
	process.exit(1);
}

fetch(`${panelUrl}/api/client/servers/${serverId}/power`, {
	method: "POST",
	headers: {
		"Content-type": "application/json",
		Authorization: `Bearer ${apiToken}`,
	},
	body: JSON.stringify({
		signal: "restart",
	}),
})
	.then(async (res) => {
		if (res.ok) return process.exit();

		core.error(
			`Something went wrong while sending the request, HTTP code ${res.status}. Message: ${await res.text()}`,
		);

		process.exit(1);
	})
	.catch(async (error) => {
		core.error(
			`Something went wrong while sending the request. Message: ${error}`,
		);

		process.exit(1);
	});
