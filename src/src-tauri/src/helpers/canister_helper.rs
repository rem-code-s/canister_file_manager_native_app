use std::path::PathBuf;

use candid::{CandidType, Decode, Encode, Principal};
use ic_agent::{
    agent::http_transport::ReqwestHttpReplicaV2Transport, identity::BasicIdentity, Agent,
};
use serde::de::DeserializeOwned;

pub async fn query_canister<T: DeserializeOwned + CandidType>(
    canister_principal: &str,
    method: &str,
    args: Option<Vec<u8>>,
) -> Result<T, String> {
    let _canister_principal = Principal::from_text(canister_principal).unwrap();
    // let url = "http://localhost:8080";
    let url = "https://ic0.app";

    let identity_location = "/.config/dfx/identity/default/identity.pem";
    let home_dir = dirs::home_dir().unwrap();
    let identity_file = PathBuf::from(home_dir.to_string_lossy().to_string() + identity_location);

    let identity = BasicIdentity::from_pem_file(identity_file).unwrap();
    let agent: Agent = Agent::builder()
        .with_transport(ReqwestHttpReplicaV2Transport::create(url).unwrap())
        .with_identity(identity)
        .build()
        .unwrap();

    let _args = match args {
        Some(_args) => _args,
        None => Encode!().unwrap(),
    };
    let res = agent
        .query(&_canister_principal, method)
        .with_arg(_args)
        .call()
        .await;

    match res {
        Ok(_res) => Ok(Decode!(_res.as_slice(), T).unwrap()),
        Err(_err) => Err(_err.to_string()),
    }
}

pub async fn update_canister<T: DeserializeOwned + CandidType>(
    canister_principal: &str,
    method: &str,
    args: Vec<u8>,
) -> Result<T, String> {
    let _canister_principal = Principal::from_text(canister_principal).unwrap();
    // let url = "http://localhost:8080";
    let url = "https://ic0.app";

    let identity_location = "/.config/dfx/identity/default/identity.pem";
    let home_dir = dirs::home_dir().unwrap();
    let identity_file = PathBuf::from(home_dir.to_string_lossy().to_string() + identity_location);

    let identity = BasicIdentity::from_pem_file(identity_file).unwrap();
    let agent: Agent = Agent::builder()
        .with_transport(ReqwestHttpReplicaV2Transport::create(url).unwrap())
        .with_identity(identity)
        .build()
        .unwrap();

    agent.fetch_root_key().await.unwrap();

    let res = agent
        .update(&_canister_principal, method)
        .with_arg(args)
        .call_and_wait()
        .await;

    match res {
        Ok(_res) => Ok(Decode!(_res.as_slice(), T).unwrap()),
        Err(_err) => Err(_err.to_string()),
    }
}
