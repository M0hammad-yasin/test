import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

const VoiceControlLED = ({ isOn, setIsOn, onStatusChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Voice command received:", command);

        if (command === "yasin") {
          setIsOn(true);
          onStatusChange(true);
        } else if (command === "lateef") {
          setIsOn(false);
          onStatusChange(false);
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [setIsOn, onStatusChange]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-colors ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      {isListening && (
        <div className="text-sm text-gray-600">
          Listening... Say "yasin" to turn on or "lateef" to turn off
        </div>
      )}
    </div>
  );
};

export default VoiceControlLED;
