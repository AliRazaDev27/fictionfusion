'use client';

import { useState, useRef } from 'react';
import { sample } from './actions';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            // 1. Get the stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // 2. Initialize MediaRecorder
            // Note: 'audio/webm' is the standard for Chrome/Firefox. 
            // Safari may default to mp4/aac, but MediaRecorder handles the defaults well.
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // 3. Collect audio chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // 4. Handle stop event to create the Blob
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Cleanup: stop all tracks to release the microphone
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return { isRecording, audioBlob, startRecording, stopRecording };
};

// Example UI Component
export default function AudioRecorder() {
    const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecorder();

    const uploadToWhisper = async () => {
        if (!audioBlob) return;
        console.log("Ready to upload", audioBlob);
        const result = await sample(audioBlob);
        console.log(result);
    };

    return (
        <div className="p-4 border rounded shadow-md">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded text-white ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {audioBlob && (
                <div className="mt-4">
                    <audio src={URL.createObjectURL(audioBlob)} controls />
                    <button
                        onClick={uploadToWhisper}
                        className="block mt-2 text-blue-600 underline"
                    >
                        Transcribe with Whisper
                    </button>
                </div>
            )}
        </div>
    );
}