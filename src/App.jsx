import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { desktopDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/api/dialog";
import { download } from "tauri-plugin-upload-api";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

function App() {
  const imgURL =
    "https://user-images.githubusercontent.com/72456774/227094953-72361a8f-c738-4b0d-99b1-2368f24dd371.jpg";
  const [countNotif, setCountNotif] = useState(0);

  async function noti() {
    await invoke("notif_count", { num: countNotif });
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    if (permissionGranted) {
      sendNotification({
        title: "Rocket.Chat",
        body: "Rocket.Chat is awesome",
        icon: "src-tauri/tray/win32/default.ico",
      });
    }
  }


  const saveImage = async () => {
    try {
      const suggestedFilename = "image.jpg";
      const filePath = await save({
        defaultPath: (await desktopDir()) + "/" + suggestedFilename,
      });
      download(imgURL, filePath);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Rocket.Chat Tauri Testing!</h1>

      <button
        type="button"
        onClick={() => {
          setCountNotif(countNotif + 1);
          noti();
        }}
      >
        Send Notification
      </button>
      <button
        type="button"
        onClick={() => {
          saveImage();
        }}
      >
        Download a Witcher pic
      </button>
      <div className="row"></div>
    </div>
  );
}

export default App;
