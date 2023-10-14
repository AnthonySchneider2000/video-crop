import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import DropzoneComponent from "@/components/ui/dropzone";
import { useState, useRef, useEffect } from "react";
import { useFileContext } from "@/lib/FileContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

function HomePage() {
  const { selectedFiles } = useFileContext();
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.4/dist/esm";
    console.log("Loading ffmpeg-core.js");
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript",
      ),
    });
    setLoaded(true);
    console.log("ffmpeg-core.js loaded");
  };

  const transcode = async () => {
    const videoURL = selectedFiles[0]
      ? URL.createObjectURL(selectedFiles[0])
      : null;
    if (!videoURL) {
      console.log("No video selected");
      return;
    }
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.avi", await fetchFile(videoURL));
    // trim video from startTime to endTime
    await ffmpeg.exec([
      "-i",
      "input.avi",
      "-ss",
      `${startTime}`,
      "-to",
      `${endTime}`,
      "-c",
      "copy",
      "output.mp4",
    ]);
    const fileData = await ffmpeg.readFile("output.mp4");
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" }),
      );
    }
  };

  useEffect(() => {

    if(crossOriginIsolated) {
      console.log("Cross Origin Isolated");
    }
    load();
  }, []);

  return loaded ? (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Video Cropper</h1>
      {selectedFiles.length > 0 && (
        <div className="flex flex-row justify-center content-center gap-4">
          <video
            controls
            className="h-80 w-80"
            src={URL.createObjectURL(selectedFiles[0])}
          ></video>
          <video controls className="h-80 w-80" ref={videoRef}></video>
        </div>
      )}
      <DropzoneComponent size="long" />
      <Input
        type="text"
        placeholder="YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex w-full flex-row content-evenly justify-evenly gap-4 ">
        <Input
          type="number"
          className=""
          placeholder="Start Time"
          onChange={(e) => setStartTime(parseInt(e.target.value))}
        />
        <Input
          type="number"
          className=""
          placeholder="End Time"
          onChange={(e) => setEndTime(parseInt(e.target.value))}
        />
      </div>
      <div className="flex w-full flex-row content-evenly justify-evenly gap-4">
        <Button className="p-2">Download from YouTube</Button>
        <Button onClick={transcode} className="p-2">
          Crop Video
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Video Cropper</h1>
      <p ref={messageRef}></p>
    </div>
  );
}

export default HomePage;
