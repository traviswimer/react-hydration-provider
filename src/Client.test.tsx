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

import { ClientAndServer } from "./ClientAndServer";

const TestClientComponent = <div>Client</div>;
const TestServerComponent = <div>Server</div>;

// Adds a ReactElement to the DOM (jsdom)
function addElementToPage(element: React.ReactElement) {
	const html = ReactDOMServer.renderToString(element);

	const body_element: any = document.querySelector("body");
	body_element.innerHTML = `<main>${html}</main>`;
	const parent_element = document.querySelector("main");
	if (!parent_element) {
		throw new Error("<main /> element not found");
	}

	return parent_element;
}

const realConsoleDotError = console.error;

beforeEach(() => {
	console.error = jest.fn();
});

afterEach(() => {
	console.error = realConsoleDotError;
});

test(`Errors if there is a hydration mismatch`, async () => {
	// This test is kind of silly, but we need to ensure that console.error() is called
	// when there is a hydration mismatch. This allows our other tests to use
	// console.error() as a reliable way to detect whether a hydration error occurred.

	const mismatched_server = <div>This doesn't match</div>;
	let jsx_element = (
		<ClientAndServer
			Server={TestServerComponent}
			Client={TestClientComponent}
		/>
	);
	const parent_element = addElementToPage(mismatched_server);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(TestClientComponent)
		);
	});

	expect(jest.mocked(console.error).mock.calls[0][0]).toEqual(
		expect.stringContaining("Text content did not match.")
	);
	expect(jest.mocked(console.error).mock.calls[1][0]).toEqual(
		expect.stringContaining("An error occurred during hydration.")
	);
	expect(jest.mocked(console.error).mock.calls[2][0].message).toEqual(
		expect.stringContaining("Text content does not match server-rendered HTML.")
	);
	expect(jest.mocked(console.error).mock.calls[3][0].message).toEqual(
		expect.stringContaining(
			"There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."
		)
	);
	expect(jest.mocked(console.error).mock.calls[4]).toBeUndefined();
});

test(`Renders client component when server component is provided`, async () => {
	let jsx_element = (
		<ClientAndServer
			Server={TestServerComponent}
			Client={TestClientComponent}
		/>
	);
	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual(
		ReactDOMServer.renderToString(TestServerComponent)
	);

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(TestClientComponent)
		);
	});

	expect(console.error).not.toHaveBeenCalled();
});

test(`Renders client component when no server component is provided`, async () => {
	let jsx_element = <ClientAndServer Client={TestClientComponent} />;

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

test(`Renders empty if no client component is provided`, async () => {
	let jsx_element = <ClientAndServer Server={TestServerComponent} />;

	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual(
		ReactDOMServer.renderToString(TestServerComponent)
	);

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual("");
	});

	expect(console.error).not.toHaveBeenCalled();
});

test(`Renders empty if no client or server component is provided`, async () => {
	let jsx_element = <ClientAndServer />;

	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual("");

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual("");
	});

	expect(console.error).not.toHaveBeenCalled();
});
