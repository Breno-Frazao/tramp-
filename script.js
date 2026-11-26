
/* ============================================
   TRAMPÔ - SISTEMA COMPLETO
============================================ */


/* CATEGORIAS */

const CATEGORIES = [

    {
        name: "Gastronomia",
        icon: "🍳",
        description: "Cozinheiros, confeiteiros e alimentação."
    },

    {
        name: "Limpeza / Organização",
        icon: "🧹",
        description: "Diaristas, faxineiros e organização."
    },

    {
        name: "Reparos / Manutenção",
        icon: "🔧",
        description: "Pedreiros, eletricistas e montadores."
    },

    {
        name: "Beleza / Estética",
        icon: "✂️",
        description: "Cabeleireiros e profissionais da beleza."
    },

    {
        name: "Eventos",
        icon: "📷",
        description: "Fotógrafos, decoração e eventos."
    },

    {
        name: "Cuidados com Animais",
        icon: "🐾",
        description: "Banho, tosa e cuidados com animais."
    },

    {
        name: "Aulas e Atividades",
        icon: "🎓",
        description: "Aulas particulares e atividades."
    }

];


/* PROFISSIONAIS DE EXEMPLO */

const sampleEmployees = [

    {
        id: "demo1",
        name: "Rafael Souza",
        category: "Gastronomia",
        job: "Chef particular",
        price: 80,
        priceUnit: "hora",
        rating: 4.9,
        ratings: 18,
        phone: "(19) 98765-4321",
        email: "rafael@exemplo.com",
        social: "@chefrafael",
        photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: "demo2",
        name: "Carla Mendes",
        category: "Limpeza / Organização",
        job: "Diarista",
        price: 20,
        priceUnit: "hora",
        rating: 4.8,
        ratings: 14,
        phone: "(19) 98888-1212",
        email: "carla@exemplo.com",
        social: "@carla.organiza",
        photo: "images/diarista.jpg"
    },

    {
        id: "demo3",
        name: "Diego Almeida",
        category: "Reparos / Manutenção",
        job: "Montador de móveis",
        price: 50,
        priceUnit: "hora",
        rating: 4.7,
        ratings: 21,
        phone: "(19) 97777-3434",
        email: "diego@exemplo.com",
        social: "@diegoalmeida",
        photo: "images/montador-de-moveis.webp"
    },

    {
        id: "demo4",
        name: "Amanda Lima",
        category: "Eventos",
        job: "Fotógrafa",
        price: 120,
        priceUnit: "hora",
        rating: 4.8,
        ratings: 11,
        phone: "(19) 96666-4545",
        email: "amanda@exemplo.com",
        social: "@amandalima.foto",
        photo: "images/fotografia.jpg"
    },

    {
        id: "demo5",
        name: "Henrique Santos",
        category: "Reparos / Manutenção",
        job: "Pedreiro",
        price: 20,
        priceUnit: "hora",
        rating: 4.1,
        ratings: 9,
        phone: "(19) 95555-5656",
        email: "henrique@exemplo.com",
        social: "@henriquesantos",
        photo: "images/pedreiro.jpg"
    }


];


/* ELEMENTOS E DADOS */

const $ = id => document.getElementById(id);

let currentCategory = "";
let currentEmployeeId = null;

const STORAGE_KEY = "trampoEmployees";


/* CARREGAR FUNCIONÁRIOS */

function loadEmployees() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(sampleEmployees)
            );

            return [...sampleEmployees];

        }

        const oldEmployees = JSON.parse(saved);

        if (!Array.isArray(oldEmployees)) {
            throw new Error("Dados inválidos");
        }

        sampleEmployees.forEach(sample => {

            const exists = oldEmployees.some(employee => {
                return employee.id === sample.id;
            });

            if (!exists) {
                oldEmployees.push(sample);
            }

        });

        return oldEmployees;

    } catch (error) {

        console.error("Erro ao carregar dados:", error);

        return [...sampleEmployees];

    }

}


let employees = loadEmployees();


/* SALVAR FUNCIONÁRIOS */

function saveEmployees() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(employees)
        );

        return true;

    } catch (error) {

        console.error("Erro ao salvar:", error);

        toast("Não foi possível salvar. Verifique o tamanho das fotos.");

        return false;

    }

}


/* FUNÇÕES AUXILIARES */

function escapeHTML(value = "") {

    return String(value).replace(/[&<>"']/g, char => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

    })[char]);

}


function formatPrice(employee) {

    return Number(employee.price || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function priceLabel(employee) {

    const units = {

        hora: "/hora",
        dia: "/dia",
        serviço: "/serviço",
        visita: "/visita",
        "m²": "/m²"

    };

    return `A partir de ${formatPrice(employee)} ${units[employee.priceUnit] || ""}`;

}


function stars(value) {

    const rating = Math.max(
        0,
        Math.min(5, Math.round(Number(value) || 0))
    );

    return "★".repeat(rating) + "☆".repeat(5 - rating);

}


function avatar(name) {

    const initials = String(name || "T")
        .split(" ")
        .map(part => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
        width="500" height="500">

        <rect width="100%" height="100%" fill="#e4f3e8"/>

        <text x="50%" y="53%" dominant-baseline="middle"
        text-anchor="middle" font-size="130"
        font-family="Arial" font-weight="bold"
        fill="#176b4b">${initials}</text>

        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);

}


function setImageFallback(img) {

    img.onerror = null;

    img.src = avatar(img.dataset.name || "Trampô");

}


/* CARTÕES DOS PROFISSIONAIS */

function card(employee) {

    const photo = employee.photo || avatar(employee.name);

    return `

        <article
            class="employee-card"
            onclick="openDetail('${escapeHTML(employee.id)}')"
            tabindex="0"
            role="button"
            aria-label="Ver perfil de ${escapeHTML(employee.name)}"
            onkeydown="if(event.key==='Enter')openDetail('${escapeHTML(employee.id)}')"
        >

            <div class="employee-photo-wrap">

                <img
                    class="employee-photo"
                    src="${escapeHTML(photo)}"
                    alt="${escapeHTML(employee.name)}"
                    data-name="${escapeHTML(employee.name)}"
                    onerror="setImageFallback(this)"
                >

                <span class="rating-pill">
                    <span>★</span>
                    ${Number(employee.rating || 0).toFixed(1)}
                </span>

            </div>

            <div class="employee-info">

                <h3>${escapeHTML(employee.name)}</h3>

                <p class="job">
                    ${escapeHTML(employee.job)}
                </p>

                <div class="card-bottom">

                    <span>${stars(employee.rating)}</span>

                    <span class="card-arrow">→</span>

                </div>

                <span class="employee-price">
                    ${priceLabel(employee)}
                </span>

            </div>

        </article>

    `;

}


/* RENDERIZAR INÍCIO */

function renderHome() {

    const sorted = [...employees].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );

    $("featuredGrid").innerHTML =
        sorted.slice(0, 5).map(card).join("");

    $("featuredEmpty").hidden = sorted.length > 0;

    renderCategories();

    fillCategorySelect();

}


/* RENDERIZAR CATEGORIAS */

function renderCategories() {

    $("categoryGrid").innerHTML = CATEGORIES.map(
        (category, index) => `

            <button
                class="category-card"
                onclick="showCategory(${index})"
            >

                <span class="category-icon">
                    ${category.icon}
                </span>

                <strong>
                    ${escapeHTML(category.name)}
                </strong>

                <span class="category-arrow">→</span>

            </button>

        `
    ).join("");

}


/* PREENCHER SELECT */

function fillCategorySelect() {

    $("employeeCategory").innerHTML = `

        <option value="">Selecione uma categoria</option>

        ${CATEGORIES.map(category => `

            <option value="${escapeHTML(category.name)}">

                ${escapeHTML(category.name)}

            </option>

        `).join("")}

    `;

}


/* NAVEGAÇÃO ENTRE TELAS */

function hideViews() {

    $("homeView").hidden = true;

    $("categoryView").hidden = true;

    $("allView").hidden = true;

    $("registrationView").hidden = true;

    $("navLinks").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showHome() {

    hideViews();

    $("homeView").hidden = false;

    history.replaceState(
        { view: "home" },
        "",
        "#inicio"
    );

    renderHome();

}


function showCategory(index) {

    const category = CATEGORIES[index];

    if (!category) return;

    currentCategory = category.name;

    hideViews();

    $("categoryView").hidden = false;

    $("categoryTitle").textContent = category.name;

    $("categorySubtitle").textContent = category.description;

    $("categorySearch").value = "";

    renderCategoryEmployees();

    history.pushState(
        {
            view: "category",
            category: category.name
        },
        "",
        "#categoria"
    );

}


/* ABRIR CADASTRO EM OUTRA TELA */

function openEmployeeForm() {

    hideViews();

    $("registrationView").hidden = false;

    $("employeeForm").reset();

    $("photoPreview").innerHTML = `
        <span>📷</span>
        <p>A prévia da foto aparecerá aqui.</p>
    `;

    history.pushState(
        { view: "registration" },
        "",
        "#cadastro"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* NAVEGAÇÃO DO MENU LATERAL */

function scrollDashboard(id) {

    const section = $(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* PROFISSIONAIS DA CATEGORIA */

function renderCategoryEmployees() {

    const search = $("categorySearch").value
        .trim()
        .toLowerCase();

    const list = employees.filter(employee => {

        const sameCategory =
            employee.category === currentCategory;

        const matchesSearch = [
            employee.name,
            employee.job
        ].some(value =>

            String(value || "")
                .toLowerCase()
                .includes(search)

        );

        return sameCategory && matchesSearch;

    });

    $("categoryEmployees").innerHTML =
        list.map(card).join("");

    $("categoryCount").textContent =
        `${list.length} profissional(is) encontrado(s)`;

    $("categoryEmpty").hidden = list.length > 0;

}


/* TODOS OS PROFISSIONAIS */

function renderAllEmployees() {

    hideViews();

    $("allView").hidden = false;

    $("allSearch").value = "";

    renderAllList();

    history.pushState(
        { view: "all" },
        "",
        "#profissionais"
    );

}


function renderAllList() {

    const search = $("allSearch").value
        .trim()
        .toLowerCase();

    const list = employees.filter(employee => {

        return [
            employee.name,
            employee.job,
            employee.category
        ].some(value =>

            String(value || "")
                .toLowerCase()
                .includes(search)

        );

    });

    $("allEmployees").innerHTML =
        list.map(card).join("");

    $("allCount").textContent =
        `${list.length} profissional(is) encontrado(s)`;

    $("allEmpty").hidden = list.length > 0;

}


/* PRÉVIA DA FOTO */

$("employeePhoto").addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        toast("Escolha uma imagem válida.");

        event.target.value = "";

        return;

    }

    if (file.size > 1024 * 1024) {

        toast("A foto deve ter no máximo 1 MB.");

        event.target.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = () => {

        $("photoPreview").innerHTML = `

            <img src="${reader.result}" alt="Prévia da foto">

            <p>Foto selecionada com sucesso!</p>

        `;

    };

    reader.readAsDataURL(file);

});


/* CADASTRAR FUNCIONÁRIO */

$("employeeForm").addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;

    const data = new FormData(form);

    const file = data.get("photo");

    if (!file || !file.size) {

        toast("Selecione uma foto.");

        return;

    }

    if (file.size > 1024 * 1024) {

        toast("A foto deve ter no máximo 1 MB.");

        return;

    }

    const reader = new FileReader();

    reader.onload = () => {

        const employee = {

            id: "user" + Date.now(),

            name: String(data.get("name")).trim(),

            job: String(data.get("job")).trim(),

            category: data.get("category"),

            price: Number(data.get("price")),

            priceUnit: data.get("priceUnit"),

            photo: reader.result,

            phone: String(data.get("phone") || "").trim(),

            email: String(data.get("email") || "").trim(),

            social: String(data.get("social") || "").trim(),

            rating: 0,

            ratings: 0

        };

        employees.push(employee);

        if (!saveEmployees()) {

            employees.pop();

            return;

        }

        form.reset();

        $("photoPreview").innerHTML = `
            <span>📷</span>
            <p>A prévia da foto aparecerá aqui.</p>
        `;

        showHome();

        toast("Profissional cadastrado com sucesso!");

    };

    reader.onerror = () => {

        toast("Erro ao carregar a foto.");

    };

    reader.readAsDataURL(file);

});


/* PERFIL DO PROFISSIONAL */

function openDetail(id) {

    const employee = employees.find(
        item => item.id === id
    );

    if (!employee) return;

    currentEmployeeId = id;

    let contacts = "";

    if (employee.phone) {

        const digits = employee.phone.replace(/\D/g, "");

        contacts += `

            <div class="contact-item">

                <b>☎</b>

                <a
                    href="https://wa.me/55${digits}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(employee.phone)} (WhatsApp)
                </a>

            </div>

        `;

    }

    if (employee.email) {

        contacts += `

            <div class="contact-item">

                <b>✉</b>

                <a href="mailto:${escapeHTML(employee.email)}">

                    ${escapeHTML(employee.email)}

                </a>

            </div>

        `;

    }

    if (employee.social) {

        let socialLink = employee.social;

        if (!socialLink.startsWith("http")) {

            socialLink = "https://www.instagram.com/" +
                socialLink.replace("@", "");

        }

        contacts += `

            <div class="contact-item">

                <b>◎</b>

                <a
                    href="${escapeHTML(socialLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(employee.social)}
                </a>

            </div>

        `;

    }

    if (!contacts) {

        contacts = `
            <p>Este profissional ainda não informou seus contatos.</p>
        `;

    }

    $("detailContent").innerHTML = `

        <div class="detail-cover">

            <img
                src="${escapeHTML(employee.photo || avatar(employee.name))}"
                alt="${escapeHTML(employee.name)}"
                data-name="${escapeHTML(employee.name)}"
                onerror="setImageFallback(this)"
            >

        </div>

        <div class="detail-body">

            <span class="section-label">

                ${escapeHTML(employee.category)}

            </span>

            <h2>${escapeHTML(employee.name)}</h2>

            <p class="detail-job">

                ${escapeHTML(employee.job)}

            </p>

            <div class="detail-price">

                ${priceLabel(employee)}

            </div>

            <div class="detail-rating">

                <span class="stars">

                    ${stars(employee.rating)}

                </span>

                <strong>

                    ${Number(employee.rating || 0).toFixed(1)} / 5

                </strong>

                <small>

                    (${employee.ratings || 0} avaliações)

                </small>

            </div>

            <div class="rate-area">

                <strong>

                    Deixe sua avaliação para este profissional:

                </strong>

                <div class="rate-stars">

                    ${[1, 2, 3, 4, 5].map(number => `

                        <button
                            type="button"
                            class="${number <= Math.round(employee.rating || 0) ? "selected" : ""}"
                            aria-label="Avaliar com ${number} estrelas"
                            onclick="rateEmployee('${employee.id}', ${number})"
                        >
                            ★
                        </button>

                    `).join("")}

                </div>

            </div>

            <h3>Entre em contato</h3>

            <div class="contact-list">

                ${contacts}

            </div>

        </div>

    `;

    $("detailDialog").showModal();

}


function closeDetail() {

    $("detailDialog").close();

}


/* AVALIAÇÃO POR ESTRELAS */

function rateEmployee(id, score) {

    const employee = employees.find(
        item => item.id === id
    );

    if (!employee) return;

    const oldRating = Number(employee.rating || 0);

    const oldCount = Number(employee.ratings || 0);

    employee.rating = Number(

        (
            (oldRating * oldCount + score) /
            (oldCount + 1)

        ).toFixed(1)

    );

    employee.ratings = oldCount + 1;

    if (!saveEmployees()) {

        employee.rating = oldRating;

        employee.ratings = oldCount;

        return;

    }

    openDetail(id);

    renderHome();

    if (!$("categoryView").hidden) {

        renderCategoryEmployees();

    }

    if (!$("allView").hidden) {

        renderAllList();

    }

    toast("Obrigado pela avaliação!");

}


/* SELEÇÃO DOS PLANOS */

function selectPlan(name, price) {

    const confirmacao = confirm(

        `Você escolheu o ${name}.\n\n` +
        `Valor: R$ ${price.toFixed(2).replace(".", ",")} por mês.\n\n` +
        `Deseja continuar?`

    );

    if (confirmacao) {

        toast(
            "Plano selecionado! O pagamento ainda precisa ser configurado."
        );

    }

}


/* PESQUISA */

$("searchForm").addEventListener("submit", event => {

    event.preventDefault();

    const search = $("searchInput").value
        .trim()
        .toLowerCase();

    renderAllEmployees();

    $("allSearch").value = search;

    renderAllList();

});


$("categorySearch").addEventListener(
    "input",
    renderCategoryEmployees
);


$("allSearch").addEventListener(
    "input",
    renderAllList
);


/* MENU PARA CELULAR */

$("menuToggle").addEventListener("click", () => {

    $("navLinks").classList.toggle("open");

});


/* NOTIFICAÇÕES */

let toastTimer;

function toast(message) {

    const element = $("toast");

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        element.classList.remove("show");

    }, 3000);

}


/* BOTÃO VOLTAR DO NAVEGADOR */

window.addEventListener("popstate", event => {

    const state = event.state;

    if (state?.view === "category") {

        const index = CATEGORIES.findIndex(
            category => category.name === state.category
        );

        if (index >= 0) {

            currentCategory = state.category;

            hideViews();

            $("categoryView").hidden = false;

            $("categoryTitle").textContent = state.category;

            $("categorySubtitle").textContent =
                CATEGORIES[index].description;

            renderCategoryEmployees();

            return;

        }

    }

    if (state?.view === "all") {

        hideViews();

        $("allView").hidden = false;

        renderAllList();

        return;

    }

    if (state?.view === "registration") {

        hideViews();

        $("registrationView").hidden = false;

        return;

    }

    hideViews();

    $("homeView").hidden = false;

    renderHome();

});


/* INICIALIZAÇÃO */

document.addEventListener("DOMContentLoaded", () => {

    renderHome();

    history.replaceState(
        { view: "home" },
        "",
        "#inicio"
    );

    console.log("Trampô iniciado com sucesso!");

});
