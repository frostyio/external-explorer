use serde::Serialize;
use std::{collections::HashMap, sync::Mutex};

pub type Property = (String, String); // (name, value)

pub type GUID = String;

#[derive(Serialize, Clone)]
pub enum GameEvent {
    AddInstance(String, String, GUID), // name, classname, guid
    RemoveInstance(GUID),              // guid
    /// Add properties to an instance
    UpdateInstance(GUID, Vec<Property>), // guid, properties
}

pub enum BrokerEvent {
    ModifyGame(GameEvent),
    ClientConnected,
}

#[derive(Default)]
pub struct Instance {
    properties: Vec<Property>,
    collapsed: bool, // do not get children?
}

#[derive(Default)]
pub struct GameState {
    instances: HashMap<GUID, Instance>, // guid, instance
    services: Vec<String>,              // points to an instance
}

#[derive(Default)]
pub struct AppState {
    pub game: Mutex<GameState>,
}
