# Restart Ptero Action

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

## Example with commands

```yml
name: Restart Server

on: workflow_dispatch

jobs:
  test-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: https://git.stefdp.com/Stef/restart-ptero-action@main
        with:
          PTERO_PANEL_URL: ${{ secrets.PTERO_PANEL_URL }}
          PTERO_PANEL_TOKEN: ${{ secrets.PTERO_PANEL_TOKEN }}
          PTERO_PANEL_SERVER_ID: ${{ secrets.PTERO_PANEL_SERVER_ID }}
          PRE_RESTART_COMMANDS: |
            echo "my message"
            ls
            cat myFile.txt
```

## Exmaple with delay

```yml
name: Restart Server

on: workflow_dispatch

jobs:
  test-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: https://git.stefdp.com/Stef/restart-ptero-action@main
        with:
          PTERO_PANEL_URL: ${{ secrets.PTERO_PANEL_URL }}
          PTERO_PANEL_TOKEN: ${{ secrets.PTERO_PANEL_TOKEN }}
          PTERO_PANEL_SERVER_ID: ${{ secrets.PTERO_PANEL_SERVER_ID }}
          RESTART_DELAY: "5"
```

## Variables

| Variable | Required | Description | Example | Default |
|    :-:   |    :-:   |     :-:     |   :-:   |   :-:   |
| `PTERO_PANEL_URL` | Yes | Server URL of your Pterodactyl Panel (Including the scheme, `http://` or `https://`) | `https://panel.example.com` | N/A |
| `PTERO_PANEL_TOKEN` | Yes | API Key (created via `/account/api`) | `ptlc_xxxx` | N/A |
| `PTERO_PANEL_SERVER_ID` | Yes | ID of the server you want to restart (It's the short UUID (8 characters) after `/server/` in the server URL) | `3095fbed` | N/A |
| `PRE_RESTART_COMMANDS` | No | Commands to run on the server before restarting it (split by new line) | `echo "hello world"` | N/A (no command) |
| `RESTART_DELAY` | No | Amount of seconds to wait before restarting the server (useful with `PRE_RESTART_COMMAND`) | `5` | N/A (no delay) |
| `PRE_RESTART_COMMAND_STOP_ON_ERROR` | No | Whether to restart the server if the command HTTP request fails (**NOTE**: This is only for the HTTP request, it won't stop if the command fails as the API doesn't say if the command succeeds or not) | `true` | `false` |

# Stardance Demo

First login in my panel with the following credentials:

- URL: `https://panel.stefdp.com`
- Email: `stardance@stefdp.com`
- Password: `p&7J1FVfB4*AIuf2m!^*7zGN`

> [!WARNING]
> Please read the disclaimer in the server's console

Then visit [`https://panel.stefdp.com/account/api`](https://panel.stefdp.com/account/api) and create an API key.

Then use one of the examples [above](#usage) in yout github action with that API key.

You will only have access to 1 server with the following ID: `8a66c849`.