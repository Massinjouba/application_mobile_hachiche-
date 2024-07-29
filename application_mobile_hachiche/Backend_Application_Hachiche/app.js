const express = require('express');
const cors = require('cors');
const plantulesRouter = require('./routes/plantules');
const entreposageRouter = require('./routes/entreposage');
const modificationRouter = require('./routes/Modification');
const responsableDecontaminationRouter = require('./routes/responsableDecontamination');
const loginRouter = require('./routes/routeAuth');
const registerRouter = require('./routes/Register');
const uploadRouter = require('./routes/Upload');
const historiqueRouter = require('./routes/Historique');

const app = express();

app.use(cors());
app.use(express.json());

// Utiliser les routes pour chaque modèle
app.use('/plantules', plantulesRouter);
app.use('/entreposage', entreposageRouter);
app.use('/modification', modificationRouter);
app.use('/responsabledecontamination', responsableDecontaminationRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/upload', uploadRouter);
app.use('/historique', historiqueRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
