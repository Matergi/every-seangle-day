window["lib-scroll-controller-created"] = {};
window["lib-scroll-history"] = {};
window["lib-scroll-magic-scenes"] = {};
window["lib-scroll-configs"] = {};

window["lib-scroll-reset-vars"] = () => {
  window["lib-scroll-controller-created"] = {};
  window["lib-scroll-history"] = {};
  window["lib-scroll-magic-scenes"] = {};
  window["lib-scroll-configs"] = {};
};

$(window).on("resize", function () {
  const height = $(window).height();
  Object.keys(window["lib-scroll-configs"]).forEach((key) => {
    window["lib-scroll-configs"][key].onChangeHeight &&
      window["lib-scroll-configs"][key].onChangeHeight(height);
    window["lib-scroll-configs"][key].reset &&
      window["lib-scroll-configs"][key].reset();
  });
});

window["lib-scroll-useScroll"] = (config) => {
  const width = $(window).width();
  const height = $(window).height();

  window["lib-scroll-configs"][config.id] = config;

  const component = document.getElementById(config.id);
  if (component && component.getBoundingClientRect().top < 0) {
    component.classList.add("noAnimation");

    setTimeout(() => {
      component.classList.remove("noAnimation");
    }, 1000);
  }

  if (!window["lib-scroll-controller-created"][config.id]) {
    window["lib-scroll-controller-created"][config.id] =
      new ScrollMagic.Controller({
        refreshInterval: 100,
      });
  }

  const currentGsap = config.gsap && config.gsap();
  const gsapTweens = currentGsap && currentGsap.tweens;
  if (gsapTweens) {
    Object.keys(gsapTweens).forEach((key) => {
      // if (gsap[config.id] && gsap[config.id][key]) {
      //   return;
      // }
      if (!gsap[config.id]) {
        gsap[config.id] = {};
      }
      gsap[config.id][key] = gsapTweens[key];
      gsap[config.id][key].pause();
      gsap[config.id][key].progress(0);
    });
  }

  let scrollMagicSceneInit = window["lib-scroll-magic-scenes"][config.id]
    ? window["lib-scroll-magic-scenes"][config.id]
    : new ScrollMagic.Scene({
        triggerElement: `#${config.id}`,
        ...config.options,
        duration:
          config.options.durationRelativeHeight !== undefined
            ? height * config.options.durationRelativeHeight
            : config.options.duration
            ? config.options.duration
            : 0,
        // eslint-disable-next-line no-nested-ternary
      });

  scrollMagicSceneInit.addTo(
    window["lib-scroll-controller-created"][config.id]
  );
  config.debug && scrollMagicSceneInit.addIndicators({ name: config.id });
  config.pin &&
    scrollMagicSceneInit.setPin(`#${config.pin}`, {
      pushFollowers:
        config.pushFollowers !== undefined ? config.pushFollowers : true,
    });

  scrollMagicSceneInit.on("progress", (event) => {
    if (
      window["lib-scroll-history"] &&
      window["lib-scroll-history"][config.id] &&
      config.oneShot
    ) {
      return;
    }

    if (
      window["lib-scroll-history"] &&
      window["lib-scroll-history"][config.id] &&
      window["lib-scroll-history"][config.id].progress === event.progress
    ) {
      return;
    }

    const object = {
      progress: event.progress ?? 0,
      scrollDirection: event.scrollDirection,
      tweens: gsap[config.id],
      element: document.getElementById(config.id),
    };

    if (config.toggleClass) {
      if (event.progress > 0) {
        document.getElementById(config.id) &&
          document.getElementById(config.id).classList.add(config.toggleClass);
      } else if (event.progress === 0) {
        document.getElementById(config.id) &&
          document
            .getElementById(config.id)
            .classList.remove(config.toggleClass);
      }
    }

    if (config.sideEffects) {
      config.sideEffects.forEach((sideEffect) => {
        if (sideEffect.toggleClass) {
          if (event.progress > 0) {
            document.getElementById(sideEffect.id) &&
              document
                .getElementById(sideEffect.id)
                .classList.add(sideEffect.toggleClass);
          } else if (event.progress === 0) {
            document.getElementById(sideEffect.id) &&
              document
                .getElementById(sideEffect.id)
                .classList.remove(sideEffect.toggleClass);
          }
        }
        if (sideEffect.activeClass) {
          if (event.progress === 0) {
            document.getElementById(sideEffect.id) &&
              document
                .getElementById(sideEffect.id)
                .classList.add(sideEffect.activeClass);
          } else if (event.progress === 1) {
            document.getElementById(sideEffect.id) &&
              document
                .getElementById(sideEffect.id)
                .classList.remove(sideEffect.activeClass);
          } else {
            document.getElementById(sideEffect.id) &&
              document
                .getElementById(sideEffect.id)
                .classList.add(sideEffect.activeClass);
          }
        }
        if (sideEffect.manipolating) {
          sideEffect.manipolating({
            ...object,
            element: document.getElementById(sideEffect.id),
          });
        }
      });
    }

    config.callback && config.callback(object);

    window["lib-scroll-history"][config.id] = object;
  });

  scrollMagicSceneInit.trigger("progress");
};

window["lib-scroll-playStates"] = {
  play: "play",
  reverse: "reverse",
  stop: "stop",
  pause: "pause",
};

window["lib-scroll-setPlayState"] = (playState, prevPlayState, tween) => {
  if (playState && playState !== prevPlayState) {
    if (playState === window["lib-scroll-playStates"].play) {
      if (
        prevPlayState === window["lib-scroll-playStates"].pause ||
        prevPlayState === window["lib-scroll-playStates"].reverse
      ) {
        tween.play();
      } else {
        tween.restart(true);
      }
    } else if (playState === window["lib-scroll-playStates"].reverse) {
      if (
        prevPlayState === window["lib-scroll-playStates"].pause ||
        prevPlayState === window["lib-scroll-playStates"].play
      ) {
        tween.reverse();
      } else {
        tween.reverse(0);
      }
    } else if (playState === window["lib-scroll-playStates"].stop) {
      tween.pause(0);
    } else if (playState === window["lib-scroll-playStates"].pause) {
      tween.pause();
    }
  }
};

window["lib-scroll-callTweenFunction"] = (
  tweenFunction,
  functionName,
  params,
  returnFunction
) => {
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach((tween) => {
      if (!params && returnFunction) {
        params = [tween[returnFunction].apply(tween)];
      }
      tween[functionName].apply(tween, params);
    });
  } else {
    if (!params && returnFunction) {
      params = [tweenFunction[returnFunction].apply(tweenFunction)];
    }
    tweenFunction[functionName].apply(tweenFunction, params);
  }
};

window["lib-scroll-isEqual"] = (obj1, obj2) =>
  // very easy equal check
  // attention: if the order of properties are different it returns false
  JSON.stringify(obj1) === JSON.stringify(obj2);
const refOrInnerRef = (child) => {
  if (
    child.type.$$typeof &&
    child.type.$$typeof.toString() === "Symbol(react.forward_ref)"
  ) {
    return "ref";
  }

  // styled-components < 4
  if (child.type.styledComponentId) {
    return "innerRef";
  }

  return "ref";
};

window["lib-scroll-hex"] = (c) => {
  const s = "0123456789abcdef";
  let i = parseInt(c);
  if (i === 0 || isNaN(c)) {
    return "00";
  }
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
};

/* Convert an RGB triplet to a hex string */
window["lib-scroll-convertToHex"] = (rgb) => {
  return (
    window["lib-scroll-hex"](rgb[0]) +
    window["lib-scroll-hex"](rgb[1]) +
    window["lib-scroll-hex"](rgb[2])
  );
};

/* Remove '#' in color hex string */
window["lib-scroll-trim"] = (s) => {
  return s.charAt(0) === "#" ? s.substring(1, 7) : s;
};

/* Convert a hex string to an RGB triplet */
window["lib-scroll-convertToRGB"] = (_hex) => {
  const color = [];
  color[0] = parseInt(window["lib-scroll-trim"](_hex).substring(0, 2), 16);
  color[1] = parseInt(window["lib-scroll-trim"](_hex).substring(2, 4), 16);
  color[2] = parseInt(window["lib-scroll-trim"](_hex).substring(4, 6), 16);
  return color;
};

window["lib-scroll-generateColor"] = (colorStart, colorEnd, colorCount) => {
  // The beginning of your gradient
  const start = window["lib-scroll-convertToRGB"](colorStart);

  // The end of your gradient
  const end = window["lib-scroll-convertToRGB"](colorEnd);

  // The number of colors to compute
  const len = colorCount;

  // Alpha blending amount
  let alpha = 0.0;

  const saida = [];

  for (let i = 0; i < len; i++) {
    const c = [];
    alpha += 1.0 / len;

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.push(window["lib-scroll-convertToHex"](c));
  }

  return saida;
};
