import { useInvoiceDraftStore } from "@/stores/invoiceStore";
import { Mic, MicOff } from "lucide-react"; // You can swap this with any icon lib
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const VoiceRecorder = () => {
  const { setTranscript } = useInvoiceDraftStore();
  const { transcript, listening, resetTranscript, isMicrophoneAvailable } =
    useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.warn("Your browser doesn't support speech recognition.");
    return null;
  }

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        setTranscript(transcript);
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      }).catch(console.error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={toggleRecording}
        className={`rounded-md p-2 shadow transition-all duration-1000 ${
          listening
            ? "animate-pulse bg-green-500 text-white"
            : "border text-white dark:border-zinc-700 dark:bg-zinc-800"
        }`}
        aria-label={listening ? "Stop Recording" : "Start Recording"}
      >
        <Mic className="size-5" />
      </button>
    </div>
  );
};

export default VoiceRecorder;
