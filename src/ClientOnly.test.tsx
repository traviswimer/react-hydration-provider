/**
 * @jest-environment jsdom
 */

// "react-dom/server" throws an error if `TextEncoder` isn't global.
// This is a workaround for running the tests in jsdom environment.
import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;

import React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as ReactDOMClient from "react-dom/client";
import waitForExpect from "wait-for-expect";

import { addElementToPage } from "../utils/test_utils";
import { ClientOnly } from "./ClientOnly";

const TestClientComponent = <div>Client</div>;

const realConsoleDotError = console.error;
beforeEach(() => {
	console.error = jest.fn();
});
afterEach(() => {
	console.error = realConsoleDotError;
});

test(`Renders client component, leaving server blank`, async () => {
	let jsx_element = <ClientOnly>{TestClientComponent}</ClientOnly>;
	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	// No server component
	expect(parent_element.innerHTML).toEqual("");

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(TestClientComponent)
		);
	});

	expect(console.error).not.toHaveBeenCalled();
});
