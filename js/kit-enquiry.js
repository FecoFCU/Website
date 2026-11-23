/* Adds Buy now / Email / WhatsApp buttons to each row of the kit tables.
   "Buy now" asks for the delivery country: UK shows the delivered price and a card payment link,
   anywhere else sends a request for a shipping quote. Prices are not shown in the table. */
(function () {
  var EMAIL = "info@iptengineering.com";
  var WA = "447912023945";
  var VALID = "31 May 2027";

  /* Only tables marked data-buy get Buy now buttons (some part numbers are reused on other kit pages).
     Kit prices (GBP, ex VAT, delivered UK mainland), keyed by part number.
     pay = Stripe Payment Link for that kit (leave "" until made: the UK option then offers an email order). */
  var KITS = {
    k78:   { name: "7/8",   price: 130, pay: "https://buy.stripe.com/5kQcN42HWc4tb9Pf8vco004" },
    k910:  { name: "9/10",  price: 160, pay: "https://buy.stripe.com/fZu7sK96k5G5dhXf8vco006" },
    k1112: { name: "11/12", price: 235, pay: "https://buy.stripe.com/dRm4gyfuId8x5Pv4tRco007" },
    k1416: { name: "14/16", price: 265, pay: "https://buy.stripe.com/4gM7sKeqE7Od0vb4tRco002" },
    k1720: { name: "17/20", price: 420, pay: "https://buy.stripe.com/aFabJ02HWc4ta5Le4rco008" },
    k2326: { name: "23/26", price: 445, pay: "" }
  };
  var PART = {
    HOFKFCU7: "k78", HOFKFCU8: "k78", HIFK8SCR6: "k78",
    HOFKFCU9: "k910", HOFKFCU10: "k910", HIFK9SCR6: "k910", HIFK10SCR6: "k910",
    HOFKFCU11: "k1112", HOFKFCU12: "k1112", HIFKSFU300: "k1112", HIFKSFU350: "k1112", HIFK11SCR6: "k1112", HIFK12SCR6: "k1112",
    HOFKFCU14: "k1416", HOFKFCU16: "k1416", HIFKSFU390: "k1416", HIFK14SCR6: "k1416", HIFK16SCR6: "k1416",
    HOFKFCU17: "k1720", HOFKFCU20: "k1720", HIFKSFU450: "k1720", HIFKSFU500: "k1720", "HIFK18SCR4/24": "k1720", "HIFK20SCR4/24": "k1720",
    HOFKFCU23: "k2326", HOFKFCU26: "k2326", HIFKSFU550: "k2326", HIFKSFU600: "k2326", "HIFK23SCR4/24": "k2326", "HIFK26SCR4/24": "k2326"
  };

  var css = ".kit-enq{white-space:nowrap}" +
    ".kit-enq a,.kit-pop a,.kit-pop button{display:inline-block;margin:2px 4px 2px 0;padding:6px 12px;border-radius:3px;color:#fff!important;border:0;cursor:pointer;" +
    "font-family:'Open Sans',sans-serif;font-size:.85em;font-weight:bold;text-decoration:none;line-height:1.2}" +
    ".kit-enq a.kit-email,.kit-pop .kit-email{background:#036}.kit-enq a.kit-wa,.kit-pop .kit-wa{background:#25a35a}" +
    ".kit-enq a.kit-buy,.kit-pop .kit-buy{background:#c45500}" +
    ".kit-enq a:hover,.kit-pop a:hover,.kit-pop button:hover{opacity:.85}" +
    ".kit-shade{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".kit-pop{background:#fff;color:#222;max-width:440px;width:100%;border-radius:6px;padding:22px 22px 18px;position:relative;" +
    "font-family:'Open Sans',sans-serif;font-size:15px;line-height:1.45;box-shadow:0 8px 30px rgba(0,0,0,.3);max-height:90vh;overflow:auto}" +
    ".kit-pop h3{margin:0 28px 10px 0;font-size:18px;color:#036}.kit-pop p{margin:0 0 12px}" +
    ".kit-pop .kit-x{position:absolute;top:8px;right:10px;background:none!important;color:#555!important;font-size:24px;padding:2px 8px;margin:0}" +
    ".kit-pop .kit-choice{display:block;width:100%;margin:0 0 8px;padding:11px 12px;font-size:15px;background:#036;text-align:center}" +
    ".kit-pop .kit-choice.alt{background:#555}" +
    ".kit-pop .kit-price{font-size:22px;font-weight:bold;color:#036;margin:4px 0 2px}" +
    ".kit-pop .kit-small{font-size:13px;color:#555}" +
    ".kit-pop input{width:100%;box-sizing:border-box;padding:9px;font-size:15px;border:1px solid #999;border-radius:3px;margin:0 0 10px}" +
    "@media screen and (max-width:768px){td.kit-enq{white-space:normal}td.kit-enq:before{content:'Buy / Enquire'!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var h1 = document.querySelector("h1");
  var product = h1 ? h1.textContent.trim().replace(/s$/, "") : "Fluid coupling kit";

  function lead(kind) { try { if (window.iptLead) window.iptLead(kind); } catch (e) {} }
  function cta(name) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "CTA: " + name + " " + location.pathname, title: "CTA (" + name + ")", event: true }); } catch (e) {} }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function money(n) { return "£" + n.toFixed(2).replace(/\.00$/, ""); }
  function mailto(subject, body) { return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body); }
  function walink(body) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(body); }

  var shade = null, lastFocus = null;
  function close() { if (shade) { shade.remove(); shade = null; document.removeEventListener("keydown", onKey); if (lastFocus) lastFocus.focus(); } }
  function onKey(e) { if (e.key === "Escape") close(); }
  function open(fill) {
    close(); lastFocus = document.activeElement;
    shade = el("div", "kit-shade"); shade.addEventListener("click", function (e) { if (e.target === shade) close(); });
    var pop = el("div", "kit-pop"); pop.setAttribute("role", "dialog"); pop.setAttribute("aria-modal", "true");
    var x = el("button", "kit-x", "×"); x.setAttribute("aria-label", "Close"); x.addEventListener("click", close);
    pop.appendChild(x); fill(pop); shade.appendChild(pop); document.body.appendChild(shade);
    document.addEventListener("keydown", onKey);
    var f = pop.querySelector(".kit-choice,input,a,button:not(.kit-x)"); if (f) f.focus();
  }

  function buy(title, kit) {
    open(function (pop) {
      pop.appendChild(el("h3", "", "Buy: " + title));
      pop.appendChild(el("p", "", "Where should we deliver to?"));
      var uk = el("button", "kit-choice", "United Kingdom (mainland)");
      var other = el("button", "kit-choice alt", "Another country");
      pop.appendChild(uk); pop.appendChild(other);
      uk.addEventListener("click", function () { cta("buy-uk"); showUK(title, kit); });
      other.addEventListener("click", function () { cta("buy-export"); showExport(title); });
    });
  }

  function showUK(title, kit) {
    open(function (pop) {
      var vat = Math.round(kit.price * 20) / 100;
      pop.appendChild(el("h3", "", title));
      pop.appendChild(el("div", "kit-price", money(kit.price) + " + VAT"));
      pop.appendChild(el("p", "kit-small", money(kit.price + vat) + " including VAT, delivered to a UK mainland address. Dispatch within 1 to 2 working days. Price valid to " + VALID + "."));
      var body = "Order: " + title + " at " + money(kit.price) + " + VAT each, delivered UK mainland\n\nQuantity required:\nCoupling serial number:\nName / company:\nDelivery address:\nContact number:\n\nSent from " + location.href;
      if (kit.pay) {
        var pay = el("a", "kit-choice kit-buy", "Pay by card"); pay.href = kit.pay; pay.target = "_blank"; pay.rel = "noopener";
        pay.addEventListener("click", function () { lead("stripe"); });
        pop.appendChild(pay);
        pop.appendChild(el("p", "kit-small", "Secure card payment by Stripe. Please add your coupling serial number at checkout so we can check the kit before dispatch."));
        pop.appendChild(el("p", "kit-small", "Prefer to pay by bank transfer or order on account?"));
      } else {
        pop.appendChild(el("p", "", "Send us your order and we will confirm the kit and send you a payment link (card or bank transfer)."));
      }
      var em = el("a", "kit-email", "Order by email"); em.href = mailto("Order: " + title, body);
      var wa = el("a", "kit-wa", "Order by WhatsApp"); wa.href = walink(body); wa.target = "_blank"; wa.rel = "noopener";
      pop.appendChild(em); pop.appendChild(wa);
    });
  }

  function showExport(title) {
    open(function (pop) {
      pop.appendChild(el("h3", "", title));
      pop.appendChild(el("p", "", "We ship worldwide. Tell us your country and we will send a quotation including shipping."));
      var lab = el("label", "kit-small", "Delivery country"); lab.setAttribute("for", "kit-country");
      var inp = el("input"); inp.id = "kit-country"; inp.type = "text"; inp.autocomplete = "country-name"; inp.placeholder = "e.g. South Africa";
      pop.appendChild(lab); pop.appendChild(inp);
      var em = el("a", "kit-email", "Request quote by email"), wa = el("a", "kit-wa", "Request quote by WhatsApp");
      wa.target = "_blank"; wa.rel = "noopener";
      function upd() {
        var c = inp.value.trim() || "[country]";
        var body = "Quote request: " + title + ", delivered to " + c + "\n\nQuantity required:\nCoupling serial number:\nName / company:\nDelivery address:\nContact number:\n\nSent from " + location.href;
        em.href = mailto("Quote request: " + title + " – delivery to " + c, body); wa.href = walink(body);
      }
      inp.addEventListener("input", upd); upd();
      pop.appendChild(em); pop.appendChild(wa);
    });
  }

  document.querySelectorAll("table").forEach(function (table) {
    var headRow = table.querySelector("thead tr");
    if (!headRow) return;
    var th = document.createElement("th"); headRow.appendChild(th);
    var anyBuy = false;
    table.querySelectorAll("tbody tr").forEach(function (tr) {
      var cells = tr.querySelectorAll("td");
      if (cells.length < 2) return;
      var size = cells[0].textContent.trim();
      var part = table.hasAttribute("data-no-part") ? "" : cells[1].textContent.trim();
      var prod = table.getAttribute("data-product") || product;
      var title = prod + ", size " + size + (part && !/ask|^[–-]$/i.test(part) ? " (" + part + ")" : "");
      var msg = "Enquiry: " + title + "\n\nQuantity required:\nName / company:\nContact number:\n\nSent from " + location.href;
      var td = document.createElement("td"); td.className = "kit-enq";
      var kit = table.hasAttribute("data-buy") ? KITS[PART[part]] : null;
      if (kit) {
        anyBuy = true;
        var b = el("a", "kit-buy", "Buy now"); b.href = "#"; b.setAttribute("role", "button");
        b.setAttribute("aria-label", "Buy now: " + title);
        b.addEventListener("click", function (e) { e.preventDefault(); cta("buy-now"); buy(title, kit); });
        td.appendChild(b);
      }
      var em = el("a", "kit-email", "Email");
      em.href = mailto("Enquiry: " + title, msg);
      em.setAttribute("aria-label", "Email an enquiry for " + title);
      var wa = el("a", "kit-wa", "WhatsApp");
      wa.href = walink(msg); wa.target = "_blank"; wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp an enquiry for " + title);
      td.appendChild(em); td.appendChild(wa); tr.appendChild(td);
    });
    th.textContent = anyBuy ? "Buy / Enquire" : "Enquire";
  });
})();
