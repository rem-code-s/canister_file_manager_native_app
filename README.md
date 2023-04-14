###

<img src="https://3gjaf-uyaaa-aaaal-qbxdq-cai.raw.ic0.app/static/media/logo_large.1eb5ead8b26a8ad5e527.png"
     alt="Served from the canister"
     style="margin-top: 20px; height: 48px; filter: drop-shadow(1px 1px 25px black)" />

##

# Canister file manager native app

This native application is created with Tauri + React + Typescript + Rust.

###### Note that this repo development is (temporary) dropped in favour of a [web hosted file manager](https://github.com/rem-code-s/canister_file_manager_frontend).

This project was the start attempt to create a user facing interface to interact with the file manager logic.

The initial reasoning for doing a native application was to have direct access to the filesystem and queueing uploads so it was possible to sync folders / be able to stop and start the process.

The main difference between this native application compared to the web application;

###Native

- file system, canister communication logic is handled in Rust
- Identities from the file system are used

###Web

- file system, canister communication logic is handled in Typescript
- Identities from internet identity are used

---

### local deployment

To setup the demo application you need to deploy the backend canister.

#### backend

- navigate to the backend folder with a CLI
- run `dfx start --clean --background`
- run `dfx deploy --no-wallet`
- Take note of the `canisterId` that is used

#### native app

- navigate to the native app folder with a CLI / open in code editor
- run `npm install`
- Change the `canisterId` and `host` accordingly in `src/src-tauri/src/logic/canister_methods.rs`
- start the local server `npm run tauri dev`
- a popup with the app should open up
