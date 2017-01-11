import mongoose from 'mongoose';
import Score from './score.js';
import Note from './note.js';

const barSchema = new mongoose.Schema({
    numBitBar: Number,
    referenceValueBar: Number,
    orderBar: Number,
    score: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Score'
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

let model = mongoose.model('Bar', barSchema);

export default class Bar {

    scheme() {
        return barSchema;
    }

    findAll(req, res) {
        model.find({}, (err, bars) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.json(bars);
                }
            })
            .populate('notes');
    }

    findById(req, res) {
        model.findById(req.params.id, (err, bar) => {
                if (err || !bar) {
                    res.sendStatus(403);
                } else {
                    res.json(bar);
                }
            })
            .populate('notes');
    }

    create(req, res) {
        model.create({
                numBitBar: req.body.numBitBar,
                referenceValueBar: req.body.referenceValueBar,
                orderBar: req.body.orderBar,
                score: req.body.score
            },
            (err, bar) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(bar);
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, {
            numBitBar: req.body.numBitBar,
            referenceValueBar: req.body.referenceValueBar
        }, (err, bar) => {
            if (err || !bar) {
                res.status(500).send(err.message);
            } else {
                res.json(bar);
            }
        });
    }

    delete(req, res) {
        model.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.sendStatus(200);
            }
        });
    }

    addNoteToBar(req, res) {
        model.findByIdAndUpdate(req.body.bar_id, {
                $push: {
                    notes: req.body.note_id
                }
            },
            function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.sendStatus(200);
                }
            });
    }

    deleteNoteFromBar(bar_id, note_id, res) {
        model.findByIdAndUpdate(bar_id, {
                $pull: {
                    notes: note_id
                }
            },
            function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.sendStatus(200);
                }
            });
    }
}