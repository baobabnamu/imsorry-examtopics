console.log("✅ Content script loaded.");

let originalHTML = null; // 원본 HTML 저장 변수

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📩 Received message in content script:", request);

    if (!originalHTML) {
        originalHTML = document.body.innerHTML; // 원본 HTML 저장
        console.log("💾 Original HTML saved.");
    }
    
    if (request.action === "recovery_origin") {
        document.body.innerHTML = originalHTML;
    } else if (request.action === "translate_to_kr_hide_ad") {
        translatePage("ko");
    } else if (request.action === "hide_ad") {
        hidePopup();
    }
    sendResponse({ status: "success" });
});

function translatePage(targetLang) {
    if (!document.body) return;
    
    let elements = document.body.getElementsByTagName("*");
    for (let element of elements) {
        for (let node of element.childNodes) {
            if (node.nodeType === 3 && node.nodeValue.trim() !== "") { // 텍스트 노드만 번역
                let originalText = node.nodeValue;
                fetchTranslation(originalText, targetLang).then(translatedText => {
                    node.nodeValue = translatedText;
                });
            }
        }
    }
    translatedHTML = document.body.innerHTML; // 번역된 HTML 저장
    console.log("💾 Translated HTML updated.");
}

async function fetchTranslation(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    console.log("🌍 Fetching translation for:", text, "→", targetLang);
    
    try {
        let response = await fetch(url);
        let result = await response.json();
        console.log("✅ Translation result:", result);
        return result[0].map(t => t[0]).join(" ");
    } catch (error) {
        console.error("❌ Translation error:", error);
        return text;
    }
}

function hidePopup() {
    const popups = document.querySelectorAll(".popup-overlay.show");
    popups.forEach(el => {
        el.style.display = "none";
    });
}