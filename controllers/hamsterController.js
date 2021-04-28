'use strict';

const firebase = require('../db');
const Hamster = require('../models/hamster');
const firestore = firebase.firestore();


const addHamster = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('hamster').doc().set(data);
        res.send('Hamster saved successfuly');
        res.status(200).send('Hamster saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getAllHamsters = async (req, res, next) => {
    try {
        const hamsters = await firestore.collection('hamster');
        const data = await hamsters.get();
        const hamstersArray = [];
        if(data.empty) {
            res.status(404).send('No hamster record found');
        }else {
            data.forEach(doc => {
                const hamster = new Hamster(
                    doc.id,
                    doc.data().name,
                    doc.data().age,
                    doc.data().favFood,
                    doc.data().loves,
                    doc.data().imgName,
                    doc.data().wins,
                    doc.data().defeats,
                    doc.data().games
                );
                hamstersArray.push(hamster);
            });
            res.status(200).send(hamstersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getIDs = async (req, res, next) => {
    try {
        const hamsters = await firestore.collection('hamster');
        const data = await hamsters.get();
        const idArray = [];
        if(data.empty) {
            res.status(404).send('No hamster record found');
        }else {
            data.forEach(doc => {
                idArray.push(doc.id);
            });
            return idArray;
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getHamster = async (req, res, next) => {
    try {
        const id = req.params.id;
        const hamster = await firestore.collection('hamster').doc(id);
        const data = await hamster.get();
        if(!data.exists) {
            res.status(404).send('Hamster with the given ID not found');
        }else {
            res.status(200).send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a[0];
}

const getRandomHamster = async (req, res, next) => {
    try {
        const random_id_array = await getIDs(req, res, next)
        const curr_id = shuffle(random_id_array)

        const hamster = await firestore.collection('hamster').doc(curr_id);
        const data = await hamster.get();
        if(!data.exists) {
            res.status(404).send('Hamster with the given ID not found');
        }else {
            res.status(200).send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const updateHamster = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const hamster =  await firestore.collection('hamster').doc(id);
        await hamster.update(data);
        res.status(200).send('Hamster record updated successfully');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteHamster = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('hamster').doc(id).delete();
        res.status(200).send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addHamster,
    getAllHamsters,
    getHamster,
    updateHamster,
    deleteHamster,
    getRandomHamster
}