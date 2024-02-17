(() => {
  "use strict";
  const t = [];
  let e = {},
    o = {};
  const n = true,
    i = (t, e, o, n, i) => {
      if (!n) return;

      const d = {
        version: n,
        user_id: o,
        embed_type: "button",
        action_type: t,
        options: { _env_: e },
      };
      let s = "";
      "undefined" != typeof window &&
        window.location &&
        (s = window.location.href),
        (d.url = s);
      ((t, e, o, n, i = "GET") => {
        if (!window.XMLHttpRequest) return;
        const d = new XMLHttpRequest();
        (d.onload = () => {
          e && "function" == typeof e && e(d.responseXML);
        }),
          d.open(i, t),
          (d.responseType = "document"),
          n && d.setRequestHeader(...n),
          o ? d.send(o) : d.send();
      })(
        `${e}/v1/widgets-tracking/trck`,
        i,
        JSON.stringify(d),
        ["Content-Type", "application/json"],
        "POST"
      );
    },
    d = () => {
      const e = document.querySelectorAll(".wtrvl-checkout_button");
      [].forEach.call(e, (e) => {
        const d = e;
        e.isTracked ||
          (n || i("load", e.dataset.env, e.dataset.uid, e.dataset.version),
          e.addEventListener("click", (d) => {
            if (
              (n || i("click", e.dataset.env, e.dataset.uid, e.dataset.version),
              !document.querySelector('iframe[class="wtrvl-ifrm"]') &&
                d.target.classList.contains("wtrvl-checkout_button"))
            ) {
              const e = ((t) => {
                  const e = document.createElement("iframe");
                  return (
                    e.setAttribute(
                      "style",
                      "position:fixed;width: 100vw; height:100vh;top:0;left:0;bottom:0;right:0;z-index:21150313555"
                    ),
                    e.setAttribute("frameborder", "0"),
                    e.setAttribute("src", t),
                    e.setAttribute("class", "wtrvl-ifrm"),
                    e
                  );
                })(d.target.getAttribute("href")),
                i = document.createElement("style");
              (i.innerHTML = "body > *:not(.wtrvl-ifrm){display:none}"),
                window &&
                  window.innerWidth <= 991 &&
                  document.body.appendChild(i),
                document.body.appendChild(e),
                n
                  ? setTimeout(() => {
                      e.contentWindow.postMessage("tripPage", "*");
                    }, 3e3)
                  : setTimeout(() => {
                      e.contentWindow.postMessage("buttonWidget", "*");
                    }, 3e3),
                t.push(e),
                (o = i),
                (document.body.style.overflow = "hidden"),
                (document.body.style.height = "auto");
            }
            d.stopPropagation(), d.preventDefault();
          })),
          (d.isTracked = !0);
      });
    },
    s = () => {
      t.map(
        (t) => (
          t.remove ? t.remove() : t.parentNode && t.parentNode.removeChild(t),
          o.parentNode && o.parentNode.removeChild(o),
          ((t) => {
            document.body.setAttribute("style", t);
          })(e),
          t
        )
      );
    };
  setTimeout(() => {
    (e = document.body.getAttribute("style")),
      d(),
      (() => {
        const t = window.addEventListener ? "addEventListener" : "attachEvent";
        (0, window[t])("attachEvent" === t ? "onmessage" : "message", (t) => {
          if (
            ("wtrvlCheckoutClosed" === t.data && s(), "fileUpload" === t.data)
          ) {
            const t = document.querySelector(".wtrvl-ifrm");
            t && (t.style.height = "100%");
          }
        });
      })();
  }, 1000);
})();
