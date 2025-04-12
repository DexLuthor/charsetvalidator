import { validateAgainstCharset, isInvisible, charsetRanges } from './charset-validator.js';

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function updateCharCount() {
    const textInput = document.getElementById("textInput");
    document.getElementById("charCount").textContent = textInput.value.length;
}

function changeText() {
    const textInput = document.getElementById("textInput");
    const validateButton = document.getElementById("validateButton");
    validateButton.disabled = textInput.value.trim() === '';

    textInput.classList.remove("valid");
    textInput.classList.remove("invalid");
    document.getElementById("validationStatus").textContent = "Not validated";
    document.getElementById("validationStatus").className = "validation-status";
    document.getElementById("results").style.display = "none";
    updateCharCount();
}

function handleKeyDown(event) {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        runValidation();
    }
}

function runValidation() {
    const textInput = document.getElementById("textInput");
    const charsetSelect = document.getElementById("charsetSelect");
    const validationStatus = document.getElementById("validationStatus");
    const results = document.getElementById("results");
    const invalidChars = document.getElementById("invalidChars");

    const text = textInput.value;
    const charset = charsetSelect.value;

    if (charset in charsetRanges) {
        const result = validateAgainstCharset(text, charset);
        if (result.length > 0) {
            textInput.classList.remove("valid");
            textInput.classList.add("invalid");
            validationStatus.textContent = "Invalid";
            validationStatus.className = "validation-status status-invalid";
            results.style.display = "block";

            invalidChars.innerHTML = result.map(({char, code}) => `
                    <div class="char-card">
                        <div class="char-display">${isInvisible(char) ? `<span class="invisible-char">${char}</span>` : char}</div>
                        <div class="char-code">U+${code}</div>
                    </div>
                `).join('');
        } else {
            textInput.classList.add("valid");
            textInput.classList.remove("invalid");
            validationStatus.textContent = "Valid";
            validationStatus.className = "validation-status status-valid";
            results.style.display = "none";
        }
    } else {
        console.log("Warning: Charset validation not supported for", charset);
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Character count
    document.getElementById("textInput").addEventListener("input", updateCharCount);
    
    // Validation button
    document.getElementById("validateButton").addEventListener("click", runValidation);
    
    // Dark mode toggle
    document.querySelector(".toggle-dark-mode").addEventListener("click", toggleDarkMode);
    
    // Text input changes
    const textInput = document.getElementById("textInput");
    textInput.addEventListener("change", changeText);
    textInput.addEventListener("keydown", handleKeyDown);
});