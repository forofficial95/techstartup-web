
"use strict";

// ============================================
// PATEL ESTATE - WEBSITE CONFIGURATION
// Replace these details with your real contacts.
// ============================================

const CONFIG = {
  email: "hello@patelestate.example",
  phone: "", // Example: "+919876543210"
  currency: "INR",
  locale: "en-IN"
};

// Sample listings for demonstration.
// Update names, locations, prices, and images as needed.

const properties = [
  {
    id: 1,
    title: "The Greenwood Villa",
    location: "Kolhapur, Maharashtra",
    area: "Kolhapur",
    type: "house",
    purpose: "sale",
    price: 12500000,
    beds: 4,
    baths: 3,
    size: 2400,
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=85",
    description: "A spacious contemporary villa with generous living areas, a modern kitchen and outdoor space. An example listing for a family looking for comfort and room to grow."
  },
  {
    id: 2,
    title: "The Urban Residence",
    location: "Pune, Maharashtra",
    area: "Pune",
    type: "apartment",
    purpose: "sale",
    price: 7800000,
    beds: 3,
    baths: 2,
    size: 1450,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    description: "A modern apartment concept with an open living area, bright interiors and a practical layout. Confirm the actual specifications before advertising."
  },
  {
    id: 3,
    title: "Serene Garden Home",
    location: "Nashik, Maharashtra",
    area: "Nashik",
    type: "house",
    purpose: "rent",
    price: 35000,
    beds: 3,
    baths: 3,
    size: 1800,
    tag: "For rent",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
    description: "A sample rental home concept with multiple bedrooms and an inviting interior. Confirm the rent, deposit and availability with the property owner."
  },
  {
    id: 4,
    title: "The Skyline Apartment",
    location: "Mumbai, Maharashtra",
    area: "Mumbai",
    type: "apartment",
    purpose: "rent",
    price: 55000,
    beds: 2,
    baths: 2,
    size: 1100,
    tag: "New listing",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    description: "A sample city apartment listing with a contemporary interior and efficient floor plan. Verify its actual location, furnishings and rental terms."
  },
  {
    id: 5,
    title: "The Signature Estate",
    location: "Satara, Maharashtra",
    area: "Satara",
    type: "house",
    purpose: "sale",
    price: 18500000,
    beds: 5,
    baths: 4,
    size: 3200,
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
    description: "A premium home concept featuring spacious rooms and contemporary architectural styling. This is a demonstration listing, not a confirmed property offer."
  },
  {
    id: 6,
    title: "The Business Hub",
    location: "Pune, Maharashtra",
    area: "Pune",
    type: "commercial",
    purpose: "rent",
    price: 80000,
    beds: 0,
    baths: 1,
    size: 1800,
    tag: "Commercial",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
    description: "A sample commercial office concept suited to businesses looking for a professional workspace. Confirm the actual premises and lease conditions."
  }
];

// ============================================
// DOM REFERENCES
// ============================================

const propertyGrid = document.getElementById("propertyGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const searchForm = document.getElementById("searchForm");
const purposeSelect = document.getElementById("purpose");
const locationInput = document.getElementById("location");
const propertyTypeSelect = document.getElementById("propertyType");
const filterButtons = document.querySelectorAll(".filter-chip");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const propertyDialog = document.getElementById("propertyDialog");
const dialogContent = document.getElementById("dialogContent");

// Store favourites in this browser when localStorage is available.
let favourites = new Set();

try {
  const saved = JSON.parse(localStorage.getItem("patelEstateFavourites") || "[]");
  if (Array.isArray(saved)) {
    favourites = new Set(saved.filter(Number.isInteger));
  }
} catch {
  favourites = new Set();
}

let activeQuickFilter = "all";

// ============================================
// HELPERS
// ============================================

function formatPrice(price, purpose) {
  const formatted = new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 0
  }).format(price);

  return purpose === "rent"
    ? `${formatted}<small> / month</small>`
    : formatted;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function propertyTypeLabel(type) {
  const labels = {
    house: "House / Villa",
    apartment: "Apartment",
    commercial: "Commercial"
  };

  return labels[type] || "Property";
}

function propertyPurposeLabel(purpose) {
  return purpose === "rent" ? "For rent" : "For sale";
}

function getProperty(id) {
  return properties.find(property => property.id === Number(id));
}

// ============================================
// RENDER PROPERTY CARDS
// ============================================

function renderProperties(items) {
  propertyGrid.innerHTML = items.map(property => {
    const isSaved = favourites.has(property.id);

    return `
      <article class="property-card">
        <div class="property-image">
          <img
            src="${escapeHTML(property.image)}"
            alt="${escapeHTML(property.title)}"
            loading="lazy"
          >
          <span class="property-tag">${escapeHTML(property.tag)}</span>
          <button
            class="favorite-button ${isSaved ? "saved" : ""}"
            type="button"
            data-favorite="${property.id}"
            aria-label="${isSaved ? "Remove from" : "Add to"} favourites: ${escapeHTML(property.title)}"
            aria-pressed="${isSaved}"
          >${isSaved ? "♥" : "♡"}</button>
        </div>

        <div class="property-body">
          <p class="property-location">⌖ ${escapeHTML(property.location)}</p>
          <h3 class="property-title">${escapeHTML(property.title)}</h3>
          <div class="property-price">
            ${formatPrice(property.price, property.purpose)}
          </div>

          <div class="property-meta">
            <span>⌂ ${property.beds ? `${property.beds} Beds` : "Office"}</span>
            <span>◫ ${property.baths} Baths</span>
            <span>▱ ${property.size.toLocaleString("en-IN")} sq.ft.</span>
          </div>

          <div class="property-footer">
            <span>${propertyTypeLabel(property.type)} · ${propertyPurposeLabel(property.purpose)}</span>
            <button class="details-button" type="button" data-details="${property.id}">
              View details ↗
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  resultsCount.textContent =
    `${items.length} ${items.length === 1 ? "property" : "properties"} found`;

  emptyState.hidden = items.length > 0;
  propertyGrid.hidden = items.length === 0;
}

// ============================================
// SEARCH AND FILTERS
// ============================================

function applyFilters(event) {
  if (event) event.preventDefault();

  const purpose = purposeSelect.value;
  const location = locationInput.value.trim().toLowerCase();
  const type = propertyTypeSelect.value;

  const filtered = properties.filter(property => {
    const matchesPurpose =
      purpose === "all" || property.purpose === purpose;

    const matchesLocation =
      !location ||
      property.location.toLowerCase().includes(location) ||
      property.area.toLowerCase().includes(location);

    const matchesType =
      type === "all" || property.type === type;

    const matchesQuickFilter =
      activeQuickFilter === "all" ||
      property.purpose === activeQuickFilter;

    return (
      matchesPurpose &&
      matchesLocation &&
      matchesType &&
      matchesQuickFilter
    );
  });

  renderProperties(filtered);
}

searchForm.addEventListener("submit", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeQuickFilter = button.dataset.filter;

    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    // Keep the search controls in sync with quick filters.
    purposeSelect.value =
      activeQuickFilter === "all" ? "all" : activeQuickFilter;

    applyFilters();
  });
});

document.getElementById("resetFilters").addEventListener("click", event => {
  event.preventDefault();
  clearFilters();
});

document.getElementById("clearSearch").addEventListener("click", clearFilters);

function clearFilters() {
  purposeSelect.value = "all";
  locationInput.value = "";
  propertyTypeSelect.value = "all";
  activeQuickFilter = "all";

  filterButtons.forEach(button => {
    const active = button.dataset.filter === "all";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderProperties(properties);
}

// ============================================
// FAVOURITES
// ============================================

propertyGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-favorite]");
  if (!button) return;

  const id = Number(button.dataset.favorite);

  if (favourites.has(id)) {
    favourites.delete(id);
  } else {
    favourites.add(id);
  }

  try {
    localStorage.setItem(
      "patelEstateFavourites",
      JSON.stringify([...favourites])
    );
  } catch {
    // Favourites still work until this page is refreshed.
  }

  applyFilters();
});

// ============================================
// PROPERTY DETAILS DIALOG
// ============================================

propertyGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");
  if (!button) return;

  showPropertyDetails(button.dataset.details);
});

function showPropertyDetails(id) {
  const property = getProperty(id);
  if (!property) return;

  const enquiryText =
    `Hello Patel Estate, I am interested in "${property.title}" in ` +
    `${property.location}. Please share more information.`;

  dialogContent.innerHTML = `
    <img
      class="dialog-image"
      src="${escapeHTML(property.image)}"
      alt="${escapeHTML(property.title)}"
    >

    <div class="dialog-body">
      <span class="eyebrow">${escapeHTML(propertyTypeLabel(property.type))} · ${escapeHTML(propertyPurposeLabel(property.purpose))}</span>
      <h2>${escapeHTML(property.title)}</h2>
      <p>⌖ ${escapeHTML(property.location)}</p>

      <div class="dialog-price">
        ${formatPrice(property.price, property.purpose)}
      </div>

      <div class="dialog-meta">
        <span>${property.beds ? `${property.beds} Bedrooms` : "Office space"}</span>
        <span>${property.baths} Bathrooms</span>
        <span>${property.size.toLocaleString("en-IN")} sq.ft.</span>
      </div>

      <p>${escapeHTML(property.description)}</p>

      <a class="button button-dark" href="#contact" id="dialogEnquiry">
        Enquire about this property ↗
      </a>
    </div>
  `;

  if (typeof propertyDialog.showModal === "function") {
    propertyDialog.showModal();
  } else {
    // Fallback for browsers without dialog support.
    propertyDialog.setAttribute("open", "");
  }

  document.getElementById("dialogEnquiry").addEventListener("click", () => {
    document.getElementById("contactMessage").value = enquiryText;

    if (propertyDialog.open && typeof propertyDialog.close === "function") {
      propertyDialog.close();
    } else {
      propertyDialog.removeAttribute("open");
    }
  });
}

document.getElementById("dialogClose").addEventListener("click", () => {
  if (typeof propertyDialog.close === "function" && propertyDialog.open) {
    propertyDialog.close();
  } else {
    propertyDialog.removeAttribute("open");
  }
});

propertyDialog.addEventListener("click", event => {
  if (event.target === propertyDialog) {
    propertyDialog.close();
  }
});

// ============================================
// MOBILE NAVIGATION
// ============================================

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

// ============================================
// CONTACT DETAILS AND ENQUIRY FORM
// ============================================

const emailElement = document.getElementById("contactEmail");
const phoneElement = document.getElementById("contactPhone");

emailElement.textContent = CONFIG.email;

if (CONFIG.phone.trim()) {
  const cleanPhone = CONFIG.phone.replace(/[^\d+]/g, "");
  phoneElement.innerHTML =
    `<a href="tel:${escapeHTML(cleanPhone)}">${escapeHTML(CONFIG.phone)}</a>`;
} else {
  phoneElement.textContent = "Add your phone number";
}

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactUserEmail").value.trim();
  const interest = document.getElementById("contactInterest").value;
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all required fields.";
    return;
  }

  if (!emailElement.textContent.includes("@") ||
      emailElement.textContent.endsWith(".example")) {
    formStatus.textContent =
      "Please configure your real business email in script.js first.";
    return;
  }

  const subject = `Patel Estate enquiry: ${interest}`;

  const body = [
    "Hello Patel Estate,",
    "",
    `My name is ${name}.`,
    `My email: ${email}`,
    `I'm interested in: ${interest}`,
    "",
    "My message:",
    message
  ].join("\n");

  const mailto =
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  formStatus.textContent = "Opening your email application...";

  // Opens the visitor's configured email application.
  window.location.href = mailto;
});

// ============================================
// FOOTER YEAR AND INITIAL RENDER
// ============================================

document.getElementById("year").textContent = new Date().getFullYear();

renderProperties(properties);

filterButtons.forEach(button => {
  button.setAttribute(
    "aria-pressed",
    String(button.dataset.filter === "all")
  );
});
