# restart Ptero Action

A GitHub action to restart your Pterodactyl Panel servers

# Usage

Inside `steps`:

```yml
- uses: https://git.stefdp.com/Stef/restart-ptero-action@main
  with:
    PTERO_PANEL_URL: ${{ secrets.PTERO_PANEL_URL }}
    PTERO_PANEL_TOKEN: ${{ secrets.PTERO_PANEL_TOKEN }}
    PTERO_PANEL_SERVER_ID: ${{ secrets.PTERO_PANEL_SERVER_ID }}
```

## Variables

| Variable | Required | Description |
|    :-:   |    :-:   |     :-:     |
| `PTERO_PANEL_URL` | Yes | Server URL of your Pterodactyl Panel (Including the scheme, `http://` or `https://`) |
| `PTERO_PANEL_TOKEN` | Yes | API Key (created via `/account/api`) |
| `PTERO_PANEL_SERVER_ID` | Yes | ID of the server you want to restart (It's the short UUID (8 characters) after `/server/` in the server URL) |
| `PRE_RESTART_COMMAND` | No | A command to run on the server before restarting it |
| `RESTART_DELAY` | No | Amount of seconds to wait before restarting the server (useful with `PRE_RESTART_COMMAND`) |
| `PRE_RESTART_COMMAND_STOP_ON_ERROR` | No | Whether to restart the server if the command HTTP request fails (**NOTE**: This is only for the HTTP request, it won't stop if the command fails as the API doesn't say if the command succeeds or not) |