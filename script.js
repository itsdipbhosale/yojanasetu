/* =====================================================
   YOJANASETU
   Category → Caste → Schemes → Details
===================================================== */


/* ================= SCHEME DATA ================= */

const schemes = [

    {
        id: 1,

        name: "College Student Scholarship",

        category: "college",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Scholarship",

        description: "Scholarship support for eligible college and higher-education students.",

        eligibility: "College or higher-education students meeting applicable eligibility rules.",

        benefit: "Financial assistance for education expenses."
    },


    {
        id: 2,

        name: "Post-Matric Scholarship",

        category: "college",

        caste: [
            "OBC",
            "SC",
            "ST"
        ],

        type: "Scholarship",

        description: "Post-matric education support for eligible students from reserved categories.",

        eligibility: "Eligible OBC, SC or ST students studying after matriculation.",

        benefit: "Support toward tuition and other eligible educational expenses."
    },


    {
        id: 3,

        name: "School Education Scholarship",

        category: "school",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Scholarship",

        description: "Education assistance for school-going students.",

        eligibility: "Eligible school students according to applicable scheme rules.",

        benefit: "Educational support for school-related expenses."
    },


    {
        id: 4,

        name: "Pre-Matric Scholarship",

        category: "school",

        caste: [
            "SC",
            "ST",
            "OBC"
        ],

        type: "Scholarship",

        description: "Pre-matric education support for eligible students.",

        eligibility: "Eligible students studying before the matriculation stage.",

        benefit: "Financial support for eligible education expenses."
    },


    {
        id: 5,

        name: "Farmer Financial Assistance",

        category: "farmer",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Financial Support",

        description: "Financial assistance information for eligible farmers.",

        eligibility: "Farmers meeting the relevant government scheme conditions.",

        benefit: "Financial support according to applicable scheme guidelines."
    },


    {
        id: 6,

        name: "Agriculture Support Scheme",

        category: "farmer",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Financial Support",

        description: "Support information for agriculture and farming activities.",

        eligibility: "Eligible farmers as defined by the particular scheme.",

        benefit: "Agriculture-related assistance according to scheme rules."
    },


    {
        id: 7,

        name: "Disability Welfare Assistance",

        category: "disabled",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Financial Support",

        description: "Welfare assistance information for persons with disabilities.",

        eligibility: "Persons with disabilities meeting applicable eligibility conditions.",

        benefit: "Support available under relevant welfare provisions."
    },


    {
        id: 8,

        name: "Senior Citizen Welfare Scheme",

        category: "senior",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Pension",

        description: "Welfare and pension-related scheme information for senior citizens.",

        eligibility: "Senior citizens who meet applicable scheme conditions.",

        benefit: "Pension or welfare support according to the scheme."
    },


    {
        id: 9,

        name: "General Welfare Facility",

        category: "others",

        caste: [
            "General",
            "OBC",
            "SC",
            "ST",
            "Other"
        ],

        type: "Financial Support",

        description: "General government welfare scheme information.",

        eligibility: "Eligibility depends on the individual scheme.",

        benefit: "Benefits vary according to the applicable government scheme."
    }

];


/* ================= CATEGORY DATA ================= */

let selectedCategory = "";
let selectedCaste = "";
let allSchemes = [];

const categoryInfo = {
    college: {
        title: "College Student",
        icon: "🎓"
    },

    school: {
        title: "School Student",
        icon: "🏫"
    },

    farmer: {
        title: "Farmer",
        icon: "🌾"
    },

    disabled: {
        title: "Person with Disability",
        icon: "♿"
    },

    senior: {
        title: "Senior Citizen",
        icon: "👴"
    },

    others: {
        title: "Others",
        icon: "👥"
    }
};


// ======================================
// CATEGORY
// ======================================

function selectCategory(category) {

    selectedCategory = category;

    const info = categoryInfo[category];

    document.getElementById("selectedCategoryIcon").textContent =
        info.icon;

    document.getElementById("selectedCategoryTitle").textContent =
        info.title;

    document.getElementById("homePage").classList.add("hidden");

    document.getElementById("schemesPage").classList.add("hidden");

    document.getElementById("detailsPage").classList.add("hidden");

    document.getElementById("castePage").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================
// CASTE
// ======================================

function selectCaste(caste) {

    selectedCaste = caste;

    document.getElementById("categoryBadge").textContent =
        categoryInfo[selectedCategory].title;

    document.getElementById("casteBadge").textContent =
        caste;

    document.getElementById("castePage").classList.add("hidden");

    document.getElementById("schemesPage").classList.remove("hidden");

    document.getElementById("detailsPage").classList.add("hidden");

    loadSchemes();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================
// LOAD SCHEMES FROM FLASK
// ======================================

async function loadSchemes() {

    try {

        const response = await fetch(
            `/api/schemes?category=${encodeURIComponent(selectedCategory)}&caste=${encodeURIComponent(selectedCaste)}`
        );

        const data = await response.json();

        allSchemes = data;

        displaySchemes(allSchemes);

    } catch (error) {

        console.error(error);

        document.getElementById("schemeList").innerHTML = `
            <p class="error-message">
                Unable to load schemes.
            </p>
        `;
    }
}


// ======================================
// DISPLAY SCHEMES
// ======================================

function displaySchemes(schemes) {

    const schemeList =
        document.getElementById("schemeList");

    const noResults =
        document.getElementById("noResults");

    schemeList.innerHTML = "";

    if (schemes.length === 0) {

        noResults.classList.remove("hidden");

        return;
    }

    noResults.classList.add("hidden");

    schemes.forEach(function(scheme) {

        const card = document.createElement("div");

        card.className = "scheme-card";

        card.innerHTML = `
            <div class="scheme-card-content">

                <span class="scheme-type">
                    ${scheme.type}
                </span>

                <h3>
                    ${scheme.name}
                </h3>

                <p>
                    ${scheme.description}
                </p>

                <button
                    class="view-btn"
                    onclick="openScheme(${scheme.id})">
                    View Details
                </button>

            </div>
        `;

        schemeList.appendChild(card);
    });
}


// ======================================
// SEARCH
// ======================================

function searchSchemes() {

    const searchValue =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const filtered = allSchemes.filter(function(scheme) {

        return (
            scheme.name.toLowerCase().includes(searchValue) ||
            scheme.description.toLowerCase().includes(searchValue) ||
            scheme.type.toLowerCase().includes(searchValue)
        );
    });

    displaySchemes(filtered);
}


// ======================================
// FILTER
// ======================================

function filterSchemes() {

    const type =
        document.getElementById("typeFilter").value;

    if (type === "all") {

        displaySchemes(allSchemes);

        return;
    }

    const filtered =
        allSchemes.filter(function(scheme) {

            return scheme.type === type;
        });

    displaySchemes(filtered);
}


// ======================================
// OPEN SCHEME DETAILS
// ======================================

function openScheme(id) {

    const scheme =
        allSchemes.find(function(item) {

            return item.id === id;
        });

    if (!scheme) {
        return;
    }

    document.getElementById("schemesPage")
        .classList.add("hidden");

    document.getElementById("detailsPage")
        .classList.remove("hidden");

    document.getElementById("schemeDetails").innerHTML = `

        <div class="details-card">

            <span class="scheme-type">
                ${scheme.type}
            </span>

            <h1>
                ${scheme.name}
            </h1>

            <p>
                ${scheme.description}
            </p>

            <h3>
                Eligibility
            </h3>

            <p>
                ${scheme.eligibility}
            </p>

            <h3>
                Benefits
            </h3>

            <p>
                ${scheme.benefit}
            </p>

            <button
                class="auth-submit"
                onclick="demoApply()">
                Apply / Learn More
            </button>

        </div>
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================
// DEMO APPLY
// ======================================

function demoApply() {

    window.open(
        "https://mahadbt.maharashtra.gov.in/",
        "_blank"
    );

}


// ======================================
// HOME
// ======================================

function goHome() {

    document.getElementById("homePage")
        .classList.remove("hidden");

    document.getElementById("castePage")
        .classList.add("hidden");

    document.getElementById("schemesPage")
        .classList.add("hidden");

    document.getElementById("detailsPage")
        .classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showHome() {
    goHome();
}


function showCastePage() {

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("schemesPage")
        .classList.add("hidden");

    document.getElementById("detailsPage")
        .classList.add("hidden");

    document.getElementById("castePage")
        .classList.remove("hidden");
}


function showSchemes() {

    document.getElementById("castePage")
        .classList.add("hidden");

    document.getElementById("schemesPage")
        .classList.remove("hidden");

    loadSchemes();
}


function scrollToCategories() {

    goHome();

    setTimeout(function() {

        document.getElementById("categories")
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 100);
}


function scrollToAbout() {

    goHome();

    setTimeout(function() {

        document.getElementById("about")
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 100);
}


// ======================================
// TOP SEARCH
// ======================================

function topSearchSchemes() {

    const value =
        document.getElementById("topSearch")
        .value
        .toLowerCase()
        .trim();

    if (!value) {
        return;
    }

    selectCategory("others");

    setTimeout(function() {

        selectCaste("All");

        setTimeout(function() {

            const filtered =
                allSchemes.filter(function(scheme) {

                    return (
                        scheme.name.toLowerCase()
                        .includes(value) ||
                        scheme.description.toLowerCase()
                        .includes(value)
                    );
                });

            displaySchemes(filtered);

        }, 300);

    }, 100);
}


// ======================================
// LOGIN
// ======================================

function openLogin() {

    document.getElementById("loginModal")
        .classList.remove("hidden");
}


function closeLogin() {

    document.getElementById("loginModal")
        .classList.add("hidden");
}


function openSignup() {

    document.getElementById("signupModal")
        .classList.remove("hidden");
}


function closeSignup() {

    document.getElementById("signupModal")
        .classList.add("hidden");
}


function switchToSignup() {

    closeLogin();
    openSignup();
}


function switchToLogin() {

    closeSignup();
    openLogin();
}


// ======================================
// SIGNUP
// ======================================

async function signupUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value;

    const email =
        document.getElementById("signupEmail").value;

    const mobile =
        document.getElementById("signupMobile").value;

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }

    try {

        const response = await fetch(
            "/api/signup", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    mobile,
                    password
                })
            }
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        alert(data.message);

        document.getElementById("signupForm")
            .reset();

        switchToLogin();

    } catch (error) {

        console.error(error);

        alert("Server error.");
    }
}


// ======================================
// LOGIN
// ======================================

async function loginUser(event) {

    event.preventDefault();

    const login =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response = await fetch(
            "/api/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    login,
                    password
                })
            }
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        alert(
            "Welcome " + data.name
        );

        closeLogin();

        updateLoginButton();

    } catch (error) {

        console.error(error);

        alert("Server error.");
    }
}


// ======================================
// LOGIN BUTTON STATUS
// ======================================

async function updateLoginButton() {

    try {

        const response =
            await fetch("/api/me");

        const data =
            await response.json();

        const loginButton =
            document.querySelector(".login-btn");

        if (!loginButton) {
            return;
        }

        if (data.loggedIn) {

            loginButton.textContent = "Logout";

            loginButton.onclick = logoutUser;

        } else {

            loginButton.textContent = "Login";

            loginButton.onclick = openLogin;
        }

    } catch (error) {

        console.error(error);
    }
}


// ======================================
// LOGOUT
// ======================================

async function logoutUser() {

    await fetch(
        "/api/logout", {
            method: "POST"
        }
    );

    alert("Logged out successfully.");

    updateLoginButton();
}


// ======================================
// START
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        goHome();

        updateLoginButton();

    }
);