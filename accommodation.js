document.addEventListener("DOMContentLoaded", function () {
    var accommodationList = document.querySelector("#accommodation-list");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/https://www.mmu.ac.uk/study/accommodation/our-halls", true);
    xhr.responseType = "document";

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseXML;

            if (!response) {
                accommodationList.innerHTML = "<li class='loading'>Failed to load data.</li>";
                return;
            }

            // Select all accommodation blocks
            var accommodations = response.querySelectorAll(".u-grid");

            if (accommodations.length === 0) {
                accommodationList.innerHTML = "<li class='loading'>No accommodation data found.</li>";
                return;
            }

            // Clear loading text and previous content
            accommodationList.innerHTML = "";

            var accommodationNames = []; // Array to track already displayed accommodation names

            accommodations.forEach(accommodation => {
                var li = document.createElement("li");
                li.className = "title";

                // Extract the hall name (assuming it's in an <h3> tag)
                var titleElement = accommodation.querySelector("h3");
                if (!titleElement) return; // Skip if there's no title
                var title = titleElement ? titleElement.textContent.trim() : "Unknown Hall";

                // Check if this accommodation name is already in the list to avoid duplicates
                if (accommodationNames.includes(title)) {
                    return; // Skip if it's a duplicate
                }

                // Add the title to the list of names we've already displayed
                accommodationNames.push(title);

                li.textContent = title;

                // Extract ONLY features from a specific class (.u-gap-x-6)
                var featuresContainer = accommodation.querySelector(".u-gap-x-6"); 
                var features = [];

                if (featuresContainer) {
                    // Get all direct child elements (divs, spans, etc.)
                    var featureElements = featuresContainer.children;
                    for (let feature of featureElements) {
                        let text = feature.textContent.trim();
                        if (text.length > 0 && !features.includes(text)) {
                            features.push(text); // Prevent duplicates
                        }
                    }
                }

                // Extract price from a specific class
                var priceElement = accommodation.querySelector(".price");
                var price = priceElement ? priceElement.textContent.trim() : "Price not available";

                // Create a nested list for features
                if (features.length > 0) {
                    var nestedList = document.createElement("ul");
                    nestedList.className = "feature-list"

                    features.forEach(feature => {
                        var nestedLi = document.createElement("li");
                        nestedLi.className = "features"
                        nestedLi.textContent = feature;
                        nestedList.appendChild(nestedLi);
                    });

                    li.appendChild(nestedList);
                }

                // Add price as a separate list item
                var chat = document.createElement("button");
                chat.className = "enquire-btn";
                chat.id = "enquire"
                chat.onclick = document.getElementById("myForm").style.display = "block";
                chat.textContent = "Enquire";
                li.appendChild(chat);

                // Add the list item to the main accommodation list
                accommodationList.appendChild(li);
            });

            console.log("Accommodations loaded successfully.");
        }
    };

    xhr.onerror = function () {
        accommodationList.innerHTML = "<li class='loading'>Error loading accommodations. Try again later.</li>";
        console.error("Request failed with status:", xhr.status, xhr.statusText);
    };

    xhr.send();
});