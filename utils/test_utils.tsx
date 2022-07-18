import React from "react";
import * as ReactDOMServer from "react-dom/server";

// Adds a ReactElement to the DOM (jsdom)
export function addElementToPage(element: React.ReactElement) {
	const html = ReactDOMServer.renderToString(element);

	const body_element: any = document.querySelector("body");
	body_element.innerHTML = `<main>${html}</main>`;
	const parent_element = document.querySelector("main");
	if (!parent_element) {
		throw new Error("<main /> element not found");
	}

	return parent_element;
}
