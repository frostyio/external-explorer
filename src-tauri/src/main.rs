#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};

use tauri::{Manager, State};
use tokio::sync::mpsc;
use websocket::sync::Server;

mod data;
use data::{AppState, BrokerEvent, GameState};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

async fn broker<R: tauri::Runtime>(
    event: BrokerEvent,
    manager: &impl Manager<R>,
    state: Arc<AppState>,
) {
    match event {
        BrokerEvent::ModifyGame(data) => match manager.emit_all("modifyGame", data) {
            Ok(_) => {}
            Err(err) => println!("{:?}", err),
        },
        BrokerEvent::ClientConnected => {
            println!("client connected");
        }
        _ => unimplemented!(),
    }
}

fn main() {
    let (sender, mut receiver) = mpsc::channel::<BrokerEvent>(5);

    let mut server = Server::bind("127.0.0.1:8000").unwrap();
    tauri::async_runtime::spawn(async move {
        let request = server.accept().unwrap();
        let mut _client = request.accept().unwrap();
        let _ = sender.send(BrokerEvent::ClientConnected).await;
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .manage(Arc::new(AppState::default()))
        .setup(|app| {
            let handle = app.handle();
            let state = app.state::<Arc<AppState>>();
            let app_state = Arc::clone(state.inner());
            tauri::async_runtime::spawn(async move {
                loop {
                    match receiver.try_recv() {
                        Ok(event) => broker(event, &handle, Arc::clone(&app_state)).await,
                        Err(_) => continue,
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
