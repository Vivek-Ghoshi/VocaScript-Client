import { getWaveBlob } from "webm-to-wav-converter";

export const recordAudio = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // ✅ Proper check with rejection
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        console.error("❌ getUserMedia is not supported in this browser");
        return reject(new Error("getUserMedia is not supported"));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunks, { type: "audio/webm" });
        // console.log("✅ webmBlob size:", webmBlob.size);

        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            // console.log("✅ WebM base64 ready");
            resolve(base64data);
          };
          reader.onerror = (e) => {
            console.error("❌ FileReader error:", e);
            reject(e);
          };
          reader.readAsDataURL(webmBlob);
        } catch (err) {
          console.error("❌ Blob to base64 error:", err);
          reject(err);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      console.log("🎙️ Recording started...");

      setTimeout(() => {
        mediaRecorder.stop();
        console.log("⏹️ Stopped recording.");
      }, 4000);
    } catch (err) {
      console.error("❌ Audio capture error:", err);
      reject(err);
    }
  });
};
