// eslint-disable
// Inspired by Elementor Releasing Pipeline https://github.com/elementor/elementor

'use strict';

const marked = require("marked");
const fs = require('fs');
const { VERSION } = process.env;

if (!VERSION) {
	console.error('missing VERSION env var');
	process.exit(1);
	return;
}

(async () => {
	try {
		const changelogText = fs.readFileSync('readme.txt', 'utf-8');
		const data = marked.lexer(changelogText);
		const headerIndex = data.findIndex((section) => section.type === 'paragraph' && section.text.startsWith(`= ${VERSION}`));
		if (headerIndex === -1) {
			console.error(`Failed to find version: ${VERSION} in readme.txt file`);
			process.exit(1);
			return;
		}
		const versionLogRaw = data[headerIndex].raw + data[headerIndex + 2].raw  + data[headerIndex + 3].raw + data[headerIndex + 5].raw + data[headerIndex + 6].raw  + data[headerIndex + 8].raw;
		const versionLogReplaceLine = versionLogRaw.replaceAll("\n", "<br />");
		const versionLogTitle = versionLogReplaceLine.replaceAll(" =", " =<br />");
		const versionLogStartTitleBold = versionLogTitle.replaceAll("= ", "<strong>");
		const versionLogEndTitleBold = versionLogStartTitleBold.replaceAll(" =", "</strong>");
		const versionLogStartPointBold = versionLogEndTitleBold.replaceAll("* ", "<strong> * ");
		const versionLogEndPointBold = versionLogStartPointBold.replaceAll(": ", ": </strong>");
		const versionLog = versionLogEndPointBold;
		fs.writeFileSync('temp-changelog-from-readme.txt', versionLog);
	} catch (err) {
		process.exit(1);
	}
})();
