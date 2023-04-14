// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            file_manager::logic::canister_methods::get_assets_tree,
            file_manager::logic::canister_methods::get_metadata,
            file_manager::logic::canister_methods::create_directory,
            file_manager::logic::canister_methods::delete_directory,
            file_manager::logic::canister_methods::delete_file,
            file_manager::logic::canister_methods::get_principal,
            file_manager::logic::filesystem_methods::fs_select_directory,
            file_manager::logic::filesystem_methods::fs_select_multiple_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
