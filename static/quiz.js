(function (global) {
  "use strict";

  var IMG = "/static/quiz_img/";

  var CHROME = {
    tryAnother: "TRY ANOTHER",
    guessAgain: "GUESS AGAIN",
    bloom: "…blooming…",
    close: "Close quiz",
    notQuite: "NOT QUITE!",
    tryAnotherBody: "Try another.",
    quizLabel: "Hawker quiz"
  };

  var QUIZZES = {
    laksa: {
      id: "laksa",
      rumKey: "laksa",
      completeImage: IMG + "laksa_6.png",
      opening: {
        kicker: "Singapore laksa",
        title: "MAKE A BOWL OF LAKSA",
        subcopy: "Spicy. Creamy. Shiok.\nThink you can assemble the bowl?",
        image: IMG + "laksa_6.png",
        cta: "LET’S COOK"
      },
      result: {
        kicker: "Served",
        title: "SHIOK!",
        subtitle: "LAKSA COMPLETE",
        body: "You fried the rempah, poured the broth, and loaded the bowl.",
        brewLine: "Your bowl:",
        stars: "★★★★★",
        stats: [
          { label: "Spice", fill: 80 },
          { label: "Creaminess", fill: 100 },
          { label: "Slurpability", fill: 100 }
        ]
      },
      steps: [
        {
          id: 1,
          view: "step-1",
          kicker: "Step 1 — Start with the rempah",
          title: "WHERE DOES ALL THAT LAKSA FLAVOUR BEGIN?",
          image: IMG + "laksa_1.png",
          layout: "cards",
          choices: [
            { id: "butter", emoji: "🧈", label: "Butter and black pepper", correct: false },
            { id: "tomato", emoji: "🍅", label: "Tomato and basil", correct: false },
            { id: "rempah", emoji: "🌶️", label: "Chilli, shallots, garlic and aromatic spices", correct: true },
            { id: "soy", emoji: "🥫", label: "Soy sauce and sugar", correct: false }
          ],
          correct: {
            title: "REM-PAH-PAH!",
            body: "Laksa begins with rempah — a fragrant spice paste built from chilli and Southeast Asian aromatics.\n\nThis becomes the foundation of the broth.",
            cta: "FIRE UP THE WOK →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "That one won’t give us the rempah we’re after."
        },
        {
          id: 2,
          view: "step-2",
          kicker: "Step 2 — Don’t rush the rempah",
          title: "THE REMPAH IS READY. WHAT DO WE DO WITH IT?",
          image: IMG + "laksa_2.png",
          layout: "cards",
          choices: [
            { id: "ice", emoji: "🧊", label: "Add ice", correct: false },
            { id: "bowl", emoji: "🥣", label: "Put it straight into the serving bowl", correct: false },
            { id: "fry", emoji: "🔥", label: "Fry it in oil until fragrant", correct: true },
            { id: "rinse", emoji: "💧", label: "Rinse it with water", correct: false }
          ],
          correct: {
            title: "FRY UNTIL FRAGRANT.",
            body: "Cooking the rempah develops its aroma and flavour.\n\nAs it cooks, the paste becomes darker and glossier and aromatic oil begins to appear around it.",
            cta: "MAKE IT CREAMY →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "Don’t skip the fry — we need that fragrance first."
        },
        {
          id: 3,
          view: "step-3",
          kicker: "Step 3 — Make it rich",
          title: "WHAT TURNS THE REMPAH INTO THAT CREAMY ORANGE BROTH?",
          image: IMG + "laksa_3.png",
          layout: "cards",
          choices: [
            { id: "sparkling", emoji: "🫧", label: "Sparkling water", correct: false },
            { id: "juice", emoji: "🧃", label: "Tomato juice", correct: false },
            { id: "coconut", emoji: "🥥", label: "Coconut milk with stock", correct: true },
            { id: "cold-milk", emoji: "🥛", label: "Plain cold milk", correct: false }
          ],
          correct: {
            title: "NOW WE’RE TALKING.",
            body: "Coconut milk gives the broth its creamy body while the rempah brings heat, spice and aroma.\n\nTogether they create that rich orange laksa broth.",
            cta: "NOODLE TIME →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "We need coconut milk with stock for that creamy orange broth."
        },
        {
          id: 4,
          view: "step-4",
          kicker: "Step 4 — Pick your noodle",
          title: "WHICH NOODLES ARE GOING INTO THE BOWL?",
          image: IMG + "laksa_4.png",
          layout: "cards",
          choices: [
            { id: "spaghetti", emoji: "🍝", label: "Italian spaghetti", correct: false },
            { id: "soba", emoji: "🍜", label: "Japanese soba", correct: false },
            { id: "vermicelli", emoji: "🥢", label: "Thick rice vermicelli", correct: true },
            { id: "instant", emoji: "📦", label: "Yellow instant noodles", correct: false }
          ],
          correct: {
            title: "RICE NOODLES, PLEASE.",
            body: "Thick rice vermicelli pairs beautifully with the rich laksa broth.\n\nFor a Katong-inspired style, the noodles can even be cut shorter for easy spooning.",
            cta: "BUILD THAT BOWL →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "This bowl wants thick rice vermicelli, not a stand-in."
        },
        {
          id: 5,
          view: "step-5",
          kicker: "Step 5 — Pour it together",
          title: "NOODLES ARE IN. WHAT HAPPENS NEXT?",
          image: IMG + "laksa_5.png",
          layout: "cards",
          choices: [
            { id: "pour", emoji: "🍲", label: "Pour in the laksa broth, then add the prepared toppings", correct: true },
            { id: "dry", emoji: "🚫", label: "Serve the noodles completely dry", correct: false },
            { id: "chicken", emoji: "🐔", label: "Add poached chicken and cucumber", correct: false },
            { id: "water", emoji: "💧", label: "Fill the bowl with plain cold water", correct: false }
          ],
          correct: {
            title: "POUR, THEN LOAD.",
            body: "First the rich coconut broth surrounds the noodles.\n\nThen prawns, tofu puffs, fish cake, bean sprouts and laksa leaves finish the bowl.\n\nThose tofu puffs will soak up all that broth nicely.",
            cta: "SERVE IT!"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "Pour the broth, then load the toppings — don’t skip the soup."
        }
      ]
    },
    "chicken-rice": {
      id: "chicken-rice",
      rumKey: "chicken-rice",
      completeImage: IMG + "chickenrice_6.png",
      opening: {
        kicker: "Hainanese chicken rice",
        title: "MAKE HAINANESE CHICKEN RICE",
        subcopy: "Tender. Fragrant. Steady.\nThink you know the hawker plate?",
        image: IMG + "chickenrice_6.png",
        cta: "LET’S COOK"
      },
      result: {
        kicker: "Served",
        title: "STEADY LAH!",
        subtitle: "CHICKEN RICE COMPLETE",
        body: "You poached it right, chilled it, and built the plate.",
        brewLine: "Your plate:",
        stars: "★★★★★",
        stats: [
          { label: "Chicken: juicy", fill: 100 },
          { label: "Rice: fragrant", fill: 100 },
          { label: "Chilli: handled", fill: 80 }
        ]
      },
      steps: [
        {
          id: 1,
          view: "step-1",
          kicker: "Step 1 — Spa day for chicken",
          title: "HOW SHOULD WE COOK THE CHICKEN?",
          image: IMG + "chickenrice_1.png",
          layout: "cards",
          choices: [
            { id: "fry", emoji: "🍳", label: "Deep-fry it until crispy", correct: false },
            { id: "roast", emoji: "🔥", label: "Roast it over high heat", correct: false },
            { id: "poach", emoji: "🍲", label: "Gently poach it in aromatic broth", correct: true },
            { id: "grill", emoji: "🥩", label: "Grill it over charcoal", correct: false }
          ],
          correct: {
            title: "LOW AND SLOW.",
            body: "Gentle poaching helps keep the chicken tender and juicy while ginger and spring onion flavour the broth.",
            cta: "COOL IT DOWN →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "This chicken wants a gentle poach, not a hard sear."
        },
        {
          id: 2,
          view: "step-2",
          kicker: "Step 2 — Chill, chicken",
          title: "CHICKEN’S COOKED. WHAT HAPPENS NEXT?",
          image: IMG + "chickenrice_2.png",
          layout: "cards",
          choices: [
            { id: "oven", emoji: "🔥", label: "Put it straight into the oven", correct: false },
            { id: "ice", emoji: "🧊", label: "Cool it quickly in cold or iced water", correct: true },
            { id: "flour", emoji: "🌾", label: "Coat it in flour", correct: false },
            { id: "refry", emoji: "🍳", label: "Fry it again", correct: false }
          ],
          correct: {
            title: "STRAIGHT INTO THE COLD.",
            body: "Cooling stops the chicken from continuing to cook and helps preserve its tender texture and smooth skin.",
            cta: "RICE TIME →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "Chill it first — that ice bath is doing real work."
        },
        {
          id: 3,
          view: "step-3",
          kicker: "Step 3 — The rice is not just rice",
          title: "WHAT GIVES CHICKEN RICE ITS BIG FLAVOUR?",
          image: IMG + "chickenrice_3.png",
          layout: "cards",
          choices: [
            { id: "water", emoji: "💧", label: "Plain water only", correct: false },
            { id: "coconut", emoji: "🥥", label: "Coconut milk and sugar", correct: false },
            { id: "stock", emoji: "🍗", label: "Chicken stock, ginger, garlic and chicken fat or oil", correct: true },
            { id: "chilli-oil", emoji: "🌶️", label: "Soy sauce and chilli oil", correct: false }
          ],
          correct: {
            title: "THAT’S THE GOOD STUFF.",
            body: "The rice cooks in savoury chicken stock with aromatics, giving it the fragrance that makes chicken rice more than just chicken plus rice.",
            cta: "SAUCE TIME →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "The rice needs chicken stock and aromatics, not a shortcut."
        },
        {
          id: 4,
          view: "step-4",
          kicker: "Step 4 — Sauce boss",
          title: "WHICH SAUCE BELONGS WITH CHICKEN RICE?",
          image: IMG + "chickenrice_4.png",
          layout: "cards",
          choices: [
            { id: "ketchup", emoji: "🍅", label: "Tomato ketchup", correct: false },
            { id: "cheese", emoji: "🧀", label: "Cheese sauce", correct: false },
            { id: "chilli", emoji: "🌶️", label: "Fresh chilli sauce with ginger and garlic", correct: true },
            { id: "mayo", emoji: "🥄", label: "Mayonnaise", correct: false }
          ],
          correct: {
            title: "BRING THE HEAT.",
            body: "Fresh chilli sauce cuts through the richness of the chicken and fragrant rice.\n\nChicken rice is also commonly served with ginger-scallion sauce and dark soy.",
            cta: "BUILD THE PLATE →"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "This plate wants fresh chilli sauce, not a condiment swap."
        },
        {
          id: 5,
          view: "step-5",
          kicker: "Step 5 — Build the plate",
          title: "RICE READY. CUCUMBER READY. WHAT GOES ON NEXT?",
          image: IMG + "chickenrice_5.png",
          layout: "cards",
          choices: [
            { id: "slice", emoji: "🐔", label: "Place the sliced poached chicken beside the rice", correct: true },
            { id: "curry", emoji: "🍛", label: "Pour coconut curry over the rice", correct: false },
            { id: "fried", emoji: "🍳", label: "Mix everything into fried rice", correct: false },
            { id: "cheese-cover", emoji: "🧀", label: "Cover the plate with cheese", correct: false }
          ],
          correct: {
            title: "COMING TOGETHER.",
            body: "Now the tender chicken joins the fragrant rice and cucumber.\n\nKeep the chilli, ginger sauce and dark soy on the side and the plate is ready to serve.",
            cta: "SERVE IT!"
          },
          wrongTitle: "NOT QUITE!",
          wrongBody: "Slice the poached chicken onto the plate — keep it simple."
        }
      ]
    }
  };

  var root = null;
  var onCloseCallback = null;
  var state = {
    quizId: null,
    screen: "opening",
    stepIndex: 0,
    beatIndex: 0,
    locked: false,
    vitalOpen: false,
    startedAt: 0,
    stepStartedAt: 0,
    feedback: null
  };

  function tx(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value.en || "";
  }

  function rum(fn) {
    try {
      if (global.DD_RUM) fn(global.DD_RUM);
    } catch (err) {
      console.warn("RUM tracking error (non-critical):", err);
    }
  }

  function quiz() {
    return QUIZZES[state.quizId];
  }

  function viewName(screen) {
    return "/game/quiz/" + quiz().rumKey + "/" + screen;
  }

  function startView(screen) {
    rum(function (r) {
      if (typeof r.startView === "function") {
        r.startView({ name: viewName(screen) });
      }
      if (typeof r.setViewContextProperty === "function") {
        r.setViewContextProperty("quiz", quiz().rumKey);
        r.setViewContextProperty("quiz_step", screen);
      }
    });
  }

  function restoreGameView() {
    rum(function (r) {
      if (typeof r.startView === "function") {
        r.startView({ name: "/game" });
      }
    });
  }

  function startJourneyVital() {
    rum(function (r) {
      if (typeof r.startDurationVital === "function") {
        r.startDurationVital("quiz." + quiz().rumKey);
        state.vitalOpen = true;
      }
    });
  }

  function stopJourneyVital() {
    if (!state.vitalOpen) return;
    rum(function (r) {
      if (typeof r.stopDurationVital === "function") {
        r.stopDurationVital("quiz." + quiz().rumKey);
      }
    });
    state.vitalOpen = false;
  }

  function startStepVital(stepId) {
    rum(function (r) {
      if (typeof r.startDurationVital === "function") {
        r.startDurationVital("quiz." + quiz().rumKey + ".step-" + stepId);
      }
    });
    state.stepStartedAt = Date.now();
  }

  function stopStepVital(stepId) {
    rum(function (r) {
      if (typeof r.stopDurationVital === "function") {
        r.stopDurationVital("quiz." + quiz().rumKey + ".step-" + stepId);
      }
    });
  }

  function addAction(name, attrs) {
    rum(function (r) {
      if (typeof r.addAction === "function") r.addAction(name, attrs || {});
    });
  }

  function esc(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nl(text) {
    return esc(text).replace(/\n/g, "<br>");
  }

  function ensureRoot() {
    if (root) return root;
    root = document.getElementById("quiz-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "quiz-root";
      document.body.appendChild(root);
    }
    return root;
  }

  function progressHtml() {
    var steps = quiz().steps;
    var dots = "";
    var i;
    var current = state.screen === "complete" ? steps.length : state.screen === "opening" ? -1 : state.stepIndex;
    for (i = 0; i < steps.length; i += 1) {
      var cls = "quiz-dot";
      if (i < current) cls += " is-done";
      if (i === current) cls += " is-current";
      dots += '<span class="' + cls + '"></span>';
    }
    return dots;
  }

  function shell(inner) {
    return (
      '<div class="quiz-overlay" role="dialog" aria-modal="true" aria-label="' + esc(tx(CHROME.quizLabel)) + '">' +
        '<div class="quiz-shell">' +
          '<div class="quiz-topbar">' +
            '<div class="quiz-progress" aria-hidden="true">' + progressHtml() + "</div>" +
            '<button type="button" class="quiz-close" data-quiz-close aria-label="' + esc(tx(CHROME.close)) + '">×</button>' +
          "</div>" +
          '<div class="quiz-stage">' + inner + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function sceneHtml(src, tappable) {
    return (
      '<div class="quiz-scene' + (tappable ? " is-tappable" : "") + '"' +
        (tappable ? ' data-tap-scene="1"' : "") + ">" +
        '<img src="' + esc(src) + '" alt="">' +
      "</div>"
    );
  }

  function cardHtml(choice) {
    var extra = "";
    if (choice.swatch) {
      extra = '<div class="quiz-stage-swatch ' + esc(choice.swatch) + '"></div>';
    } else if (choice.emoji) {
      extra = '<span class="quiz-card-emoji">' + choice.emoji + "</span>";
    }
    return (
      '<button type="button" class="quiz-card" data-choice="' + esc(choice.id) + '" data-dd-action-name="quiz_choice_' + esc(choice.id) + '">' +
        extra +
        '<span class="quiz-card-label">' + nl(tx(choice.label)) + "</span>" +
      "</button>"
    );
  }

  function cardsHtml(choices, layout) {
    var cls = "quiz-cards";
    if (layout === "actions") cls += " is-actions";
    if (layout === "stages") cls += " is-stages";
    var html = '<div class="' + cls + '">';
    var i;
    for (i = 0; i < choices.length; i += 1) html += cardHtml(choices[i]);
    return html + "</div>";
  }

  function render(opts) {
    opts = opts || {};
    var skipView = !!opts.skipView;
    var q = quiz();
    var html;
    if (!opts.keepLock) state.locked = false;
    if (state.screen === "opening") {
      if (!skipView) startView("opening");
      html = shell(
        '<p class="quiz-kicker">' + esc(tx(q.opening.kicker)) + "</p>" +
        '<h2 class="quiz-title">' + nl(tx(q.opening.title)) + "</h2>" +
        '<p class="quiz-subcopy">' + nl(tx(q.opening.subcopy)) + "</p>" +
        sceneHtml(q.opening.image, false) +
        '<button type="button" class="quiz-primary" data-quiz-begin data-dd-action-name="quiz_begin">' +
          esc(tx(q.opening.cta)) +
        "</button>"
      );
    } else if (state.screen === "complete") {
      if (!skipView) startView("complete");
      html = shell(
        '<p class="quiz-kicker">' + esc(tx(q.result.kicker)) + "</p>" +
        sceneHtml(q.completeImage, false) +
        '<h2 class="quiz-title">' + esc(tx(q.result.title)) + "</h2>" +
        '<p class="quiz-subcopy"><strong>' + esc(tx(q.result.subtitle)) + "</strong></p>" +
        '<p class="quiz-subcopy">' + nl(tx(q.result.body)) + "</p>" +
        '<p class="quiz-subcopy">' + esc(tx(q.result.brewLine)) + "</p>" +
        '<div class="quiz-stars">' + esc(q.result.stars) + "</div>" +
        statsHtml(q.result.stats) +
        '<button type="button" class="quiz-primary" data-quiz-again data-dd-action-name="quiz_guess_again">' +
          esc(tx(CHROME.guessAgain)) +
        "</button>"
      );
    } else {
      html = shell(stepInnerHtml());
    }
    ensureRoot().innerHTML = html;
    bind();
  }

  function statsHtml(stats) {
    var html = '<div class="quiz-stats">';
    var i;
    for (i = 0; i < stats.length; i += 1) {
      html +=
        '<div class="quiz-stat"><span>' + esc(tx(stats[i].label)) + "</span>" +
        '<div class="quiz-bar"><span style="width:' + stats[i].fill + '%"></span></div></div>';
    }
    return html + "</div>";
  }

  function currentStep() {
    return quiz().steps[state.stepIndex];
  }

  function currentBeat() {
    var step = currentStep();
    if (!step.beats) return null;
    return step.beats[state.beatIndex];
  }

  function stepInnerHtml() {
    var step = currentStep();
    var beat = currentBeat();
    var title = beat && beat.title ? beat.title : step.title;
    var image = beat && beat.image ? beat.image : step.image;
    var hint = beat && beat.hint ? '<p class="quiz-hint">' + esc(tx(beat.hint)) + "</p>" : "";
    var layout = beat ? beat.layout : step.layout;
    var tappable = layout === "tap-scene";
    var choices = beat && beat.choices ? beat.choices : step.choices;
    var body =
      '<p class="quiz-kicker">' + esc(tx(step.kicker)) + "</p>" +
      '<h2 class="quiz-title">' + nl(tx(title)) + "</h2>" +
      sceneHtml(image, tappable) +
      hint;
    if (choices && layout !== "tap-scene") body += cardsHtml(choices, layout);
    body += '<div class="quiz-feedback" hidden></div>';
    return body;
  }

  function bind() {
    var overlay = ensureRoot().querySelector(".quiz-overlay");
    if (!overlay) return;

    overlay.querySelectorAll("[data-quiz-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    overlay.querySelectorAll("[data-quiz-begin]").forEach(function (btn) {
      btn.addEventListener("click", begin);
    });
    overlay.querySelectorAll("[data-quiz-again]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    overlay.querySelectorAll("[data-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        onChoice(btn.getAttribute("data-choice"), btn);
      });
    });
    overlay.querySelectorAll("[data-tap-scene]").forEach(function (scene) {
      scene.addEventListener("click", function () {
        onSceneTap();
      });
    });
  }

  function feedbackHost() {
    return ensureRoot().querySelector(".quiz-feedback");
  }

  function showWrong(choice, btn) {
    var step = currentStep();
    var beat = currentBeat();
    var title = tx((choice && choice.wrongTitle) || (beat && beat.wrongTitle) || step.wrongTitle || CHROME.notQuite);
    var body = tx((beat && beat.wrongBody) || step.wrongBody || CHROME.tryAnotherBody);
    if (choice) state.feedback = { type: "wrong", choiceId: choice.id };
    if (btn) {
      btn.classList.remove("is-wrong");
      void btn.offsetWidth;
      btn.classList.add("is-wrong");
    }
    var host = feedbackHost();
    host.hidden = false;
    host.innerHTML =
      '<div class="quiz-feedback-title">' + esc(title) + "</div>" +
      '<p class="quiz-feedback-body">' + nl(body) + "</p>" +
      '<button type="button" class="quiz-secondary" data-try-another>' + esc(tx(CHROME.tryAnother)) + "</button>";
    host.querySelector("[data-try-another]").addEventListener("click", function () {
      state.feedback = null;
      host.hidden = true;
      host.innerHTML = "";
      if (btn) btn.classList.remove("is-wrong");
    });
  }

  function advanceAfterCorrect() {
    state.feedback = null;
    if (state.stepIndex >= quiz().steps.length - 1) {
      completeQuiz();
      return;
    }
    state.stepIndex += 1;
    state.beatIndex = 0;
    state.screen = "step";
    startView(quiz().steps[state.stepIndex].view);
    startStepVital(quiz().steps[state.stepIndex].id);
    render();
  }

  function showCorrect(thenAdvance) {
    var step = currentStep();
    var host = feedbackHost();
    var extra = "";
    if (step.extra === "bloom") {
      extra = '<div class="quiz-bloom">' + esc(tx(CHROME.bloom)) + "</div>";
    }
    if (step.extra === "drip") {
      extra = '<div class="quiz-drips" aria-hidden="true"><span>●</span><span>●</span><span>●</span></div>';
    }
    var cards = ensureRoot().querySelector(".quiz-cards");
    if (cards) cards.hidden = true;
    var scene = ensureRoot().querySelector("[data-tap-scene]");
    if (scene) scene.classList.remove("is-tappable");
    host.hidden = false;
    host.innerHTML =
      '<div class="quiz-feedback-title">' + esc(tx(step.correct.title)) + "</div>" +
      extra +
      '<p class="quiz-feedback-body">' + nl(tx(step.correct.body)) + "</p>" +
      '<button type="button" class="quiz-primary" data-advance>' + esc(tx(step.correct.cta)) + "</button>";
    var delay = step.extra === "bloom" ? 1600 : 0;
    var btn = host.querySelector("[data-advance]");
    if (delay) {
      btn.hidden = true;
      setTimeout(function () {
        if (btn) btn.hidden = false;
      }, delay);
    }
    btn.addEventListener("click", thenAdvance);
  }

  function findChoice(id) {
    var step = currentStep();
    var beat = currentBeat();
    var list = beat && beat.choices ? beat.choices : step.choices;
    if (!list) return null;
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function onChoice(id, btn) {
    if (state.locked) return;
    var choice = findChoice(id);
    if (!choice) return;
    var step = currentStep();
    addAction("quiz_step_answered", {
      quiz: quiz().rumKey,
      step: step.id,
      beat: state.beatIndex,
      choice: choice.id,
      correct: !!choice.correct
    });
    if (!choice.correct) {
      showWrong(choice, btn);
      return;
    }
    if (step.beats && state.beatIndex < step.beats.length - 1) {
      state.locked = true;
      state.feedback = null;
      state.beatIndex += 1;
      render();
      return;
    }
    finishStep();
  }

  function onSceneTap() {
    if (state.locked) return;
    var step = currentStep();
    addAction("quiz_step_answered", {
      quiz: quiz().rumKey,
      step: step.id,
      beat: state.beatIndex,
      choice: "ice-glass",
      correct: true
    });
    finishStep();
  }

  function finishStep() {
    if (state.locked) return;
    state.locked = true;
    state.feedback = { type: "correct" };
    var step = currentStep();
    stopStepVital(step.id);
    showCorrect(advanceAfterCorrect);
  }

  function begin() {
    state.startedAt = Date.now();
    state.stepIndex = 0;
    state.beatIndex = 0;
    state.screen = "step";
    state.feedback = null;
    startJourneyVital();
    startView(quiz().steps[0].view);
    startStepVital(quiz().steps[0].id);
    render();
  }

  function completeQuiz() {
    var duration = Date.now() - (state.startedAt || Date.now());
    stopJourneyVital();
    addAction("quiz_completed", {
      quiz: quiz().rumKey,
      duration_ms: duration
    });
    state.screen = "complete";
    state.feedback = null;
    render();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  function launch(quizId, opts) {
    if (!QUIZZES[quizId]) return;
    opts = opts || {};
    state.quizId = quizId;
    state.screen = "opening";
    state.stepIndex = 0;
    state.beatIndex = 0;
    state.vitalOpen = false;
    state.feedback = null;
    onCloseCallback = typeof opts.onClose === "function" ? opts.onClose : null;
    ensureRoot().hidden = false;
    document.body.classList.add("quiz-open");
    addAction("quiz_started", { quiz: quizId, source: "cta" });
    render();
    document.addEventListener("keydown", onKey);
  }

  function isOpen() {
    return !!(state.quizId && root && !root.hidden);
  }

  function rerender() {
    if (!isOpen()) return;
    var feedback = state.feedback;
    render({ skipView: true, keepLock: !!(feedback && feedback.type === "correct") });
    if (feedback && feedback.type === "wrong") {
      var choice = findChoice(feedback.choiceId);
      var btn = ensureRoot().querySelector('[data-choice="' + feedback.choiceId + '"]');
      showWrong(choice, btn);
    } else if (feedback && feedback.type === "correct") {
      state.locked = true;
      showCorrect(advanceAfterCorrect);
    }
  }

  function close() {
    stopJourneyVital();
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("quiz-open");
    if (root) {
      root.hidden = true;
      root.innerHTML = "";
    }
    restoreGameView();
    if (onCloseCallback) onCloseCallback();
    var input = document.getElementById("challengeInput");
    if (input) {
      input.focus();
      if (typeof input.scrollIntoView === "function") {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function playCelebration(container) {
    var host = container && container.querySelector(".result-celebrate");
    if (!host) return;
    host.innerHTML = "";
    var colors = ["#F26A21", "#E7A637", "#72B94D", "#F58B24", "#FFF1CF", "#C94C32", "#B7642B"];
    var i;
    for (i = 0; i < 20; i += 1) {
      var p = document.createElement("span");
      p.className = "confetti-piece";
      var angle = (i / 20) * 360 + Math.random() * 14;
      var dist = 72 + Math.random() * 110;
      var rad = (angle * Math.PI) / 180;
      p.style.setProperty("--dx", Math.cos(rad) * dist + "px");
      p.style.setProperty("--dy", Math.sin(rad) * dist + "px");
      p.style.setProperty("--rot", Math.floor(Math.random() * 240 - 120) + "deg");
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.14 + "s";
      host.appendChild(p);
    }
  }

  global.QuizGame = {
    launch: launch,
    close: close,
    rerender: rerender,
    isOpen: isOpen,
    playCelebration: playCelebration,
    ids: { laksa: "laksa", rice: "chicken-rice" }
  };
})(window);
