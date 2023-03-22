import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import "./App.css";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  const [countNotif, setCountNotif] = useState(0);

  console.log(countNotif)
  async function noti() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("notif_count", { num:countNotif });
  }
  async function download(){
    try{
      await writeBinaryFile('cat.png', new Uint8Array([]), { dir: 6 });
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Rocket.Chat Tauri Testing!</h1>

      <button type="button" onClick={()=> {setCountNotif(countNotif+1); noti()}}>Send Notification</button>
      <button type="button" onClick={()=> {download()}}>Download a Cat pic</button>
      <div className="row">

      </div>
        
    </div>
  );
}

export default App;
