
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveLink() {
        let currentSection = "home";

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= 160) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${currentSection}`;

            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink, {
        passive: true
    });

    // Navigate to the selected section.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(targetId);

            // Allow normal navigation if the target doesn't exist yet.
            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Update the URL without reloading the page.
            history.replaceState(null, "", targetId);
        });
    });

    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector("#primary-navigation");

    function setNavMenuOpen(open) {
        if (!navToggle || !navMenu) {
            return;
        }

        navToggle.setAttribute("aria-expanded", String(open));
        navMenu.classList.toggle("is-open", open);
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen =
                navToggle.getAttribute("aria-expanded") === "true";

            setNavMenuOpen(!isOpen);
        });

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                setNavMenuOpen(false);
            });
        });

        document.addEventListener("click", (event) => {
            if (!navMenu.classList.contains("is-open")) {
                return;
            }

            if (
                navToggle.contains(event.target) ||
                navMenu.contains(event.target)
            ) {
                return;
            }

            setNavMenuOpen(false);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setNavMenuOpen(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                navToggle.getAttribute("aria-expanded") === "true"
            ) {
                setNavMenuOpen(false);
                navToggle.focus();
            }
        });
    }

    updateActiveLink();

    // =========================
    // 2. MEMBERSHIP SELECTION
    // =========================

    const membershipCards = document.querySelectorAll(
        ".membership-card[data-plan]"
    );
    const membershipForm = document.querySelector("#membership-form");
    const planField = document.querySelector("#selected-plan");
    const planSummary = document.querySelector("#selected-plan-summary");
    const formMessage = document.querySelector("#form-message");
    let selectedPlan = "";

    function clearFormMessage() {
        if (!formMessage) {
            return;
        }

        formMessage.hidden = true;
        formMessage.textContent = "";
        formMessage.classList.remove("form-error", "form-success");
    }

    function updatePlanSummary(plan) {
        if (!planSummary) {
            return;
        }

        planSummary.textContent = plan
            ? `Selected membership: ${plan}`
            : "No membership plan selected yet.";

        planSummary.classList.toggle("has-selection", Boolean(plan));
    }

    function selectPlan(card) {
        if (!card) {
            return;
        }

        const plan = card.dataset.plan;

        if (!plan) {
            return;
        }

        membershipCards.forEach((membershipCard) => {
            membershipCard.classList.toggle(
                "selected",
                membershipCard === card
            );
        });

        selectedPlan = plan;

        try {
            sessionStorage.setItem("selectedPlan", plan);
        } catch (error) {}

        if (planField) {
            planField.value = plan;
        }

        updatePlanSummary(plan);
        clearFormMessage();
    }

    function clearSelection() {
        selectedPlan = "";

        membershipCards.forEach((card) => {
            card.classList.remove("selected");
        });

        if (planField) {
            planField.value = "";
        }

        try {
            sessionStorage.removeItem("selectedPlan");
        } catch (error) {}

        updatePlanSummary("");
        clearFormMessage();
    }

    membershipCards.forEach((card) => {
        card.classList.remove("selected");

        card.addEventListener("click", () => {
            selectPlan(card);
        });
    });

    if (membershipForm) {
        membershipForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearFormMessage();

            if (!selectedPlan) {
                if (formMessage) {
                    formMessage.textContent =
                        "Please choose a membership plan before submitting the form.";
                    formMessage.classList.add("form-error");
                    formMessage.hidden = false;
                }

                return;
            }

            if (planField) {
                planField.value = selectedPlan;
            }

            if (!membershipForm.checkValidity()) {
                membershipForm.reportValidity();
                return;
            }

            const formData = new FormData(membershipForm);
            const submittedPlan = formData.get("plan");

            if (!submittedPlan) {
                if (formMessage) {
                    formMessage.textContent =
                        "Please choose a membership plan before submitting the form.";
                    formMessage.classList.add("form-error");
                    formMessage.hidden = false;
                }

                return;
            }

            try {
                sessionStorage.setItem("selectedPlan", submittedPlan);
            } catch (error) {}

            if (formMessage) {
                formMessage.textContent =
                    `${submittedPlan} membership selected. Thank you, we will be in touch.`;
                formMessage.classList.add("form-success");
                formMessage.hidden = false;
            }
        });

        membershipForm.addEventListener("reset", () => {
            clearSelection();
        });
    }

    // =========================
    // 3. BUTTON FEEDBACK
    // =========================

    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.add("button-clicked");

            setTimeout(() => {
                button.classList.remove("button-clicked");
            }, 250);
        });
    });

    console.log("IRONCORE FITNESS JavaScript initialized.");
});
