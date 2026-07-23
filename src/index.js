const core = require("@actions/core");

const panelUrl = core.getInput("PTERO_PANEL_URL");
const apiToken = core.getInput("PTERO_PANEL_TOKEN");
const serverId = core.getInput("PTERO_PANEL_SERVER_ID");
const preRestartCommand = core.getInput("PRE_RESTART_COMMAND");
const restartDelay = core.getInput("RESTART_DELAY");
const restartDelayInt = parseInt(restartDelay, 10);
const stopOnError = core.getInput("PRE_RESTART_COMMAND_STOP_ON_ERROR") === "true";

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

if (restartDelay && (Number.isNaN(restartDelayInt) || restartDelayInt <= 0)) {
	core.error("Restart delay must be a non-negative integer");
	
	process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
	if (preRestartCommand) {
		try {
			core.info("Running pre-restart command...");

			const res = await fetch(`${panelUrl}/api/client/servers/${serverId}/command`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${apiToken}`,
				},
				body: JSON.stringify({
					command: preRestartCommand,
				}),
			})

			if (!res.ok) {
				const errorMessage = await res.text();

				core.error(`Failed to execute pre-restart command. HTTP code ${res.status}. Message: ${errorMessage}`);

				if (stopOnError) {
					process.exit(1);
				}
			}
		} catch(e) {
			core.error(`Error while executing pre-restart command: ${e.message}`);

			if (stopOnError) {
				process.exit(1);
			}
		}
	}

	if (restartDelay) {
			core.info(`Waiting for ${restartDelayInt} seconds before restarting the server...`);

			await sleep(restartDelayInt * 1000);
		}

	try {
		core.info("Restarting the server...")

		const res = await fetch(`${panelUrl}/api/client/servers/${serverId}/power`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${apiToken}`,
			},
			body: JSON.stringify({
				signal: "restart",
			}),
		})

		if (res.ok) return process.exit();

		const errorMessage = await res.text();

		core.error(`Something went wrong while sending the request, HTTP code ${res.status}. Message: ${errorMessage}`);

		process.exit(1);
	} catch(e) {
		core.error(
			`Something went wrong while sending the request. Message: ${e.message}`,
		);

		process.exit(1);
	}
}

main();
