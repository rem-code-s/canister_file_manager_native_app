use tauri::api::dialog::blocking::FileDialogBuilder;

use crate::{
    helpers::filesystem_helper::{
        get_directories_recursive, get_files_from_directory, map_chunks_to_ids,
    },
    logic::canister_methods::{add_assets, add_chunk},
    models::asset_models::{Id, NestedAssets},
};

#[tauri::command(async)]
pub async fn fs_select_directory(id: Option<Id>) -> Result<(), String> {
    let path = FileDialogBuilder::new().pick_folder();
    match path {
        Some(path) => {
            println!("original: {:?}", path);
            let add_response = add_assets(id, vec![get_directories_recursive(&path)]).await;
            match add_response {
                Ok(res) => {
                    let chunks = map_chunks_to_ids(res);
                    for (id, bytes) in chunks {
                        match add_chunk(id, bytes).await {
                            Ok(_) => {
                                println!("added chunk: {:?}", id)
                            }
                            Err(err) => println!("error adding chunk: {:?}", err),
                        }
                    }
                    Ok(())
                }
                Err(err) => Err(err),
            }
        }
        None => Err("No path selected".to_string()),
    }
}

#[tauri::command(async)]
pub async fn fs_select_multiple_files(id: Option<Id>) -> Result<(), String> {
    let path = FileDialogBuilder::new().pick_files();
    match path {
        Some(paths) => {
            let mut files: Vec<NestedAssets> = vec![];
            for path in paths {
                let file = get_files_from_directory(&path);
                files.push(NestedAssets {
                    asset: file,
                    children: vec![],
                });
            }

            let add_response = add_assets(id, files).await;
            match add_response {
                Ok(res) => {
                    let chunks = map_chunks_to_ids(res);
                    for (id, bytes) in chunks {
                        match add_chunk(id, bytes).await {
                            Ok(_) => {
                                println!("added chunk: {:?}", id)
                            }
                            Err(err) => println!("error adding chunk: {:?}", err),
                        }
                    }
                }
                Err(err) => println!("error adding assets: {:?}", err),
            }

            Ok(())
        }
        None => Err("No path selected".to_string()),
    }
}
