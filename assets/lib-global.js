$(window).on("resize", function () {
  var header = $(".site-header");
  var announcement = $(".announcement-bar");
  $("#PageContainer").css(
    "padding-top",
    header.height() + (announcement.length > 0 ? announcement.height() : 0)
  );
});
$(document).ready(function () {
  var header = $(".site-header");
  var announcement = $(".announcement-bar");
  $("#PageContainer").css(
    "padding-top",
    header.height() + (announcement.length > 0 ? announcement.height() : 0)
  );
});
window["addNewStyle"] = (id) => {
  const style = document.createElement("style");
  document.head.append(style);
  window[`addNewStyle_${id}`] = style;
  return (styleString) =>
    (window[`addNewStyle_${id}`].textContent = styleString);
};
window["remove-element"] = (id) => {
  document.body.style.overflowY = "auto";
  $(`#${id}`).remove();
};
window["add-modal"] = (body, styleCloseIcon) => {
  document.body.style.overflowY = "hidden";
  $(`
  <div id="to-remove" class="custom-modal-wrap">
    <div style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; cursor: pointer;" onClick="window['remove-element']('to-remove')">
    </div>
    <div class="custom-modal">
      ${body}
      <div class="modal-close" onClick="window['remove-element']('to-remove')">
        <div>
          <span class="modal-close-icon ${styleCloseIcon}">
          </span>
        </div>
      </div>
    </div>
  </div>
  `).appendTo(document.body);
};
window["playVideo"] = (video, from, to) => {
  if (!video) {
    return;
  }
  if (!from) {
    video.play();
  } else {
    video.currentTime = from;
    video.play();
  }
  video.addEventListener(
    "timeupdate",
    () => {
      if (
        (to && video.currentTime > to) ||
        (from && video.currentTime < from)
      ) {
        video.currentTime = from;
        video.play();
      } else if (!from) {
        video.play();
      }
    },
    false
  );
};
window["decodeObject"] = (object) => {
  let newObject = {};
  try {
    newObject = JSON.parse(
      window["decodeHTMLEntities"](JSON.stringify(object))
    );
  } catch (e) {
    console.error("decodeObject", e);
    console.error(
      "object",
      window["decodeHTMLEntities"](JSON.stringify(object))
    );
    newObject = object;
  }
  return newObject;
};
window["decodeHTMLEntities"] = (text) => {
  if (typeof text !== "string") {
    return text;
  }
  var entities = [
    ["&#60;", "<"],
    ["&#62;", ">"],
    ["&#61;", "="],
    ["&#34;", '\\"'],
    ["&#58;", ":"],
    ["&#59;", ";"],
    ["&#47;", "/"],
    ["&#35;", "#"],
    ["&#37;", "%"],
    ["&#38;#x27&#59;", "'"],
    ["&#63;", "?"],
    ["&#123;", "{"],
    ["&#125;", "}"],
    ["&#44;", ","],
    ["&#224;", "à"],
    ["&#233;", "é"],
    ["&#8217;", "'"],
    ["&#232;", "è"],
    ["&#92;", "\\"],
    ["&#64;", "@"],
    ["&#249;", "ù"],
    ["&#33;", "!"],
    ["&#38;", "&"],
    ["&lcub;", "{"],
    ["&rcub;", "}"],
    ["&#40;", "("],
    ["&#41;", ")"],
    ["&#43;", "+"],
  ];

  for (var i = 0, max = entities.length; i < max; ++i) {
    text = text.replace(new RegExp(entities[i][0], "g"), entities[i][1]);
  }

  return text;
};
window["fakeClick"] = (fn) => {
  let $a = $('<a href="#" id="fakeClick"></a>');
  $a.bind("click", function (e) {
    e.preventDefault();
    fn();
  });

  $("body").append($a);

  let evt,
    el = $("#fakeClick").get(0);

  if (document.createEvent) {
    evt = document.createEvent("MouseEvents");
    if (evt.initMouseEvent) {
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      el.dispatchEvent(evt);
    }
  }

  $(el).remove();
};
window["uuid"] = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

window["waitForEl"] = (selector, callback) => {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => {
      window["waitForEl"](selector, callback);
    }, 100);
  }
};

/*
  window["responseive"]((device) => {
    switch (device) {
      case "desktop":
      case "tablet":
        $(`.${props.id}-tag`).addClass(`${styles.tagStyle}`);
        $(`.${props.id}-title`).addClass(`${styles.titleStyle}`);
        $(`.${props.id}-subtitle`).addClass(`${styles.subtitleStyle}`);
        $(`.${props.id}-tag`).removeClass(`${styles.tagStyleMobile}`);
        $(`.${props.id}-title`).removeClass(`${styles.titleStyleMobile}`);
        $(`.${props.id}-subtitle`).removeClass(`${styles.subtitleStyleMobile}`);
        break;
      case "mobile":
        $(`.${props.id}-tag`).addClass(`${styles.tagStyleMobile}`);
        $(`.${props.id}-title`).addClass(`${styles.titleStyleMobile}`);
        $(`.${props.id}-subtitle`).addClass(`${styles.subtitleStyleMobile}`);
        $(`.${props.id}-tag`).removeClass(`${styles.tagStyle}`);
        $(`.${props.id}-title`).removeClass(`${styles.titleStyle}`);
        $(`.${props.id}-subtitle`).removeClass(`${styles.subtitleStyle}`);
        break;
      default:
        break;
    }
  });
 */
window["responseive"] = (callback) => {
  const refresh = () => {
    var width = $(window).width();
    if (width <= 777) {
      callback("mobile");
    } else if (width > 777 && width <= 990) {
      callback("tablet");
    } else {
      callback("desktop");
    }
  };
  $(window).resize(refresh);
  $(window).ready(refresh);
  refresh();
};

window["manageResponsive"] = (props) => {
  if (
    props.showMobile === undefined ||
    props.showTablet === undefined ||
    props.showDesktop === undefined
  ) {
    console.warn("manageResponsive: not configured");
    return;
  }
  window["responseive"]((device) => {
    if (device == "mobile" && props.showMobile) {
      $(`#${props.id}`).removeClass("hide-code");
      return;
    }
    if (device == "tablet" && props.showTablet) {
      $(`#${props.id}`).removeClass("hide-code");
      return;
    }
    if (device == "desktop" && props.showDesktop) {
      $(`#${props.id}`).removeClass("hide-code");
      return;
    }
    $(`#${props.id}`).addClass("hide-code");
  });
};

window["setOpacity"] = (hex, alpha) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, 0)}`;

$(window).resize(() => {
  const width = $(window).width();
  if (width < 777) {
    window["waitForEl"]("#sticky-add-to-cart", () => {
      $("body").css("padding-bottom", $("#sticky-add-to-cart").height());
    });
  } else {
    $("body").css("padding-bottom", 0);
  }
});

$(document).ready(() => {
  const width = $(window).width();
  if (width < 777) {
    window["waitForEl"]("#sticky-add-to-cart", () => {
      $("body").css("padding-bottom", $("#sticky-add-to-cart").height());
    });
  } else {
    $("body").css("padding-bottom", 0);
  }
});

$(document).ready(() => {
  const fixWidth = () => {
    if (window.pageYOffset >= sticky) {
      $(`#menu-drawer`).css(
        "height",
        `calc(100vh - ${document.getElementById("esd-header").clientHeight}px)`
      );
    } else {
      $(`#menu-drawer`).css(
        "height",
        `calc(100vh - ${
          document.getElementById("esd-header").clientHeight
        }px - ${
          document.getElementById("shopify-section-announcement-bar")
            .clientHeight
        }px)`
      );
    }
    const width = $(window).width();
    if (width < 777) {
      $(".header__icon--menu").width($(".header__icon--cart").width());
    } else {
      $(".header__icon--menu").width("auto");
    }
  };
  fixWidth();
  setInterval(fixWidth, 1000);
});

window["reloadPage"] = () => {
  setTimeout(() => {
    window.location.reload(true);
  }, 1000);
};

window["changeTextToId"] = (id, newText) => {
  document.getElementById(id).innerText = newText;
};

window["changeHtmlToId"] = (id, newText, isBold) => {
  document.getElementById(id).innerHTML = isBold
    ? `<b>${newText}</b>`
    : newText;
};

window["selectNewVariant"] = (
  classNameAllVariants,
  variantSelected,
  classActived
) => {
  const elements = document.getElementsByClassName(classNameAllVariants);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.checked = false;
  }

  $(`.${classNameAllVariants}`).removeClass(classActived);

  document.getElementById(variantSelected).checked = true;
  $(`#${variantSelected}-label`).addClass(classActived);
};

$(".input-variant").on("change", function () {
  setTimeout(function () {
    location.reload(true);
  }, 1);
});

const navbar = document.getElementById("esd-header");
const menu = document.getElementById("menu-drawer");
const mainContent = document.getElementById("MainContent");
const sticky = navbar.offsetTop;
const mainContentMarginTop = mainContent.style.marginTop;

window.onscroll = function () {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("stickied-header");
    menu.classList.add("stickied-header");
    $("#MainContent").css("margin-top", navbar.clientHeight);
  } else {
    $("#MainContent").css("margin-top", mainContentMarginTop);
    navbar.classList.remove("stickied-header");
    menu.classList.remove("stickied-header");
  }
};
