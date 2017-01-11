function scoreEditingController(scoreService, noteService, $location, $routeParams) {

    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.id;


    this.scoreChoice = (id) => {
        console.log(id)
        this.$location.path('/score/editing/' + id);
    };



    this.verificationdelapartition = () => {
        console.log(this.currentScoreId);
    };

    this.load = () => {

        // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBitBar = this.score.numBitBar;
            this.referenceValueBar = this.score.referenceValueBar;
            console.log("Toutes les notes présentes sur la première mesure ", this.score.notes);

            // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

            for (let note of this.score.notes) {
                this.noteService.getOne(note._id).then((res) => {
                    this.noteCURRENT.push(res.data);
                    console.log("Notes de la partition ", this.noteCURRENT);

                })
            }

        });


    };

    this.load();

    this.barCreate = () => {
        this.barService.create(this.bar).then(() => {
            this.load();
        });
    };

    // this.noteService.create(this.note).then(() => {
    //     this.load();
    // });

    this.addChiffrage = () => {

        if (this.chiffrage == "3x4") {
            this.numBitBar = 3;
            this.referenceValueBar = 4;
        } else {
            this.numBitBar = 4;
            this.referenceValueBar = 4;
        }
        this.scoreService.update(this.currentScoreId, this.numBitBar, this.referenceValueBar).then(() => {
            console.log("Chiffrage ok " + res.data._id);
        });
    };


    this.addNote = () => {

        // Requete sur la partition pour récupérer la première mesure "score.bars[0]"

        console.log("Valeur de la note : " + this.noteValue + " | Hauteur de la note : " + this.noteHeigth);

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
        });

        // Création de la note avec les valeurs saisies dans les select


        this.noteService.create(this.noteHeigth, this.noteValue, this.orderNote, this.referenceValueBar, this.orderBar).then((res) => {
            this.currentNote = res.data._id;



            console.log("Id de la nouvelle note créée " + res.data._id);

            // Ajout de la note dans la mesure récupérée

            this.scoreService.addNoteToScore(this.currentScore, this.currentNote).then(() => {
                console.log("Ajout Note dans Mesure OK");
            });

        });
    };

    this.deleteNote = () => {
        console.log("ALLO KIKOO " + this.noteHeigth)
    }
}
