const pageTitleSuffix = ' | Indian Court';

export const setPageTitle = title => {
  let fullTitle = `${title} ${pageTitleSuffix}`;
  //remove double-spaces
  fullTitle = fullTitle.replace(/\s\s+/g, ' ');

  window.document.title = fullTitle;
};
