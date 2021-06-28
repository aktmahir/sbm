import React from "react";

export default (escapedHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: escapedHTML } });
