#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]
#![allow(unused)]

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
	collections::HashMap,
	sync::{Arc, Mutex},
};
use tauri::{Manager, State};
use tokio::sync::mpsc::{self, Sender};

mod explorer;
use explorer::{GameEvent, GameState, Instance};

mod websocket;

#[derive(Default, Debug)]
pub struct AppState {
	pub game: Mutex<GameState>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BrokerEvent {
	ModifyGame(GameEvent),
	ClientConnected,
}

fn modify_game<R: tauri::Runtime>(
	data: GameEvent,
	manager: &impl Manager<R>,
	state: Arc<AppState>,
) {
	let mut game = state.game.lock().unwrap();
	let handle = manager.app_handle();

	match data {
		GameEvent::AddInstances(instances) => {
			// for (guid, name, classname, parent) in instances {
			// 	let instance = Instance {
			// 		properties: HashMap::from([
			// 			("Name".into(), name),
			// 			("ClassName".into(), classname),
			// 			("Parent".into(), parent),
			// 		]),
			// 		collapsed: false,
			// 	};
			// 	game.instances.insert(guid, instance);
			// }

			handle.emit_all("addInstances", instances).unwrap();
			println!("firing!");
		}
		_ => unimplemented!(),
	}
}

/// Communicate with the GUI State
async fn broker<R: tauri::Runtime>(
	event: BrokerEvent,
	manager: &impl Manager<R>,
	state: Arc<AppState>,
) {
	match event {
		BrokerEvent::ModifyGame(data) => modify_game(data, manager, state),
		BrokerEvent::ClientConnected => {
			println!("client connected");
		}
		_ => unimplemented!(),
	}
}

//

fn listen_websocket(sender: Sender<BrokerEvent>) -> Result<Arc<websocket::Websocket>> {
	let mut server = Arc::new(websocket::Websocket::new("127.0.0.1:8000", sender)?);
	tauri::async_runtime::spawn(websocket::listen(Arc::clone(&server)));

	Ok(server)
}

fn main() {
	let (sender, mut receiver) = mpsc::channel::<BrokerEvent>(5);

	let websocket = listen_websocket(sender).expect("failed to listen to websocket");

	tauri::Builder::default()
		// .invoke_handler(tauri::generate_handler![greet])
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
