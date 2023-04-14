use std::{
    fs::{self, File as FsFile},
    io::Read,
    path::PathBuf,
};

use mime_guess::mime;

use crate::models::asset_models::{
    FileResponse, NestedAssets, Permission, PostAsset, PostDirectory, PostFile,
};

pub fn get_directories_recursive(path: &PathBuf) -> NestedAssets {
    let mut nested_assets = NestedAssets {
        asset: PostAsset::Directory(PostDirectory {
            name: get_name_from_path(&path),
            parent_id: None,
            permission: Permission::Public,
            children: vec![],
        }),
        children: vec![],
    };

    let entries = fs::read_dir(path).unwrap();

    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();

        if path.is_dir() {
            nested_assets
                .children
                .push(get_directories_recursive(&path));
        }

        if path.is_file() {
            nested_assets.children.push(NestedAssets {
                asset: get_files_from_directory(&path),
                children: vec![],
            });
        }
    }

    nested_assets
}

pub fn get_files_from_directory(path: &PathBuf) -> PostAsset {
    let file = FsFile::open(path).unwrap();
    let metadata = file.metadata().unwrap();
    let mime_type = mime_guess::from_path(&path)
        .first_or(mime::TEXT_PLAIN)
        .to_string();

    let size = metadata.len();
    let chunks_count = (size as f64 / 1_000_000.0).ceil() as u64;

    // get name and extension
    let name = get_name_from_path(&path);
    let extension = get_extension_from_file(&name);

    // if no mime type is know, dont add the file
    return PostAsset::File(PostFile {
        name,
        size,
        mime_type: mime_type.to_string(),
        extension,
        permission: Permission::Public,
        parent_id: None,
        chunk_count: chunks_count,
        metadata: None,
        origin_path: path.display().to_string(),
    });
}

pub fn map_chunks_to_ids(data: Vec<(FileResponse, String)>) -> Vec<(u64, Vec<u8>)> {
    let mut chunks: Vec<(u64, Vec<u8>)> = vec![];
    for (file, path) in data {
        let chunk_ids = file.chunks;
        let bytes = get_file_as_byte_vec(path);
        let chunk_size: usize = 1_000_000;

        let mut index = 0;
        for id in chunk_ids {
            let mut end = index + chunk_size;
            if end > bytes.len() {
                end = bytes.len();
            }
            let selected_bytes = &bytes[index..end];
            chunks.push((id, selected_bytes.to_vec()));
            index += chunk_size;
        }
    }
    chunks
}

fn get_file_as_byte_vec(path: String) -> Vec<u8> {
    let mut f = FsFile::open(&path).expect("no file found");
    let metadata = fs::metadata(&path).expect("unable to read metadata");
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).expect("buffer overflow");

    buffer
}

pub fn get_name_from_path(path: &PathBuf) -> String {
    let path_string = path.display().to_string();
    let path_sections: Vec<&str> = path_string.split("/").collect();
    let last_index = path_sections.len() - 1;
    path_sections[last_index].to_string()
}

pub fn get_extension_from_file(string: &String) -> String {
    let path_sections: Vec<&str> = string.split(".").collect();
    let last_index = path_sections.len() - 1;
    path_sections[last_index].to_string()
}
