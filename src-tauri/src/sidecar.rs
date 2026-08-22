use std::process::{Child, Command};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Manager};

/// Manages the lifecycle of the Bun Elysia Backend Sidecar binary.
#[derive(Clone)]
pub struct SidecarManager {
    child_process: Arc<Mutex<Option<Child>>>,
}

impl SidecarManager {
    pub fn new() -> Self {
        Self {
            child_process: Arc::new(Mutex::new(None)),
        }
    }

    /// Spawns the Bun sidecar binary or dev script on port 18890
    pub fn spawn(&self, app: &AppHandle) -> Result<(), String> {
        println!("[Tauri Shell] Initializing VTuber Subtitle Engine Sidecar...");

        // Determine if running in dev or bundled production mode
        let is_dev = cfg!(debug_assertions);

        let mut cmd = if is_dev {
            let mut c = Command::new("bun");
            c.arg("run").arg("src-server/server.ts");
            c
        } else {
            // Locate bundled sidecar in binaries folder or current exe dir
            let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
            let sidecar_path = resource_dir.join("binaries/vtuber-subtitle-server.exe");

            if sidecar_path.exists() {
                Command::new(sidecar_path)
            } else {
                // Fallback to local sibling path
                Command::new("vtuber-subtitle-server.exe")
            }
        };

        cmd.env("PORT", "18890");

        match cmd.spawn() {
            Ok(child) => {
                println!("[Tauri Shell] Sidecar spawned successfully with PID: {}", child.id());
                let mut lock = self.child_process.lock().unwrap();
                *lock = Some(child);
                Ok(())
            }
            Err(e) => {
                let err_msg = format!("[Tauri Shell] Failed to spawn Bun backend: {}", e);
                eprintln!("{}", err_msg);
                Err(err_msg)
            }
        }
    }

    /// Gracefully terminates the Bun child process to prevent orphan ports
    pub fn kill(&self) {
        let mut lock = self.child_process.lock().unwrap();
        if let Some(mut child) = lock.take() {
            println!("[Tauri Shell] Terminating sidecar process PID: {}", child.id());
            let _ = child.kill();
            let _ = child.wait();
            println!("[Tauri Shell] Sidecar process terminated cleanly.");
        }
    }
}

impl Drop for SidecarManager {
    fn drop(&mut self) {
        self.kill();
    }
}
