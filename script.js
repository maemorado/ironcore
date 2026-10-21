
document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // 1. NAVIGATION
    // =========================

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

    updateActiveLink();

    // =========================
    // 2. MEMBERSHIP BUTTONS
    // =========================

    const membershipButtons = document.querySelectorAll("[data-plan]");

    membershipButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedPlan = button.dataset.plan;

            // Save the selected plan for the contact form.
            sessionStorage.setItem("selectedPlan", selectedPlan);

            // Navigate to the contact section if it exists.
            const contactSection = document.querySelector("#contact");

            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", "#contact");

                const planField = document.querySelector("#selected-plan");

                if (planField) {
                    planField.value = selectedPlan;
                }
            } else {
                // Contact section will be added in the next step.
                alert(
                    `${selectedPlan} plan selected! The contact section is coming next.`
                );
            }
        });
    });

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
