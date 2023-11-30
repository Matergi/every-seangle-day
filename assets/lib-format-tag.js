window["lib-format-tag.drawLine"] = (id, line, onClick, css, textColor) => {
  const regexTag = /({[^>]+})/g;
  const tags = line.split(regexTag);
  return tags
    .map((tag, index) => {
      let text = tag;
      if (tag.match(regexTag)) {
        const internal = tag;
        console.log(internal);
        const detail = JSON.parse(internal);
        const replace = new RegExp(tag);
        text = text.replace(replace, detail.text);

        return `<span
          class="${detail.className}"
          onClick="${onClick}('${detail.id}')"
          style="color: ${textColor}; ${css}"
        >
          ${text}
        </span>
      `;
      }

      return text;
    })
    .join("");
};

window["lib-format-tag.drawLines"] = (
  id,
  index,
  otherRaws,
  onClick,
  css,
  textColor
) => `
  <div>
    ${otherRaws
      .map((raw) => {
        return `
        <section class="paragrapher ${id}-text" style="color: ${textColor};${css}">
          ${window["lib-format-tag.drawLine"](id, raw, onClick, css, textColor)}
        </section>
      `;
      })
      .join("")}
  </div>
`;

window["lib-format-tag.format"] = (
  id,
  text,
  heightBreakLine = "40px",
  onClick,
  css,
  textColor
) => {
  return text
    .split("/n")
    .map((i, index) => {
      if (i === "") {
        return `<div class="${id}-text" style="height: ${heightBreakLine}" style="color: ${textColor}; ${css}" />`;
      }

      return window["lib-format-tag.drawLines"](
        id,
        index,
        i.split("/m"),
        onClick,
        css,
        textColor
      );
    })
    .join("");
};
