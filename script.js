document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("results");
    const detailsContainer = document.getElementById("details-container");
    const backToResultsButton = document.getElementById("back-to-results");

    let data = [];

    // Загрузка данных из JSON
    fetch('./data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Помилка завантаження JSON");
            }
            return response.json();
        })
        .then(json => {
            data = json;
            console.log("Дані завантажено:", data); // Отладка
        })
        .catch(error => {
            console.error("Помилка:", error);
        });

    // Поиск
    searchInput.addEventListener("input", () => {
        const query = cleanString(searchInput.value);
        const results = searchInData(query);
        displayResults(results);
    });

    function cleanString(str) {
        return str.toLowerCase().replace(/[-._]/g, '');
    }

    function searchInData(query) {
        if (!query) return [];

        return data.filter(item =>
            cleanString(item["Код обладнання"] || '').includes(query)
        );
    }

    function displayResults(results) {
        resultsContainer.innerHTML = "";

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>Нічого не знайдено</p>";
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");

            let resultHTML = `
                <div class="result-title">${item["Код обладнання"]}</div>
                <div>Номер Шафи ЕМ: ${item["Номер Шафи ЕМ"]}</div>
                <div>Лінія: ${item["Лінія"]}</div>
                <button onclick="showDetails('${item["Код обладнання"]}')">Деталі</button>
            `;

            resultItem.innerHTML = resultHTML;
            resultsContainer.appendChild(resultItem);
        });
    }

    window.showDetails = function(code) {
        const item = data.find(item => item["Код обладнання"] === code);
        if (!item) return;

        resultsContainer.classList.add("hidden");
        detailsContainer.classList.remove("hidden");

        let detailsHtml = `<h3 class="details-heading">Деталі для ${item["Код обладнання"]}</h3>
            <div class="details-section">
                <div class="detail-item">
                    <div class="detail-label">№:</div>
                    <div class="detail-value">${item["№"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Цех:</div>
                    <div class="detail-value">${item["Цех"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Лінія:</div>
                    <div class="detail-value">${item["Лінія"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Код обладнання:</div>
                    <div class="detail-value">${item["Код обладнання"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Номер Шафи ЕМ:</div>
                    <div class="detail-value">${item["Номер Шафи ЕМ"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Номер Шафи КВПіА:</div>
                    <div class="detail-value">${item["Номер Шафи КВПіА"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Номер автомата:</div>
                    <div class="detail-value">${item["Номер автомата"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Тип пуску:</div>
                    <div class="detail-value">${item["Тип пуску"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Потужність:</div>
                    <div class="detail-value">${item["Потужність"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Назва обладнання:</div>
                    <div class="detail-value">${item["Назва обладнання"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">КВПіА:</div>
                    <div class="detail-value">${item["КВПіА"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Модель датчика:</div>
                    <div class="detail-value">${item["Модель датчика"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Номер сигналу:</div>
                    <div class="detail-value">${item["Номер сигналу"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Відмітка ЕМ:</div>
                    <div class="detail-value">${item["Відмітка ЕМ"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Відмітка КВПіА:</div>
                    <div class="detail-value">${item["Відмітка КВПіА"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Квадрат ЕМ:</div>
                    <div class="detail-value">${item["Квадрат ЕМ"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Квадрат КВПіА:</div>
                    <div class="detail-value">${item["Квадрат КВПіА"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Посилання ЕМ:</div>
                    <div class="detail-value">${item["Посилання ЕМ"]}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Посилання КВПіА:</div>
                    <div class="detail-value">${item["Посилання КВПіА"]}</div>
                </div>
            </div>`;

        detailsContainer.innerHTML = detailsHtml;
        backToResultsButton.classList.remove("hidden");
        backToResultsButton.addEventListener("click", () => {
            detailsContainer.classList.add("hidden");
            resultsContainer.classList.remove("hidden");
            backToResultsButton.classList.add("hidden");
        });
    };
});
