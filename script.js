// =====================================
// AutoDocAI - script.js (Part 1)
// =====================================

// HTML Elements
const fileInput = document.getElementById("fileInput");
const codeInput = document.getElementById("codeInput");
const originalCode = document.getElementById("originalCode");
const outputCode = document.getElementById("outputCode");

const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

const commentMode = document.getElementById("commentMode");

const status = document.getElementById("status");
const errorMessage = document.getElementById("errorMessage");

// Backend URL
const API_URL = "http://127.0.0.1:8000/generate";

// ================================
// Status
// ================================

function setStatus(message,color="#60a5fa"){

    status.innerText = message;
    status.style.color = color;

}

function showError(message){

    errorMessage.innerText = message;

}

function clearError(){

    errorMessage.innerText = "";

}

// ================================
// Upload Python File
// ================================

fileInput.addEventListener("change",function(){

    clearError();

    const file=this.files[0];

    if(!file)
        return;

    if(!file.name.endsWith(".py")){

        showError("Only Python (.py) files are allowed.");

        this.value="";

        return;

    }

    const reader=new FileReader();

    reader.onload=function(e){

        codeInput.value=e.target.result;

        originalCode.value=e.target.result;

        setStatus("Python file uploaded successfully.","lightgreen");

    };

    reader.readAsText(file);

});

// ================================
// Live Preview
// ================================

codeInput.addEventListener("input",function(){

    originalCode.value=this.value;

});

// ================================
// Validate Python Input
// ================================

function validateInput(){

    clearError();

    const code=codeInput.value.trim();

    if(code===""){

        showError("Please paste Python code.");

        return false;

    }

    if(
        !code.includes("def") &&
        !code.includes("class") &&
        !code.includes("print") &&
        !code.includes("import")
    ){

        showError("Please enter valid Python code.");

        return false;

    }

    return true;

}

// =====================================
// Generate Comments
// =====================================

async function generateComments() {

    if (!validateInput()) {
        return;
    }

    const code = codeInput.value.trim();

    const mode = commentMode.value;

    originalCode.value = code;

    setStatus("Generating AI comments...", "orange");

    generateBtn.disabled = true;

    generateBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                code: code,

                mode: mode

            })

        });

        const data = await response.json();

        if (data.success) {

            outputCode.value = data.commented_code;

            setStatus("Comments generated successfully.", "lightgreen");

        } else {

            outputCode.value = "";

            showError(data.message);

            setStatus("Generation failed.", "#ff4d4d");

        }

    }

    catch (error) {

        console.error(error);

        showError("Cannot connect to FastAPI backend.");

        setStatus("Backend connection failed.", "#ff4d4d");

    }

    generateBtn.disabled = false;

    generateBtn.innerHTML =
        '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Comments';

}

// =====================================
// Generate Button
// =====================================

generateBtn.addEventListener("click", function () {

    generateComments();

});

// =====================================
// Regenerate
// =====================================

regenerateBtn.addEventListener("click", function () {

    if (codeInput.value.trim() === "") {

        showError("Please enter Python code first.");

        return;

    }

    generateComments();

});

// =====================================
// Copy Commented Code
// =====================================

copyBtn.addEventListener("click", function () {

    if (outputCode.value.trim() === "") {

        showError("Nothing to copy.");

        return;

    }

    navigator.clipboard.writeText(outputCode.value);

    setStatus("Commented code copied successfully.", "lightgreen");

});

// =====================================
// Download Commented Code
// =====================================

downloadBtn.addEventListener("click", function () {

    if (outputCode.value.trim() === "") {

        showError("Nothing to download.");

        return;

    }

    const blob = new Blob([outputCode.value], {

        type: "text/plain"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "commented_code.py";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

    setStatus("Download completed.", "lightgreen");

});

// =====================================
// Clear Everything
// =====================================

clearBtn.addEventListener("click", function () {

    fileInput.value = "";

    codeInput.value = "";

    originalCode.value = "";

    outputCode.value = "";

    clearError();

    setStatus("Ready");

});

// =====================================
// Keyboard Shortcut
// Ctrl + Enter
// =====================================

document.addEventListener("keydown", function (event) {

    if (event.ctrlKey && event.key === "Enter") {

        generateComments();

    }

});

// =====================================
// Initial Status
// =====================================

setStatus("Ready");

// =====================================
// End of Script
// =====================================