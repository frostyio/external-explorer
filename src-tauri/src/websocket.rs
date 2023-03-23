use crate::BrokerEvent;
use anyhow::Result;
use serde_json;
use std::{
	net::{TcpListener, TcpStream},
	sync::{Arc, Mutex},
};
use tokio::sync::mpsc::Sender;
use websocket::{
	server::{NoTlsAcceptor, WsServer},
	sync::{Server, Writer},
	OwnedMessage,
};

pub struct Websocket {
	// server: WsServer<NoTlsAcceptor, TcpListener>,
	addr: String,
	/// send events to the UI
	ui_link: Sender<BrokerEvent>,
	/// current client writer
	sender: Mutex<Option<Writer<TcpStream>>>,
}

impl Websocket {
	pub fn new(addr: &str, ui_link: Sender<BrokerEvent>) -> Result<Self> {
		Ok(Self {
			// server: Server::bind(addr)?,
			addr: addr.into(),
			ui_link,
			sender: Mutex::new(None),
		})
	}
}

pub async fn listen(server: Arc<Websocket>) -> Result<()> {
	let ws_server = Server::bind(server.addr.clone())?;

	// only allows one connection at a time
	for request in ws_server.filter_map(Result::ok) {
		let mut client = match request.accept() {
			Ok(client) => client,
			Err((_, err)) => {
				println!("{err:?}");
				continue;
			}
		};

		let (mut receiver, mut sender) = client.split()?;

		*server.sender.lock().unwrap() = Some(sender);

		server.ui_link.send(BrokerEvent::ClientConnected).await?;

		for message in receiver.incoming_messages() {
			match message? {
				OwnedMessage::Close(..) => break,
				OwnedMessage::Text(message) => {
					// println!("incoming: {message}");
					let deserialized: BrokerEvent = match serde_json::from_str(&message) {
						Ok(s) => s,
						Err(e) => panic!("{e:?}"),
					};
					server.ui_link.send(deserialized).await?;
				}
				OwnedMessage::Binary(message) => {
					println!("incoming 1");
					let deserialized: BrokerEvent = match serde_json::from_slice(&message) {
						Ok(s) => s,
						Err(e) => panic!("{e:?}"),
					};
					server.ui_link.send(deserialized).await?;
				}
				_ => {}
			}
		}
	}

	Ok(())
}

#[cfg(test)]
mod tests {
	use crate::{explorer::GameEvent, BrokerEvent};

	#[test]
	fn test_seralization() {
		let event = BrokerEvent::ModifyGame(GameEvent::AddInstances(vec![(
			"0001".into(),
			"Workspace".into(),
			"Worldroot".into(),
			"0001".into(),
		)]));

		let json = serde_json::to_string(&event).expect("failed to serialize");
		println!("{}", json);
	}
}
