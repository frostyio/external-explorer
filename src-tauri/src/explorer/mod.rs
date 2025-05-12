use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Mutex};

pub type GUID = String;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum GameEvent {
	AddInstance(GUID, String, String, String), // guid, name, classname, parent
	AddInstances(Vec<(GUID, String, String, String)>),
	RemoveInstance(GUID),                        // guid
	UpdateInstance(GUID, Vec<(String, String)>), // guid, properties
}

#[derive(Default, Debug)]
pub struct Instance {
	pub properties: HashMap<String, String>,
	pub collapsed: bool, // do not get children?
}

#[derive(Default, Debug)]
pub struct GameState {
	pub instances: HashMap<GUID, Instance>, // guid, instance
	pub services: Vec<String>,              // points to an instance
}
