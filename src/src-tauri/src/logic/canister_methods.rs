use std::path::PathBuf;

use candid::{Encode, Principal};
use ic_agent::{identity::BasicIdentity, Identity};

use crate::{
    helpers,
    models::{
        asset_models::{Asset, FileResponse, NestedAssets},
        misc_models::Metadata,
    },
};
pub static CANISTER_IDS: &str = "3gjaf-uyaaa-aaaal-qbxdq-cai";
// pub static CANISTER_IDS: &str = "rwlgt-iiaaa-aaaaa-aaaaa-cai";

#[tauri::command]
pub async fn get_assets_tree(id: Option<u64>) -> Result<Vec<Asset>, String> {
    let result = helpers::canister_helper::query_canister::<Vec<Asset>>(
        CANISTER_IDS,
        "get_assets_tree",
        Some(Encode!(&id).unwrap()),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

#[tauri::command]
pub async fn get_principal() -> String {
    let identity_location = "/.config/dfx/identity/default/identity.pem";
    let home_dir = dirs::home_dir().unwrap();
    let identity_file = PathBuf::from(home_dir.to_string_lossy().to_string() + identity_location);

    let identity = BasicIdentity::from_pem_file(identity_file).unwrap();
    identity.sender().unwrap().to_string()
}

#[tauri::command]
pub async fn get_metadata() -> Result<Metadata, String> {
    let result =
        helpers::canister_helper::query_canister::<Metadata>(CANISTER_IDS, "get_metadata", None)
            .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

#[tauri::command]
pub async fn create_directory(name: String, id: Option<u64>) -> Result<(), String> {
    let result = helpers::canister_helper::update_canister::<()>(
        CANISTER_IDS,
        "create_directory",
        Encode!(&name, &id).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

#[tauri::command]
pub async fn delete_directory(id: Option<u64>) -> Result<(), String> {
    let result = helpers::canister_helper::update_canister::<()>(
        CANISTER_IDS,
        "delete_directory",
        Encode!(&id).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

#[tauri::command]
pub async fn delete_file(id: u64) -> Result<(), String> {
    let result = helpers::canister_helper::update_canister::<()>(
        CANISTER_IDS,
        "delete_file",
        Encode!(&id).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

pub async fn add_assets(
    id: Option<u64>,
    assets: Vec<NestedAssets>,
) -> Result<Vec<(FileResponse, String)>, String> {
    let result = helpers::canister_helper::update_canister::<Vec<(FileResponse, String)>>(
        CANISTER_IDS,
        "add_assets",
        Encode!(&id, &assets).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

pub async fn add_chunk(id: u64, bytes: Vec<u8>) -> Result<(), String> {
    let result = helpers::canister_helper::update_canister::<()>(
        CANISTER_IDS,
        "add_chunk",
        Encode!(&id, &bytes).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

pub async fn add_chunks(data: Vec<(u64, Vec<u8>)>) -> Result<(), String> {
    let result = helpers::canister_helper::update_canister::<()>(
        CANISTER_IDS,
        "add_chunks",
        Encode!(&data).unwrap(),
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}

pub async fn get_origin_path_files() -> Result<Vec<(FileResponse, String)>, String> {
    let result = helpers::canister_helper::query_canister::<Vec<(FileResponse, String)>>(
        CANISTER_IDS,
        "get_origin_path_files",
        None,
    )
    .await;

    match result {
        Ok(_res) => Ok(_res),
        Err(_err) => Err(_err),
    }
}
