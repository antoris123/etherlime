const circom = require("circom");
const fs = require("fs");
const dir = require("node-dir");
const path = require("path");

const circuitsPath = './zero-knowledge-proof/circuits';
const compiledCircuits = './zero-knowledge-proof/compiled-circuits';

const run = async () => {

	createZKProofCompiledCircuitFolder()
	const circuitFiles = await findFiles(circuitsPath);
	await compileCircuits(circuitFiles);
	console.log('===== Compilation Finished =====');
};

let findFiles = async (workingDirectory) => {

	try {
		let files = [];
		await fs.readdirSync(workingDirectory).forEach(function (file) {
			let currentPath = path.join(workingDirectory, file);
			files.push(currentPath)
		});

		files = files.filter(function (file) {
			return path.extname(file) == ".circom" && path.basename(file)[0] != ".";
		});
		return files;
	} catch (err) {
		throw err;
	}
}

const createZKProofCompiledCircuitFolder = () => {
	if (!fs.existsSync(compiledCircuits)) {
		console.log('===== Creating ZK Proof compiled folder =====');
		fs.mkdirSync(compiledCircuits);
	}
}

const compileCircuits = async (circuitFiles) => {
	console.log('===== Compiling your circuits =====');
	for (circuitFile of circuitFiles) {
		let extension = path.extname(circuitFile, 'circom');
		let nameOfFile = path.basename(circuitFile, extension);
		let compiledCir = await circom.compile(circuitFile);
		fs.writeFileSync(`${compiledCircuits}/${nameOfFile}.json`, JSON.stringify(compiledCir, null, 1), "utf8")
	}
}

module.exports = {
	run,
	findFiles
}