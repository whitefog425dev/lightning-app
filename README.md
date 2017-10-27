## Lightning Desktop App

This repo houses a cross-platform Lightning desktop app powered by
[`lnd`](https://github.com/lightningnetwork/lnd/). The application is under
active development and currently only operates on the Bitcoin testnet chain.

<img src="screenshot.png">

### Developing Locally


First start by pulling down the git repo:
```
git clone https://github.com/lightninglabs/lightning-app.git
```

Then go inside the project folder and run the following commands (grab a coffee, this might take a while):
```
cd lightning-app
npm run setup
```

### Development Mode

You can run the app in development mode in lieu of using the packaged app:
```
npm start
```

In development mode, the app will look for an lnd.conf in the default location for your platform. See [`lnd.conf` details](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md#creating-an-lndconf-optional). A typical lnd.conf for running on simnet will look like the following:

```
[Application Options]
debuglevel=debug

[Bitcoin]
bitcoin.active=1
bitcoin.simnet=1
bitcoin.rpcuser=lnd
bitcoin.rpcpass=lnd
```

Running in development mode can allow you to run in full node mode instead of the default neutrino mode, and will also allow you to run in simnet node for testing.

Note that in order to run in simnet node, you will have also had to separately install and configure the [roasbeef fork of `btcd`](https://github.com/roasbeef/btcd). Additional instructions for running simnet can be found [here](https://gist.github.com/davecgh/2992ed85d41307e794f6).

Also note that if you have installed and built [`lnd`](https://github.com/lightningnetwork/lnd) separately, if an instance is running when the app starts, the app will connect to the already running instance rather than attempt to start a new one.

If you want your lnd.conf to replicate the configuration used by the packaged app, you can use the following:

```
[Application Options]
debuglevel=info

[Bitcoin]
bitcoin.active=1
bitcoin.testnet=1
neutrino.active=1
neutrino.connect=btcd0.lightning.computer:18333
autopilot.active=1
```

### Building the Packaged App

To build the packaged version of the app for your current platform, run:
```
npm run package-electron
```

The packaged app will then be available in the lightning-app/release directory. The packaged version of the app will run on Bitcoin testnet. To debug a packaged app, go to localhost:9997 in your browser.

### Errors

If the window doesn't load after running `npm start`: try clicking on dev tools window and hitting `cmd-r` to refresh the window.

### Logs
Logs are written to the following locations:

* **Linux:** `~/.config/Lightning/log.log`
* **OSX:** `~/Library/Logs/Lightning/log.log`
* **Windows:** `%USERPROFILE%\AppData\Roaming\Lightning\log.log`

