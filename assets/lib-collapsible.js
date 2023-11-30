window["collapse"] = (id, childId) => {
  const element = $(`#${id}`);
  const child = $(`#${childId}`);

  const height = element.height();
  const heightChild = child.height();

  const paddingBottom = $("#sticky-add-to-cart").height();

  if (height > 0) {
    element.height(0);
    $("body").css("padding-bottom", paddingBottom - heightChild);
  } else {
    element.height(heightChild);
    $("body").css("padding-bottom", paddingBottom + heightChild);
  }

  setTimeout(() => {}, 0);
};
