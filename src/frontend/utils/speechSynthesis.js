export function isSpeechSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text = "", lang = "en-US", { onSpeak, onStop } = {}) {
    if (!isSpeechSupported() || !text.trim()) {
        return null;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onstart = () => {
        onSpeak?.();
    };

    utterance.onend = () => {
        onStop?.();
    };

    utterance.onerror = () => {
        onStop?.();
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
}

export function stopSpeaking() {
    if (!isSpeechSupported()) {
        return;
    }
    if (checkIsSpeaking()) {
        window.speechSynthesis.cancel();
    }
}

export function checkIsSpeaking() {
    return isSpeechSupported() && window.speechSynthesis.speaking;
}