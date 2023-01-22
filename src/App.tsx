import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Explorer from "./components/templates/explorer";
import Properties from "./components/templates/properties";

function App() {

	return (
		<>
			<Explorer />
			<h2>Properties</h2>
			<Properties />
		</>
	);
}

export default App;
