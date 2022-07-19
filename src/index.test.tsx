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
import {
	HydrationStatusProvider,
	useHydrationStatus,
	Server,
	Client,
	useHydrationCompleted,
} from "./index";

const TestClientComponent = <div>Client</div>;
const TestServerComponent = <div>Server</div>;

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

	const mismatched_server = <div>This does not match the client</div>;
	const mismatched_client = <div>This does not match the server</div>;

	const parent_element = addElementToPage(mismatched_server);
	ReactDOMClient.hydrateRoot(parent_element, mismatched_client);

	// Wait for hydration to complete (and fail)
	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(mismatched_client)
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

test(`Renders client and server component together`, async () => {
	let jsx_element = (
		<HydrationStatusProvider>
			<Client>{TestClientComponent}</Client>
			<Server>{TestServerComponent}</Server>
		</HydrationStatusProvider>
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

test(`Renders client when no server is provided`, async () => {
	let jsx_element = (
		<HydrationStatusProvider>
			<Client>{TestClientComponent}</Client>
		</HydrationStatusProvider>
	);

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

test(`Renders server when no client is provided`, async () => {
	let jsx_element = (
		<HydrationStatusProvider>
			<Server>{TestServerComponent}</Server>
		</HydrationStatusProvider>
	);

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

test(`Renders empty if no client or server is provided`, async () => {
	let jsx_element = <HydrationStatusProvider></HydrationStatusProvider>;

	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual("");

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual("");
	});

	expect(console.error).not.toHaveBeenCalled();
});

test(`Renders normal content on both Client and Server`, async () => {
	let jsx_element = (
		<HydrationStatusProvider>
			<div>
				<h1>Universal Title</h1>
				<article>
					<h2>Universal Subtitle</h2>
					<Client>{TestClientComponent}</Client>
					<Server>{TestServerComponent}</Server>
				</article>
			</div>
		</HydrationStatusProvider>
	);

	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	// Snapshot of server render
	expect(parent_element.innerHTML).toMatchSnapshot();

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			expect.stringContaining(
				ReactDOMServer.renderToString(TestClientComponent)
			)
		);
	});

	// Snapshot of client render
	expect(parent_element.innerHTML).toMatchSnapshot();

	expect(console.error).not.toHaveBeenCalled();
});

test(`Renders array of ReactElements on both client and server (For cases such as passing along the "children" prop)`, async () => {
	let TestServerArray = [
		TestServerComponent,
		TestServerComponent,
		TestServerComponent,
	];
	let TestClientArray = [
		TestClientComponent,
		TestClientComponent,
		TestClientComponent,
	];

	let jsx_element = (
		<HydrationStatusProvider>
			<Client>{TestClientArray}</Client>
			<Server>{TestServerArray}</Server>
		</HydrationStatusProvider>
	);
	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual(
		ReactDOMServer.renderToString(<>{TestServerArray}</>)
	);

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(<>{TestClientArray}</>)
		);
	});

	expect(console.error).not.toHaveBeenCalled();
});

test(`useHydrationCompleted can manually test for hydration`, async () => {
	const hydrated_element = <div>hydrated</div>;
	const unhydrated_element = <div>unhydrated</div>;
	function TestComponent() {
		const isHydrated = useHydrationCompleted();

		return isHydrated ? hydrated_element : unhydrated_element;
	}

	let jsx_element = (
		<HydrationStatusProvider>
			<TestComponent />
		</HydrationStatusProvider>
	);

	const parent_element = addElementToPage(jsx_element);
	ReactDOMClient.hydrateRoot(parent_element, jsx_element);

	expect(parent_element.innerHTML).toEqual(
		ReactDOMServer.renderToString(unhydrated_element)
	);

	await waitForExpect(() => {
		expect(parent_element.innerHTML).toEqual(
			ReactDOMServer.renderToString(hydrated_element)
		);
	});

	expect(console.error).not.toHaveBeenCalled();
});
