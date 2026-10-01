(function (global) {
  "use strict";

  var IMG = "/static/quiz_img/";

  var CHROME = {
    tryAnother: { en: "TRY ANOTHER", th: "ลองอย่างอื่น" },
    guessAgain: { en: "GUESS AGAIN", th: "ทายอีกครั้ง" },
    bloom: { en: "…sizzling…", th: "…กำลังเดือด…" },
    close: { en: "Return to game", th: "กลับไปท้าทาย" },
    returnToGame: { en: "Return to game", th: "กลับไปท้าทาย" },
    notQuite: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
    tryAnotherBody: { en: "Try another.", th: "ลองวัตถุดิบอื่น" },
    quizLabel: { en: "Soi quiz", th: "ควิซเมนูซอย" },
    language: { en: "Language", th: "ภาษา" }
  };

  var QUIZZES = {
    "pad-thai": {
      id: "pad-thai",
      rumKey: "pad-thai",
      completeImage: IMG + "padthai6.png",
      opening: {
        kicker: { en: "Pad Thai", th: "ผัดไทย" },
        title: { en: "MAKE PAD THAI", th: "ผัดไทยกัน" },
        subcopy: {
          en: "Soften noodles → Build sauce → Start the wok → Toss noodles → Finish the dish",
          th: "แช่เส้น → ทำซอส → เปิดกระทะ → ผัดเส้น → ปิดจาน"
        },
        image: IMG + "padthai6.png",
        cta: { en: "LET’S WOK", th: "ลงกระทะ" }
      },
      result: {
        kicker: { en: "Served", th: "เสิร์ฟแล้ว" },
        title: { en: "AROI MAK!", th: "อร่อยมาก!" },
        subtitle: { en: "PAD THAI COMPLETE", th: "ผัดไทย: เสร็จแล้ว" },
        body: {
          en: "The egg is in the noodles. Sprouts and chives add crunch. Peanuts and lime wait at the table.",
          th: "ไข่เข้าเส้นแล้ว ถั่วงอกกับกุยช่ายเพิ่มความกรุบ ถั่วลิสงกับมะนาวรอที่โต๊ะ"
        },
        brewLine: { en: "Your plate:", th: "จานของคุณ:" },
        stars: "★★★★★",
        stats: [
          { label: { en: "Tang", th: "เปรี้ยว" }, fill: 80 },
          { label: { en: "Wok energy", th: "พลังกระทะ" }, fill: 100 },
          { label: { en: "Peanut power", th: "พลังถั่ว" }, fill: 100 }
        ]
      },
      steps: [
        {
          id: 1,
          view: "step-1",
          kicker: { en: "1. Noodle business", th: "1. เรื่องเส้น" },
          title: { en: "HOW DO WE GET THE RICE NOODLES READY?", th: "เตรียมเส้นจันท์ยังไง?" },
          image: IMG + "padthai1.png",
          layout: "cards",
          choices: [
            { id: "deep-fry", emoji: "🍟", label: { en: "Deep-fry them until crispy", th: "ทอดกรอบ" }, correct: false },
            { id: "soak", emoji: "🍜", label: { en: "Soak them until pliable but not fully soft", th: "แช่น้ำจนนิ่มยืดหยุ่น แต่ยังไม่เละ" }, correct: true },
            { id: "boil-mushy", emoji: "💧", label: { en: "Boil them until completely mushy", th: "ต้มจนเละ" }, correct: false },
            { id: "toast-dry", emoji: "🔥", label: { en: "Toast them dry in the wok", th: "คั่วแห้งในกระทะ" }, correct: false }
          ],
          correct: {
            title: { en: "BENDY, NOT MUSHY.", th: "นิ่มยืดได้ ไม่เละ" },
            body: {
              en: "Pad Thai noodles are usually softened before they hit the wok. They should still have some firmness because they’ll keep cooking when tossed with the sauce.",
              th: "เส้นผัดไทยมักแช่น้ำให้ยืดหยุ่นก่อนลงกระทะ ยังต้องมีความแน่นอยู่ เพราะจะสุกต่อเมื่อผัดกับซอส"
            },
            cta: { en: "SAUCE TIME →", th: "ต่อไป น้ำซอส →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Those noodles still have more cooking to do in the wok — don’t fry, mash, or toast them first.",
            th: "เส้นยังต้องสุกต่อในกระทะ — อย่าทอด กรอบเละ หรือคั่วแห้งก่อน"
          }
        },
        {
          id: 2,
          view: "step-2",
          kicker: { en: "2. Sweet, sour, salty", th: "2. หวาน เปรี้ยว เค็ม" },
          title: { en: "WHAT GIVES PAD THAI ITS SIGNATURE SAUCE?", th: "อะไรคือซอสผัดไทย?" },
          image: IMG + "padthai2.png",
          layout: "cards",
          choices: [
            { id: "coconut-curry", emoji: "🥥", label: { en: "Coconut milk, curry powder and sugar", th: "กะทิ ผงกะหรี่ และน้ำตาล" }, correct: false },
            { id: "tamarind-trio", emoji: "🟤", label: { en: "Tamarind, fish sauce and palm sugar", th: "มะขาม น้ำปลา และน้ำตาลปี๊บ" }, correct: true },
            { id: "soy-sesame", emoji: "🧂", label: { en: "Soy sauce, sesame oil and honey", th: "ซีอิ๊ว น้ำมันงา และน้ำผึ้ง" }, correct: false },
            { id: "tomato-vinegar", emoji: "🍅", label: { en: "Tomato sauce, vinegar and salt", th: "ซอสมะเขือเทศ น้ำส้มสายชู และเกลือ" }, correct: false }
          ],
          correct: {
            title: { en: "THREE FLAVOURS, ONE SAUCE.", th: "สามรส หนึ่งซอส" },
            body: {
              en: "Tamarind brings tang, fish sauce brings savoury saltiness, and palm sugar rounds everything out with sweetness.\n\nThat sweet-sour-salty balance is at the heart of Pad Thai.",
              th: "มะขามให้เปรี้ยว น้ำปลาให้เค็มอูมามิ น้ำตาลปี๊บปิดด้วยความหวาน\n\nสมดุลหวาน-เปรี้ยว-เค็มคือหัวใจผัดไทย"
            },
            cta: { en: "FIRE UP THE WOK →", th: "เปิดกระทะ →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Pad Thai sauce is tamarind, fish sauce and palm sugar — not curry, sesame, or tomato sauce.",
            th: "ซอสผัดไทยคือมะขาม น้ำปลา และน้ำตาลปี๊บ — ไม่ใช่แกง งา หรือซอสมะเขือเทศ"
          }
        },
        {
          id: 3,
          view: "step-3",
          kicker: { en: "3. Start the sizzle", th: "3. เริ่มเสียงกระทะ" },
          title: { en: "WHAT GOES INTO THE HOT WOK FIRST?", th: "ใส่อะไรลงกระทะร้อนก่อน?" },
          image: IMG + "padthai3.png",
          layout: "cards",
          choices: [
            { id: "finished-peanuts", emoji: "🥜", label: { en: "The finished noodles and peanuts", th: "เส้นสุกกับถั่วลิสง" }, correct: false },
            { id: "aromatics-protein", emoji: "🍤", label: { en: "Aromatics, tofu and your protein", th: "เครื่องหอม เต้าหู้ และโปรตีน" }, correct: true },
            { id: "lime-sprouts", emoji: "🍋", label: { en: "Lime juice and bean sprouts", th: "น้ำมะนาวกับถั่วงอก" }, correct: false },
            { id: "cold-coconut", emoji: "🧊", label: { en: "Cold coconut milk", th: "กะทิเย็น" }, correct: false }
          ],
          correct: {
            title: { en: "GET THE WOK WORKING.", th: "ให้กระทะทำงานก่อน" },
            body: {
              en: "Start by building flavour in the hot wok with aromatics, tofu and protein such as prawns.\n\nThe noodles come in after the base ingredients have had a chance to cook.",
              th: "เริ่มสร้างรสในกระทะร้อนด้วยเครื่องหอม เต้าหู้ และโปรตีนอย่างกุ้ง\n\nเส้นลงทีหลังเมื่อของฐานสุกแล้ว"
            },
            cta: { en: "BRING IN THE NOODLES →", th: "เอาเส้นลง →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "The wok needs aromatics, tofu and protein first. Noodles wait nearby.",
            th: "กระทะต้องการเครื่องหอม เต้าหู้ และโปรตีนก่อน เส้นรออยู่ข้าง ๆ"
          }
        },
        {
          id: 4,
          view: "step-4",
          kicker: { en: "4. Toss it together", th: "4. ผัดให้เข้ากัน" },
          title: { en: "THE NOODLES ARE READY. WHAT HAPPENS NEXT?", th: "เส้นพร้อมแล้ว ต่อไปทำอะไร?" },
          image: IMG + "padthai4.png",
          layout: "cards",
          choices: [
            { id: "rinse-serve", emoji: "🚿", label: { en: "Rinse the noodles in cold water and serve", th: "ล้างเส้นด้วยน้ำเย็นแล้วเสิร์ฟ" }, correct: false },
            { id: "add-water", emoji: "💧", label: { en: "Add plain water and stop cooking", th: "ใส่น้ำเปล่าแล้วหยุดผัด" }, correct: false },
            { id: "toss-sauce", emoji: "🔥", label: { en: "Add the noodles and sauce, then toss until coated", th: "ใส่เส้นกับซอส แล้วผัดให้เคลือบ" }, correct: true },
            { id: "cheese", emoji: "🧀", label: { en: "Cover everything with cheese", th: "ราดชีสทับทั้งหมด" }, correct: false }
          ],
          correct: {
            title: { en: "TOSS, TOSS, TOSS.", th: "ผัด ผัด ผัด" },
            body: {
              en: "The noodles absorb the tamarind-based sauce as they finish cooking in the wok.\n\nYou want them glossy, flavourful and tender — not soggy.",
              th: "เส้นดูดซอสมะขามขณะสุกต่อในกระทะ\n\nต้องการเส้นมันวาว มีรส และนุ่ม — ไม่แฉะ"
            },
            cta: { en: "FINISH STRONG →", th: "ปิดจานให้ปัง →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Add the noodles and sauce, then toss until coated. Don’t rinse, flood, or cheese them.",
            th: "ใส่เส้นกับซอสแล้วผัดให้เคลือบ อย่าล้าง ท่วมน้ำ หรือราดชีส"
          }
        },
        {
          id: 5,
          view: "step-5",
          kicker: { en: "5. The final wok move", th: "5. ไม้สุดท้ายของกระทะ" },
          title: { en: "ALMOST DONE. WHAT FINISHES THE PAD THAI?", th: "เกือบเสร็จ อะไรปิดผัดไทย?" },
          image: IMG + "padthai5.png",
          layout: "cards",
          choices: [
            { id: "egg-sprouts", emoji: "🍳", label: { en: "Cook in the egg, then fold in sprouts and chives", th: "ใส่ไข่แล้วพับถั่วงอกกับกุยช่ายเข้าไป" }, correct: true },
            { id: "coconut-simmer", emoji: "🥥", label: { en: "Pour in coconut cream and simmer", th: "เทกะทิแล้วเคี่ยว" }, correct: false },
            { id: "cucumber-broth", emoji: "🥒", label: { en: "Add sliced cucumber and chicken broth", th: "ใส่แตงกวาหั่นกับน้ำซุปไก่" }, correct: false },
            { id: "steam-20", emoji: "⏳", label: { en: "Cover and steam everything for 20 minutes", th: "ปิดฝาแล้วนึ่ง 20 นาที" }, correct: false }
          ],
          correct: {
            title: { en: "NOW THAT LOOKS LIKE PAD THAI.", th: "นี่แหละผัดไทย" },
            body: {
              en: "The egg gets cooked into the noodles, while bean sprouts and garlic chives add freshness and crunch.\n\nFinish with peanuts and lime at the table.",
              th: "ไข่ถูกผัดเข้ากับเส้น ถั่วงอกกับกุยช่ายเพิ่มความสดและกรุบกรอบ\n\nปิดด้วยถั่วลิสงและมะนาวตอนเสิร์ฟ"
            },
            cta: { en: "SERVE IT!", th: "เสิร์ฟเลย!" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Cook in the egg, then fold in sprouts and chives. Peanuts and lime finish it at the table.",
            th: "ใส่ไข่แล้วพับถั่วงอกกับกุยช่าย ถั่วลิสงกับมะนาวปิดที่โต๊ะ"
          }
        }
      ]
    },
    "tom-yum": {
      id: "tom-yum",
      rumKey: "tom-yum",
      completeImage: IMG + "tomyum6.png",
      opening: {
        kicker: { en: "Tom Yum Goong", th: "ต้มยำกุ้ง" },
        title: { en: "MAKE TOM YUM", th: "ต้มยำกัน" },
        subcopy: {
          en: "Prep aromatics → Build broth → Add prawns → Balance flavours → Assemble",
          th: "เตรียมเครื่องหอม → สร้างน้ำซุป → ใส่กุ้ง → ปรับรส → จัดชาม"
        },
        image: IMG + "tomyum6.png",
        cta: { en: "START THE BROTH", th: "เปิดหม้อ" }
      },
      result: {
        kicker: { en: "Served", th: "เสิร์ฟแล้ว" },
        title: { en: "ZAAP!", th: "แซ่บ!" },
        subtitle: { en: "TOM YUM COMPLETE", th: "ต้มยำ: เสร็จแล้ว" },
        body: {
          en: "Fragrant broth, juicy prawns, mushrooms, chilli, lime and fresh herbs in one punchy bowl.",
          th: "น้ำซุปหอม กุ้งฉ่ำ เห็ด พริก มะนาว และสมุนไพรสดรวมในชามเดียว"
        },
        brewLine: { en: "Your bowl:", th: "ชามของคุณ:" },
        stars: "★★★★★",
        stats: [
          { label: { en: "Sour", th: "เปรี้ยว" }, fill: 80 },
          { label: { en: "Heat", th: "ความเผ็ด" }, fill: 80 },
          { label: { en: "Aroma", th: "ความหอม" }, fill: 100 }
        ]
      },
      steps: [
        {
          id: 1,
          view: "step-1",
          kicker: { en: "1. Wake up the aromatics", th: "1. ปลุกเครื่องหอม" },
          title: { en: "WHAT STARTS A CLASSIC TOM YUM BROTH?", th: "อะไรเริ่มน้ำซุปต้มยำคลาสสิก?" },
          image: IMG + "tomyum1.png",
          layout: "cards",
          choices: [
            { id: "italian-herbs", emoji: "🌿", label: { en: "Basil, oregano and rosemary", th: "โหระพา ออริกาโน และโรสแมรี" }, correct: false },
            { id: "tom-yum-trio", emoji: "🍋", label: { en: "Lemongrass, galangal and makrut lime leaves", th: "ตะไคร้ ข่า และใบมะกรูด" }, correct: true },
            { id: "spice-mix", emoji: "⭐", label: { en: "Cinnamon, star anise and cloves", th: "อบเชย โป๊ยกั๊ก และกานพลู" }, correct: false },
            { id: "butter-garlic", emoji: "🧈", label: { en: "Butter, garlic and parsley", th: "เนย กระเทียม และพาร์สลีย์" }, correct: false }
          ],
          correct: {
            title: { en: "THAT'S THE TOM YUM TRIO.", th: "นั่นคือสามพี่น้องต้มยำ" },
            body: {
              en: "Lemongrass, galangal and makrut lime leaves give Tom Yum its instantly recognizable citrusy, herbal aroma.",
              th: "ตะไคร้ ข่า และใบมะกรูดให้กลิ่นซิตรัสสมุนไพรที่รู้ทันทีว่าต้มยำ"
            },
            cta: { en: "BUILD THE BROTH →", th: "สร้างน้ำซุป →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Tom Yum starts with lemongrass, galangal and makrut lime leaves.",
            th: "ต้มยำเริ่มด้วยตะไคร้ ข่า และใบมะกรูด"
          }
        },
        {
          id: 2,
          view: "step-2",
          kicker: { en: "2. Let it infuse", th: "2. ให้เครื่องแช่ซุป" },
          title: { en: "WHAT SHOULD WE DO WITH THOSE AROMATICS?", th: "ทำอะไรกับเครื่องหอมพวกนั้น?" },
          image: IMG + "tomyum2.png",
          layout: "cards",
          choices: [
            { id: "deep-fry", emoji: "🍟", label: { en: "Deep-fry them until crisp", th: "ทอดกรอบ" }, correct: false },
            { id: "serve-raw", emoji: "🥗", label: { en: "Serve them raw on top", th: "เสิร์ฟสด ๆ บนชาม" }, correct: false },
            { id: "simmer", emoji: "🍲", label: { en: "Simmer them gently in the broth", th: "ตุ๋นเบา ๆ ในน้ำซุป" }, correct: true },
            { id: "blend-ice", emoji: "🧊", label: { en: "Blend them with ice", th: "ปั่นกับน้ำแข็ง" }, correct: false }
          ],
          correct: {
            title: { en: "LET THE BROTH DO THE WORK.", th: "ให้น้ำซุปทำงาน" },
            body: {
              en: "Gentle simmering extracts the fragrance from the aromatics and builds the base of the soup.",
              th: "การตุ๋นเบา ๆ สกัดกลิ่นจากเครื่องหอมและสร้างฐานซุป"
            },
            cta: { en: "PRAWN TIME →", th: "ต่อไป กุ้ง →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Simmer the aromatics gently in the broth. Don’t fry, ice, or serve them raw.",
            th: "ตุ๋นเครื่องหอมเบา ๆ ในน้ำซุป อย่าทอด ปั่นน้ำแข็ง หรือเสิร์ฟสด"
          }
        },
        {
          id: 3,
          view: "step-3",
          kicker: { en: "3. Into the soup", th: "3. ลงซุป" },
          title: { en: "BROTH'S FRAGRANT. WHAT GOES IN NEXT?", th: "น้ำซุปหอมแล้ว ใส่อะไรต่อ?" },
          image: IMG + "tomyum3.png",
          layout: "cards",
          choices: [
            { id: "noodles-tofu", emoji: "🍜", label: { en: "Rice noodles and tofu puffs", th: "เส้นจันท์กับเต้าหู้ทอด" }, correct: false },
            { id: "prawns-mushrooms", emoji: "🦐", label: { en: "Prawns and mushrooms", th: "กุ้งกับเห็ด" }, correct: true },
            { id: "chicken-cucumber", emoji: "🍗", label: { en: "Roasted chicken and cucumber", th: "ไก่ย่างกับแตงกวา" }, correct: false },
            { id: "pasta-parmesan", emoji: "🧀", label: { en: "Pasta and parmesan", th: "พาสต้ากับพาร์เมซาน" }, correct: false }
          ],
          correct: {
            title: { en: "IN GO THE PRAWNS.", th: "กุ้งลงซุป" },
            body: {
              en: "Mushrooms add texture while prawns turn sweet and succulent as they cook in the hot aromatic broth.\n\nDon't overcook them — just enough is enough.",
              th: "เห็ดเพิ่มเนื้อสัมผัส กุ้งหวานเด้งเมื่อสุกในน้ำซุปหอม\n\nอย่าสุกเกิน — พอดีก็พอ"
            },
            cta: { en: "BALANCE THE BOWL →", th: "ปรับรสชาม →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Prawns and mushrooms go in next. This is Tom Yum Goong, not pasta night.",
            th: "ต่อไปคือกุ้งกับเห็ด นี่คือต้มยำกุ้ง ไม่ใช่คืนพาสต้า"
          }
        },
        {
          id: 4,
          view: "step-4",
          kicker: { en: "4. Make it Tom Yum", th: "4. ให้มันเป็นต้มยำ" },
          title: { en: "WHAT GIVES THE SOUP ITS HOT-SOUR-SALTY KICK?", th: "อะไรให้ซุปรสเผ็ด-เปรี้ยว-เค็ม?" },
          image: IMG + "tomyum4.png",
          layout: "cards",
          choices: [
            { id: "soy-milk", emoji: "🥛", label: { en: "Soy milk, sugar and sesame", th: "นมถั่วเหลือง น้ำตาล และงา" }, correct: false },
            { id: "butter-cream", emoji: "🧈", label: { en: "Butter, cream and pepper", th: "เนย ครีม และพริกไทย" }, correct: false },
            { id: "fish-chilli-lime", emoji: "🌶️", label: { en: "Fish sauce, chilli and fresh lime juice", th: "น้ำปลา พริก และน้ำมะนาวสด" }, correct: true },
            { id: "ketchup", emoji: "🍅", label: { en: "Tomato ketchup, salt and vinegar", th: "ซอสมะเขือเทศ เกลือ และน้ำส้มสายชู" }, correct: false }
          ],
          correct: {
            title: { en: "HOT. SOUR. SALTY.", th: "เผ็ด เปรี้ยว เค็ม" },
            body: {
              en: "Fish sauce adds savoury depth, chilli brings heat, and fresh lime gives Tom Yum its bright sour edge.\n\nLime is best added toward the end so its fresh flavour stays lively.",
              th: "น้ำปลาให้อูมามิ พริกให้ความเผ็ด มะนาวสดให้เปรี้ยวสด\n\nมะนาวใส่ท้าย ๆ ให้รสสดไม่หาย"
            },
            cta: { en: "BOWL IT UP →", th: "ตักใส่ชาม →" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Fish sauce, chilli and fresh lime juice make the hot-sour-salty kick.",
            th: "น้ำปลา พริก และน้ำมะนาวสด คือรสเผ็ด-เปรี้ยว-เค็ม"
          }
        },
        {
          id: 5,
          view: "step-5",
          kicker: { en: "5. Finish the soup", th: "5. ปิดซุป" },
          title: { en: "EVERYTHING'S COOKED. HOW DO WE SERVE IT?", th: "ของสุกแล้ว เสิร์ฟยังไง?" },
          image: IMG + "tomyum5.png",
          layout: "cards",
          choices: [
            { id: "ladle-herbs", emoji: "🥣", label: { en: "Ladle in the soup and finish with fresh herbs and chilli", th: "ตักซุปแล้วปิดด้วยสมุนไพรสดกับพริก" }, correct: true },
            { id: "drain", emoji: "🫗", label: { en: "Drain all the broth away", th: "เทน้ำซุปทิ้ง" }, correct: false },
            { id: "stir-fry-dry", emoji: "🔥", label: { en: "Stir-fry everything until dry", th: "ผัดจนแห้ง" }, correct: false },
            { id: "bake-rice", emoji: "🍚", label: { en: "Pour the soup over steamed rice and bake it", th: "ราดข้าวสวยแล้วนำไปอบ" }, correct: false }
          ],
          correct: {
            title: { en: "THAT'S A BOWL OF TOM YUM.", th: "นั่นคือชามต้มยำ" },
            body: {
              en: "Fragrant broth, juicy prawns, mushrooms, chilli, lime and fresh herbs all come together in one punchy bowl.",
              th: "น้ำซุปหอม กุ้งฉ่ำ เห็ด พริก มะนาว และสมุนไพรสดรวมในชามเดียว"
            },
            cta: { en: "SERVE IT!", th: "เสิร์ฟเลย!" }
          },
          wrongTitle: { en: "NOT QUITE!", th: "ยังไม่ใช่!" },
          wrongBody: {
            en: "Ladle in the soup and finish with fresh herbs and chilli. Keep the broth.",
            th: "ตักซุปแล้วปิดด้วยสมุนไพรสดกับพริก อย่าเทน้ำซุปทิ้ง"
          }
        }
      ]
    }
  };

  var state = {
    quizId: null,
    screen: "opening",
    stepIndex: 0,
    beatIndex: 0,
    startedAt: 0,
    stepStartedAt: 0,
    vitalOpen: false,
    locked: false,
    feedback: null
  };

  var root = null;
  var onCloseCallback = null;

  function lang() {
    return localStorage.getItem("ctf_lang") === "en" ? "en" : "th";
  }

  function tx(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang()] || value.en || value.th || "";
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

  function isPageMode() {
    return document.body.classList.contains("quiz-page");
  }

  function viewName(screen) {
    return "/quiz/" + quiz().rumKey + "/" + screen;
  }

  function syncUrl(screen) {
    if (!isPageMode() || !quiz()) return;
    var path = viewName(screen);
    if (window.location.pathname === path) return;
    var payload = { quiz: quiz().rumKey, screen: screen };
    if (!window.history.state || window.history.state.quiz !== quiz().rumKey) {
      history.replaceState(payload, "", path);
    } else {
      history.pushState(payload, "", path);
    }
  }

  function startView(screen) {
    syncUrl(screen);
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
    if (isPageMode()) return;
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

  function langToggleHtml() {
    var current = lang();
    return (
      '<div class="lang-toggle quiz-lang-toggle" role="group" aria-label="' + esc(tx(CHROME.language)) + '">' +
        '<button type="button" class="lang-btn' + (current === "th" ? " is-active" : "") + '" data-quiz-lang="th">TH</button>' +
        '<button type="button" class="lang-btn' + (current === "en" ? " is-active" : "") + '" data-quiz-lang="en">EN</button>' +
      "</div>"
    );
  }

  function shell(inner) {
    var closeCtl = isPageMode()
      ? '<a class="quiz-close" href="/game" data-dd-action-name="quiz_return_game" aria-label="' + esc(tx(CHROME.close)) + '">×</a>'
      : '<button type="button" class="quiz-close" data-quiz-close aria-label="' + esc(tx(CHROME.close)) + '">×</button>';
    return (
      '<div class="quiz-overlay" role="main" aria-label="' + esc(tx(CHROME.quizLabel)) + '">' +
        '<div class="quiz-shell">' +
          '<div class="quiz-topbar">' +
            langToggleHtml() +
            '<div class="quiz-progress" aria-hidden="true">' + progressHtml() + "</div>" +
            closeCtl +
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
        '<div class="quiz-complete-actions">' +
          '<a class="quiz-primary" href="/game" data-dd-action-name="quiz_return_game">' +
            esc(tx(CHROME.returnToGame)) +
          "</a>" +
          '<button type="button" class="quiz-secondary" data-quiz-again data-dd-action-name="quiz_guess_again">' +
            esc(tx(CHROME.guessAgain)) +
          "</button>" +
        "</div>"
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
      btn.addEventListener("click", guessAgain);
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
    overlay.querySelectorAll("[data-quiz-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = btn.getAttribute("data-quiz-lang");
        if (typeof global.setLanguage === "function") {
          global.setLanguage(next);
        } else {
          localStorage.setItem("ctf_lang", next === "en" ? "en" : "th");
          rerender();
        }
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

  function guessAgain() {
    state.screen = "opening";
    state.stepIndex = 0;
    state.beatIndex = 0;
    state.feedback = null;
    state.locked = false;
    stopJourneyVital();
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
    if (!isPageMode()) document.body.classList.add("quiz-open");
    addAction("quiz_started", { quiz: quizId, source: isPageMode() ? "page" : "cta" });
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
    if (isPageMode()) {
      window.location.href = "/game";
      return;
    }
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
    ids: { win: "pad-thai", hold: "tom-yum" }
  };

  function quizIdFromPath() {
    var match = window.location.pathname.match(/^\/quiz\/(pad-thai|tom-yum)(?:\/|$)/);
    return match ? match[1] : null;
  }

  if (isPageMode()) {
    var pageQuizId = document.body.getAttribute("data-quiz-id") || quizIdFromPath();
    if (pageQuizId && QUIZZES[pageQuizId]) {
      launch(pageQuizId);
    }
  }
})(window);
