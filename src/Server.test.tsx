import React from "react";
import * as ReactDOMServer from "react-dom/server";

import { ClientAndServer } from "./ClientAndServer";

const TestClientComponent = <div>Client</div>;
const TestServerComponent = <div>Server</div>;

test(`Renders server component when client component is not provided`, () => {
	const html = ReactDOMServer.renderToString(
		<ClientAndServer Server={TestServerComponent} />
	);

	expect(html).toEqual(ReactDOMServer.renderToString(TestServerComponent));
});

test(`Renders server component when client component is provided`, () => {
	const html = ReactDOMServer.renderToString(
		<ClientAndServer
			Client={TestClientComponent}
			Server={TestServerComponent}
		/>
	);

	expect(html).toEqual(ReactDOMServer.renderToString(TestServerComponent));
});

test(`Renders empty if no server component provided`, () => {
	const html = ReactDOMServer.renderToString(
		<ClientAndServer Client={TestClientComponent} />
	);
	expect(html.length).toEqual(0);
});

test(`Renders empty if no server or client component provided`, () => {
	const html = ReactDOMServer.renderToString(<ClientAndServer />);
	expect(html.length).toEqual(0);
});
