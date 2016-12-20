/* jshint
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, esversion: 6, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: false, multistr: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

'use strict';

const assert = require('assert');
const config = require('./test-config');
const jsonPatch = require('fast-json-patch');
const log = x => console.log(require('util').inspect(x, {colors: true}));

const psa = require ('./index')(config);

const COMPANY_ID = 21107;	// Janicek.co

// get
psa.get(`company/companies/${COMPANY_ID}`)
	.then(result => {
		log(result);
// post
		return psa.post(`company/companies/${COMPANY_ID}/notes`, {text: 'beep'});
	}).then(note => {
		log(note);
		assert(note.text === 'beep');
// patch
		const observer = jsonPatch.observe(note);
		note.text = 'boop';
		const patches = jsonPatch.generate(observer);
		return psa.patch(`company/companies/${COMPANY_ID}/notes/${note.id}`, patches);
	}).then(note => {
		log(note);
		assert(note.text === 'boop');
// put
		return psa.put(`company/companies/${COMPANY_ID}/notes/${note.id}`, {
			type: {id: note.type.id},
			noteId: note.id,
			text: 'buup'
		});
	}).then(note => {
		log(note);
		assert(note.text === 'buup');
// delete
		return psa.delete(`company/companies/${COMPANY_ID}/notes/${note.id}`);
	}).then(data => {
		log(data);
		console.log(`winning!!!`);
	}).catch(error => {
		log({error, response: error.response});
	});
