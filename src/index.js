const core = require("@actions/core");

const panelUrl = core.getInput("PTERO_PANEL_URL");
const apiToken = core.getInput("PTERO_PANEL_TOKEN");
const serverId = core.getInput("PTERO_PANEL_SERVER_ID");
const preRestartCommands = core.getInput("PRE_RESTART_COMMANDS");
const preRestartCommandsList = preRestartCommands
	.split("\n")
	.map((command) => command.trim())
	.filter((command) => command.length > 0);
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
	if (preRestartCommands && preRestartCommandsList.length > 0) {
		for (const command of preRestartCommandsList) {
			try {
				core.info(`Running command: <${command}>`);

				const res = await fetch(`${panelUrl}/api/client/servers/${serverId}/command`, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${apiToken}`,
					},
					body: JSON.stringify({
						command: command,
					}),
				})

				if (!res.ok) {
					const errorMessage = await res.text();

					core.error(`Failed to execute command <${command}>. HTTP code ${res.status}. Message: ${errorMessage}`);

					if (stopOnError) {
						process.exit(1);
					}
				}
			} catch(e) {
				core.error(`Error while executing command <${command}>: ${e.message}`);

				if (stopOnError) {
					process.exit(1);
				}
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
