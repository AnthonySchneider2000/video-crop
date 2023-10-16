import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import DropzoneComponent from "@/components/ui/dropzone";
import { useState, useRef, useEffect } from "react";
import { useFileContext } from "@/lib/FileContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
  return (
    <header className="flex h-40 flex-row content-center items-center justify-center">
      <h1 className="text-center text-4xl font-bold">Video Cropper</h1>
    </header>
  );
};

function HomePage() {
  const { selectedFiles } = useFileContext();
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const downloadFromYouTube = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

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
    await ffmpeg.writeFile("input.webm", await fetchFile(videoURL));
    // trim video from startTime to endTime
    await ffmpeg.exec([
      "-ss",
      `${startTime}`,
      "-to",
      `${endTime}`,
      "-i",
      "input.webm",
      "-c",
      "copy",
      "output.webm",
    ]);
    const data: any = await ffmpeg.readFile("output.webm");
    if (videoRef.current) {
      videoRef.current.src = await URL.createObjectURL(new Blob([data.buffer]));
    }
  };

  useEffect(() => {
    if (crossOriginIsolated) {
      console.log("Cross Origin Isolated");
    }
    load();
  }, []);

  return loaded ? (
    <>
      <Header />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
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
          <Button onClick={downloadFromYouTube} className="p-2">
            Download from YouTube
          </Button>
          <Button onClick={transcode} className="p-2">
            Crop Video
          </Button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex flex-row content-center justify-center gap-4">
            <video
              controls
              className="h-80 w-80"
              src={URL.createObjectURL(selectedFiles[0])}
            ></video>
            <video controls className="h-80 w-80" ref={videoRef}></video>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      <Header />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="flex w-full flex-row content-evenly justify-evenly gap-4 ">
          <Skeleton className="h-10 w-1/2 rounded-md" />
          <Skeleton className="h-10 w-1/2 rounded-md" />
        </div>
        <div className="flex w-full flex-row content-evenly justify-evenly gap-4">
          <Skeleton className="h-20 w-1/2 rounded-md" />
          <Skeleton className="h-20 w-1/2 rounded-md" />
        </div>
      </div>
    </>
  );
}

export default HomePage;
