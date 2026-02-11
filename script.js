let words = JSON.parse(localStorage.getItem("words")) || [];
let score = 0;
let currentQuestion = 0;
let quizWords = [];

function saveData() {
    localStorage.setItem("words", JSON.stringify(words));
}

function addWord() {
    const word = document.getElementById("word").value;
    const meaning = document.getElementById("meaning").value;
    const category = document.getElementById("category").value;

    if (word === "" || meaning === "") {
        alert("Please fill all fields");
        return;
    }

    words.push({ word, meaning, category });
    saveData();
    displayWords();

    document.getElementById("word").value = "";
    document.getElementById("meaning").value = "";
}

function displayWords(filtered = words) {
    const list = document.getElementById("wordList");
    list.innerHTML = "";

    if (filtered.length === 0) {
        list.innerHTML = `<tr><td colspan="4">No words found</td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        list.innerHTML += `
            <tr>
                <td>${item.word}</td>
                <td>${item.meaning}</td>
                <td>${item.category}</td>
                <td><button onclick="deleteWord(${index})">Delete</button></td>
            </tr>
        `;
    });
}


function deleteWord(index) {
    words.splice(index, 1);
    saveData();
    displayWords();
}

function startQuiz() {
    if (words.length < 1) {
        alert("Add words first!");
        return;
    }

    score = 0;
    currentQuestion = 0;
    quizWords = [...words].sort(() => 0.5 - Math.random());
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestion >= quizWords.length) {
        document.getElementById("question").innerText = "Quiz Finished!";
        document.getElementById("options").innerHTML = "";
        return;
    }

    let correct = quizWords[currentQuestion];
    document.getElementById("question").innerText =
        `What is the meaning of "${correct.word}"?`;

    let options = [correct.meaning];

    while (options.length < 4 && words.length > 1) {
        let random = words[Math.floor(Math.random() * words.length)].meaning;
        if (!options.includes(random)) {
            options.push(random);
        }
    }

    options.sort(() => 0.5 - Math.random());

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = function () {
            if (option === correct.meaning) {
                score++;
                document.getElementById("score").innerText = score;
            }
            currentQuestion++;
            updateProgress();
            nextQuestion();
        };
        optionsDiv.appendChild(btn);
    });
}

function updateProgress() {
    let percent = (currentQuestion / quizWords.length) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

displayWords();
// Dark Mode Toggle
// Dark Mode Toggle with localStorage
const darkModeBtn = document.getElementById("darkModeToggle");

// Check localStorage on page load
if(localStorage.getItem("darkMode") === "enabled"){
    document.body.classList.add("dark-mode");
    darkModeBtn.innerText = "☀ Light Mode";
} else {
    darkModeBtn.innerText = "🌙 Dark Mode";
}

// Toggle Dark Mode
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        darkModeBtn.innerText = "☀ Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkModeBtn.innerText = "🌙 Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }
});

