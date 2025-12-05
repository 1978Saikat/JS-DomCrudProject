// ----------------------------------------------------
// SIMPLE JAVASCRIPT CRUD APP
// Works for index.html (Add page) and list.html (List page)
// ----------------------------------------------------

(function () {
    // ----------------------------------------------------
    // BASIC HELPERS
    // ----------------------------------------------------

    // Generate unique ID
    function genereteId () {
        return Data.now() + "_" + Math.random().toString(36).substr(2, 5);
    }

    // Show temporary message
    function showMessage(text) {
        const box = document.getElementById("message");
        if(!box) return;

        box.textContent = text;
        setTimeout(() => box.textContent = "", 2000);
    }

    // Validate email
    function isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Load items from localStorage
    function loadItems() {
        return JSON.parse(localStorage.getItem("items") || "[]");
    }

    // Save items to localStorage
    function saveItems(items) {
        localStorage.setItem("items", JSON.stringify(items));
    }

    // Clear all error messages inside a form
    function clearErrors(from) {
        from.querySelectorAll(".error").forEach(el => el.textContent = "");
    }

    // Set error message
    function showError(fieldName, message) {
        const errorBox = document.querySelector(`.error[data-for="${fieldName}"]`);
        if (errorBox) errorBox.textContent = message;
    }


    // ----------------------------------------------------
    // OPTIONAL: JSON SEEDING (if data.json exists)
    // ----------------------------------------------------
    function seedFormJSON() {
        fetch("data/data.json").then(res => {
            if (!res.ok) throw new Error("JSON Not Available");
            return res.json();
        }).then(json => {
            if (loadItems().length === 0){
                saveItems(json);
                console.log("Seeded from JSON");
                if (document.getElementById("items-table")) renderList();
            }
        }).catch(() => {/* ignore (file://) */});
    }


    // ----------------------------------------------------
    // PAGE 1: ADD NEW ITEM (index.html)
    // ----------------------------------------------------

    const addForm = document.getElementById("item-from");

    if (addForm) {
        seedFormJSON();

        addForm.addEventListener("submit", function(e){
            e.preventDefault();

            const title = document.getElementById("title").value.trim();
            const description = document.getElementById("description").value.trim();
            const email = document.getElementById("email").value.trim();

            clearErrors(addForm);

            // basic validation
            if(!title) return showError("title", "Title is required");
            if(!email) return showError("email", "Email is required");
            if(!isEmailValid(email)) return showError("email", "Invalid email");

            const newItem = {
                id: genereteId(),
                title,
                description,
                email,
                createdAt: new Date().toISOString()
            };

            const items = loadItems();
            items.unshift(newItem);
            saveItems(items);

            addForm.reset();
            showMessage("Item saved");
        });
    }


    // ----------------------------------------------------
    // PAGE 2: LIST + EDIT + DELETE (list.html)
    // ----------------------------------------------------

    const table = document.getElementById("items-table");

    if (table) {
        seedFormJSON();

        const tbody = table.querySelector("tbody");
        const search = document.getElementById("search");
        const editModal = document.getElementById("edit-modal");
        const editForm = document.getElementById("edit-form");

        // Render list
        function renderList(query = ""){
            let items = loadItems();
            const q = query.toLowerCase();

            if(q) {
                items = items.filter(item => item.title.toLowerCase().includes(q));
            }

            tobody.innerHTML = "";

            if (items.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5">No Items found</td></tr>`;
                return;
            }

            items.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.description || "-"}</td>
                    <td>${item.email}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="del-btn">Delete</button>
                    </td>
                `;

                // Edit item
                tr.querySelector(".edit-btn").addEventListener("click", () => openEdit(item.id));

                // Delete item
                tr.querySelector(".del-btn").addEventListener("click", () => deleteItem(item.id));

                tbody.appendChild(tr);
            });
        }

        // Delete item
        function deleteItem(id) {
            if(!confirm("Delete this item?")) return;

            let items = loadItems();
            items = items.filter(item => item.id !== id);
            saveItems(items);

            renderList(search.value);
            showMessage("Item deleted");
        }

        // Open edit popup
        function openEdit(id) {
            const item = loadItems().find(i => i.id === id);
            if(!item) return;

            document.getElementById("edit-id").value = item.id;
            document.getElementById("edit-title").value = item.title;
            document.getElementById("edit-description").value = item.description;
            document.getElementById("edit-email").value = item.email;

            editModal.classList.remove("hidden");
        }

        // Close modal
        function closeModal() {
            editModal.classList.add("hidden");
        }

        document.getElementById("cancle-edit").onclick = closeModal;

        // Save edited item
        editForm.addEventListener("submit", function(e){
            e.preventDefault();

            const id = document.getElementById("edit-id").value;
            const title = document.getElementById("edit-title").value.trim();
            const description = document.getElementById("edit-description").value.trim();
            const email = document.getElementById("edit-email").value.trim();

            clearErrors(editForm);

            if (!title) return showError("edit-title", "Title is required");
            if (!email) return showError("edit-email", "Email is required");
            if (!isEmailValid(email)) return showError("edit-email", "Invalid email");

            const items = loadItems();
            const index = items.findIndex(i => i.id === id);

            items[index] = {
                ...items[index],
                title,
                description,
                email,
                updatedAt: new Date().toISOString()
            };

            saveItems(items);
            closeModal();
            renderList(search.value);
            showMessage("Item updated");

        });

        search.addEventListener("input", () =>
            renderList(search.value)
        );

        renderList();
    }

})();