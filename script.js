const certifications = [
  {
    badgeImage: "images/BADGE - Network Defense.png",
    courseLabel: "Network Defense | Cisco Network Academy",
    certificates: [
      "images/CERTIFICATE - Network Defense.pdf",
      "images/CISCO CERTIFICATE - Network Defense.pdf",
    ],
  },
  {
    badgeImage: "images/BADGE - Introduction to Cybersecurity.png",
    courseLabel: "Introduction to Cybersecurity | Cisco Network Academy",
    certificates: [
      "images/CERTIFICATE - Intro to Cybersecurity.pdf",
      "images/CISCO CERTIFICATE - Introduction to Cybersecurity.pdf",
    ],
  },
  {
    badgeImage: "images/BADGE - Introduction to Data Science.png",
    courseLabel: "Introduction to Data Science | Cisco Network Academy",
    certificates: [
      "images/CERTIFICATE - Introduction to Data Science.pdf",
      "images/CISCO CERTIFICATE - Introduction to Data Science.pdf",
    ],
  },
];

const badgeTrack = document.getElementById("badge-track");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const themeToggle = document.getElementById("theme-toggle");

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  themeToggle.dataset.mode = theme;
};

setTheme(getPreferredTheme());

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";

  setTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
});

const createCertificateLinks = (paths) => {
  const list = document.createElement("ul");
  list.className = "pdf-list";

  paths.forEach((pdfPath) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const fileName = pdfPath.split("/").pop();

    link.href = pdfPath;
    link.download = fileName;
    link.textContent = fileName.replace(/\.pdf$/i, "");
    item.appendChild(link);
    list.appendChild(item);
  });

  return list;
};

const createCard = (certification) => {
  const [titleText, sourceText] = certification.courseLabel
    .split("|")
    .map((value) => value.trim());

  const card = document.createElement("article");
  card.className = "badge-card";

  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.className = "badge-image-btn";

  const image = document.createElement("img");
  image.src = certification.badgeImage;
  image.alt = `${titleText} badge`;
  image.className = "badge-image";
  image.loading = "lazy";

  imageButton.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = titleText;

  const source = document.createElement("p");
  source.className = "badge-source";
  source.textContent = sourceText || "";

  const dropdown = document.createElement("details");
  dropdown.className = "pdf-dropdown";

  const summary = document.createElement("summary");
  summary.textContent = "Certificates";

  dropdown.appendChild(summary);
  dropdown.appendChild(createCertificateLinks(certification.certificates));

  imageButton.addEventListener("click", () => {
    lightboxImage.src = certification.badgeImage;
    lightboxImage.alt = `${titleText} badge preview`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });

  card.appendChild(imageButton);
  card.appendChild(title);
  card.appendChild(source);
  card.appendChild(dropdown);

  return card;
};

const buildCards = () => {
  certifications.forEach((certification) => {
    badgeTrack.appendChild(createCard(certification));
  });
};

const updateCarouselButtons = () => {
  const maxScrollLeft = badgeTrack.scrollWidth - badgeTrack.clientWidth;
  const hasOverflow = maxScrollLeft > 1;

  if (!hasOverflow) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    return;
  }

  const atStart = badgeTrack.scrollLeft <= 1;
  const atEnd = badgeTrack.scrollLeft >= maxScrollLeft - 1;

  prevBtn.hidden = atStart;
  nextBtn.hidden = atEnd;
};

const scrollCarousel = (direction) => {
  const card = badgeTrack.querySelector(".badge-card");
  const cardWidth = card ? card.getBoundingClientRect().width : 320;
  const gap = 16;
  badgeTrack.scrollBy({
    left: direction * (cardWidth + gap),
    behavior: "smooth",
  });
};

prevBtn.addEventListener("click", () => scrollCarousel(-1));
nextBtn.addEventListener("click", () => scrollCarousel(1));
badgeTrack.addEventListener("scroll", updateCarouselButtons);
window.addEventListener("resize", updateCarouselButtons);
window.addEventListener("load", updateCarouselButtons);

const closeLightbox = () => {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

buildCards();
updateCarouselButtons();
