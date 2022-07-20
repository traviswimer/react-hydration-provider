/**
 * @jest-environment jsdom
 */

// "react-dom/server" throws an error if `TextEncoder` isn't global.
// This is a workaround for running the tests in jsdom environment.
import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;

import React from "react";
import * as ReactDOMServer from "react-dom/server";

import createComponents from "./createComponents";

const TestClientComponent = <div>Client</div>;
const TestServerComponent = <div>Server</div>;

test(`Renders only <Server> when not hydrated`, async () => {
	const hydrated = false;
	const { Server, Client } = createComponents(() => hydrated);

	let jsx_element = (
		<>
			<Server>{TestServerComponent}</Server>
			<Client>{TestClientComponent}</Client>
		</>
	);

	expect(ReactDOMServer.renderToString(jsx_element)).toEqual(
		ReactDOMServer.renderToString(TestServerComponent)
	);
});
test(`Renders only <Client> component when hydrated`, async () => {
	const hydrated = true;
	const { Server, Client } = createComponents(() => hydrated);

	let jsx_element = (
		<>
			<Server>{TestServerComponent}</Server>
			<Client>{TestClientComponent}</Client>
		</>
	);

	expect(ReactDOMServer.renderToString(jsx_element)).toEqual(
		ReactDOMServer.renderToString(TestClientComponent)
	);
});
