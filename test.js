'use strict';

const assert = require('assert');
const config = require('./test-config');
const jsonPatch = require('fast-json-patch');

const log = x => console.log(require('util').inspect(x, {colors: true}));
const manage = require ('./index')(config);

const COMPANY_ID = 21107;	// Janicek.co

(async () => {

    // get
    const result = await manage.get(`company/companies/${COMPANY_ID}`);
    log(result);

    // post
    const note = await manage.post(`company/companies/${COMPANY_ID}/notes`, {text: 'beep'});
    log(note);
    assert(note.text === 'beep');
    
    // patch
    const observer = jsonPatch.observe(note);
    note.text = 'boop';
    const patches = jsonPatch.generate(observer);
    const patchedNote = await manage.patch(`company/companies/${COMPANY_ID}/notes/${note.id}`, patches);
    log(patchedNote);
    assert(patchedNote.text === 'boop');
    
    // put
    const putNote = await manage.put(`company/companies/${COMPANY_ID}/notes/${note.id}`, {
        id: note.id,
        type: {id: note.type.id},
        text: 'buup'
    });
    log(putNote);
    assert(putNote.text === 'buup');
    
    // delete
    await manage.delete(`company/companies/${COMPANY_ID}/notes/${note.id}`);
    try {
        await manage.get(`company/companies/${COMPANY_ID}/notes/${note.id}`);
    } catch (error) {
        assert(error.response.status === 404);
    }

    console.log(`\n\neverything is a - ok`);
    
})().catch(error => {
    log(error);
});
