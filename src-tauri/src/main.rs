#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod sidecar;

use sidecar::SidecarManager;
use tauri::{Manager, RunEvent};

fn main() {
    let sidecar_manager = SidecarManager::new();
    let sidecar_clone = sidecar_manager.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .setup(move |app| {
            // Spawn the Bun Elysia Backend Sidecar on startup
            if let Err(e) = sidecar_manager.spawn(&app.handle()) {
                eprintln!("[Main] Error starting sidecar: {}", e);
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(move |_app_handle, event| {
            // Clean up child processes when application exits or closes
            if let RunEvent::Exit = event {
                println!("[Main] Application exiting. Cleaning up sidecar...");
                sidecar_clone.kill();
            }
        });
}
