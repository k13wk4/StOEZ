document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("results");
    const detailsContainer = document.getElementById("details-container");
    const backToResultsButton = document.getElementById("back-to-results");

    let data = [];
    let previousScrollPosition = 0;

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

    // Показать кнопку при прокрутке вниз
    window.onscroll = function() {
        const scrollToTopButton = document.getElementById("scrollToTopButton");
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 200) {
            scrollToTopButton.style.display = "block";
        } else {
            scrollToTopButton.style.display = "none";
        }
    };

    function scrollToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    document.getElementById("scrollToTopButton").addEventListener("click", scrollToTop);


    function displayResults(results) {
        resultsContainer.innerHTML = "";

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>Нічого не знайдено</p>";
            return;
        }

        results.forEach((item, index) => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");
            resultItem.dataset.index = index; // Уникальный идентификатор

            let resultHTML = `
                <div class="result-title">${item["Код обладнання"]}</div>
                <div>Номер Шафи ЕМ: ${item["Номер Шафи ЕМ"]}</div>
                <div>Лінія: ${item["Лінія"]}</div>
            `;

            resultItem.innerHTML = resultHTML;

            // Передача объекта item напрямую
            resultItem.addEventListener("click", () => showDetails(item));
            resultsContainer.appendChild(resultItem);
        });
    }

    function showDetails(item) {
        if (!item) return;

        // Сохраняем позицию скролла
        previousScrollPosition = window.scrollY;

        resultsContainer.classList.add("hidden");
        detailsContainer.classList.remove("hidden");
        detailsContainer.classList.add("details-section");

        let detailsHtml = `<h3 class="details-heading">Деталі для ${item["Код обладнання"]}</h3>`;
        Object.keys(item).forEach(key => {
            detailsHtml += `
                <div class="detail-item">
                    <div class="detail-label">${key}:</div>
                    <div class="detail-value">${item[key]}</div>
                </div>
            `;
        });

        detailsContainer.innerHTML = detailsHtml;
        backToResultsButton.classList.remove("hidden");
    }

    backToResultsButton.addEventListener("click", () => {
        detailsContainer.classList.add("hidden");
        resultsContainer.classList.remove("hidden");
        backToResultsButton.classList.add("hidden");

        // Восстанавливаем позицию скролла
        window.scrollTo(0, previousScrollPosition);
    });
});
