// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};
mod systray;
use systray::systray;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn notif_count(num: u32, app_handle: tauri::AppHandle) {
    let path: &str;
    match num {
        0 => path = "default.ico",
        1 => path = "notification-1.ico",
        2 => path = "notification-2.ico",
        3 => path = "notification-3.ico",
        4 => path = "notification-4.ico",
        5 => path = "notification-5.ico",
        6 => path = "notification-6.ico",
        7 => path = "notification-7.ico",
        8 => path = "notification-8.ico",
        9 => path = "notification-9.ico",
        10..=20 => path = "notification-plus.ico",
        _ => path = "notification-dot.ico",
    }
    let path_t:String = format!("tray/win32/{}",path);
    app_handle.tray_handle().set_icon(tauri::Icon::File(app_handle.path_resolver().resolve_resource(path_t).unwrap())).unwrap();
}

#[tauri::command]
fn download(path:String) {
   fs::write(path, "cat.png").unwrap();
}

fn main() {
    tauri::Builder::default()
        .system_tray(systray())
        .on_system_tray_event(|app, event|

            match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                // get a handle to the clicked menu item
                // note that `tray_handle` can be called anywhere,
                // just get an `AppHandle` instance with `app.handle()` on the setup hook
                // and move it to another function or thread
                let item_handle = app.tray_handle().get_item(&id);
                match id.as_str() {
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                        item_handle.set_title("Show").unwrap();
                    }
                    "show" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                        item_handle.set_title("Hide").unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![notif_count,download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
