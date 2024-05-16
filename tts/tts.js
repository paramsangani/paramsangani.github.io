const voiceSelect = document.getElementById('voice-select');

// Populate voice options
function populateVoiceList() {
    const voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function convertToSpeech() {
    const text = document.getElementById('text-input').value;
    const rate = document.getElementById('rate').value;
    const selectedVoiceName = document.getElementById('voice-select').value;
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    
    const maxChunkLength = 160; // Maximum number of characters per chunk
    const textChunks = splitTextIntoChunks(text, maxChunkLength);

    textChunks.forEach(chunk => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
    });
}

function splitTextIntoChunks(text, maxChunkLength) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; // Split text into sentences
    const chunks = [];
    let chunk = '';

    sentences.forEach(sentence => {
        if (chunk.length + sentence.length <= maxChunkLength) {
            chunk += sentence;
        } else {
            chunks.push(chunk);
            chunk = sentence;
        }
    });

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
}